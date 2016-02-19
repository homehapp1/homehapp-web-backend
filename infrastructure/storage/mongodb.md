# MongoDB (click-to-deploy installation)

Documentation variables used:

[user]:             username of the user you use to login to the nodes
[project-name]:     Name of the project (no spaces or special characters)

[primary-node]:     name of the created mongodb node which currently acts as PRIMARY
[secondary-node]:   name of the created mongodb node(s) which currently acts as SECONDARY
[arbiter-node]:     name of the created mongodb node(s) which currently acts as ARBITER

[project-db]:               name of the database used for project
[project-staging-db]:       name of the database used for staging project
[project-db-password]:      password for project production db user
[project-stg-db-password]:  password for project staging db user

[site-user-admin-pwd]:      password for mongo site admin
[cluster-admin-pwd]:        password for mongo cluster admin
[stackdriver-user-pwd]:     password for mongo stackdriver agent user

[stackdriver-api-key]:      API key for Stackdriver

Project values:

[user]:               homehapp
[project-name]:       homehapp
[project-db]:         homehapp
[project-staging-db]: homehapp-staging
[project-db-password]: NPUPZZD6Qocrh2o8diDhkXO4KtkXRRmp
[project-stg-db-password]: hSXDuC2VX850FjfQEV+5HFYYrPfw55F0

[site-user-admin-pwd]:  JHEofC/L+W0OyKbpo5UsSj+urvj62NlH
[cluster-admin-pwd]:    FdN4ihookJr/u1W1u8iojfyEctzoeqA9
[stackdriver-user-pwd]: b4LShj3XstyGZWdtLAHCYXAXmKzRZZtB

[stackdriver-api-key]:  N0XPSONDEIPQHLQDAV0WKDCPB6FTBXI8

We will do some after deployment optimizations to the Nodes following best practises from:
https://docs.mongodb.org/ecosystem/platforms/google-compute-engine/


## Execute the Deploy

After the deployment is done,
remove the public IPs form the nodes. (This ofcourse means you have to SSH to them through maintainance node)

Add the following tag to all the instances: "project-noip"

## Configure Nodes

After initial SSH connection to the node:

Add following to the end of ~/.bashrc -file
```
export LC_ALL=en_US.UTF-8
```

Logout and Login again

### Optimize Primary and Secondary nodes

Edit /etc/fstab and add the following after the "defaults" setting:

    ,auto,noatime,noexec

Ie.

    /dev/disk/by-id/google-hhmongo-db-9kx9-data /mnt/mongodb ext4 defaults,auto,noatime,noexec 0 0

Edit /etc/mongod.conf (append to the end)

```
# Qvik config
auth = true
nohttpinterface = true
keyFile=/mnt/mongodb/.mongodb-key.pem
```

NOTE! Following command is only done in Primary node. Copy the contents to other nodes

sudo su
openssl rand -base64 741 > /mnt/mongodb/.mongodb-key.pem
exit

sudo chown mongodb:mongodb /mnt/mongodb/.mongodb-key.pem
sudo chmod 0600 /mnt/mongodb/.mongodb-key.pem

Edit /etc/security/limits.conf (append)

```
mongodb soft nofile 64000
mongodb hard nofile 64000
mongodb soft nproc 32000
mongodb hard nproc 32000
```

Edit /etc/security/limits.d/90-nproc.conf

```
mongodb soft nproc 32000
mongodb hard nproc 32000
```

sudo blockdev --setra 32 /dev/sdb
echo 'ACTION=="add", KERNEL=="sdb", ATTR{bdi/read_ahead_kb}="16"' | sudo tee -a /etc/udev/rules.d/85-mongod.rules

echo 300 | sudo tee /proc/sys/net/ipv4/tcp_keepalive_time
echo "net.ipv4.tcp_keepalive_time = 300" | sudo tee -a /etc/sysctl.conf

sudo service mongod stop
sudo service mongod start

### Configure Primary mongodb

mongo

```
use admin
db.createUser(
  {
    user: "siteUserAdmin",
    pwd: "[site-user-admin-pwd]",
    roles:
    [
      {
        role: "userAdminAnyDatabase",
        db: "admin"
      }
    ]
  }
)
exit
```

mongo -u siteUserAdmin -p '[site-user-admin-pwd]' --authenticationDatabase admin

```
use admin
db.createUser(
  {
    user: "clusterAdmin",
    pwd: "[cluster-admin-pwd]",
    roles:
    [
      {
        role: "clusterAdmin",
        db: "admin"
      }
    ]
  }
)
db.createUser(
  {
    user: "stackdriverUser",
    pwd: "[stackdriver-user-pwd]",
    roles: [
      {role: "dbAdminAnyDatabase", db: "admin"},
      {role: "clusterAdmin", db: "admin"},
      {role: "readAnyDatabase", db: "admin"}
    ]
  }
)
use [project-db]
db.createUser(
    {
      user: "[project-name]",
      pwd: "[project-db-password]",
      roles: [ "dbAdmin", "readWrite" ]
    }
)
use [project-staging-db]
db.createUser(
    {
      user: "[project-name]",
      pwd: "[project-stg-db-password]",
      roles: [ "dbAdmin", "readWrite" ]
    }
)
```
use homehapp-staging
db.createUser(
    {
      user: "homehapp",
      pwd: "[project-stg-db-password]",
      roles: [ "dbAdmin", "readWrite" ]
    }
)

### Configure Arbiter node

Edit /etc/mongod.conf (append to the end)

```
# Qvik config
auth = true
keyFile=/home/[user]/.mongodb-key.pem
```

Copy .mongodb-key.pem from Primary to /home/[user]/.mongodb-key.pem

sudo chown mongodb:mongodb /home/[user]/.mongodb-key.pem
sudo chmod 0600 /home/[user]/.mongodb-key.pem

sudo service mongod stop
sudo service mongod start

# Configure Stackdriver agent on nodes (PRIMARY, SECONDARY)

Get your API key from https://app.google.stackdriver.com/settings/apikeys

Edit /etc/default/stackdriver-agent

```
STACKDRIVER_API_KEY="[stackdriver-api-key]"
```

Edit /opt/stackdriver/collectd/etc/collectd.d/mongodb.conf

```
    User "stackdriverUser"
    Password "[stackdriver-user-pwd]"
```

sudo service stackdriver-agent restart

# Dump staging data to production

mongodump -u homehapp -p 'hSXDuC2VX850FjfQEV+5HFYYrPfw55F0' --db homehapp-staging
mongorestore -u homehapp -p 'NPUPZZD6Qocrh2o8diDhkXO4KtkXRRmp' --db homehapp dump/homehapp-staging

mongo -u homehapp -p 'NPUPZZD6Qocrh2o8diDhkXO4KtkXRRmp' homehapp
