# Create NAT Gateway

Based on instructions from
https://developers.google.com/compute/docs/networking#natgateway

## Create instance

gcloud compute instances create "project-nat" \
--description="NATs outgoing internet for nodes" --zone "europe-west1-c" \
--no-boot-disk-auto-delete \
--machine-type "f1-micro" --can-ip-forward \
--image=debian-7-backports \
--tags "project-nat" --metadata-from-file "startup-script=startup-scripts/configure-nat-gw.sh"

## Create Network route

gcloud compute routes create "no-ip-internet-route" \
--destination-range "0.0.0.0/0" \
--next-hop-instance-zone europe-west1-c --next-hop-instance=project-nat --tags "project-noip" --priority 200
