#!/bin/sh
if [ "$1" != 'site' ] && [ "$1" != 'admin' ] && [ "$1" != 'api' ] ; then
  echo "Usage: ./deploy.sh (site|api|admin) (stg|prod)";
  exit 0;
fi

if  [ "$2" != 'stg' ] && [ "$2" != 'prod' ] ; then
  echo "Usage: ./deploy.sh $1 (stg|prod)";
  exit 0;
fi

echo "# Run npm run test-$1";

if npm run "test-$1"; then
  echo "# Tests passed";
else
  echo "# Tests failed, refuse to deploy";
  #exit 1;
fi


if [ "$3" == 'dry' ] ; then
  echo "# Would run:";
  echo "export PROJECT_ID=homehappweb";
  export PROJECT_ID=homehappweb;
  echo "export TARGET=$1";
  export TARGET=$1;
  echo "export CLUSTER_ENV=$2";
  export CLUSTER_ENV=$2;
  echo "gcloud config set project \$PROJECT_ID";
  echo "./support/createContainers.sh \$CLUSTER_ENV \$TARGET";

  if [ "$1" != "api" ]; then
    echo "npm run \"build-\$TARGET\"";
    echo "npm run \"distribute-\$TARGET\"";
  fi
  echo "./support/updateCluster.sh \$CLUSTER_ENV \$TARGET";
  exit 1;
fi

export PROJECT_ID=homehappweb
export TARGET=$1
export CLUSTER_ENV=$2
gcloud config set project $PROJECT_ID
echo "EXEC: ./support/createContainers.sh $CLUSTER_ENV $TARGET";
./support/createContainers.sh $CLUSTER_ENV $TARGET

if [ "$1" != "api" ]; then
  echo "------";
  echo "EXEC: npm run build-$TARGET";
  npm run "build-$TARGET"

  echo "------";
  echo "EXEC: npm run distribute-$TARGET";
  npm run "distribute-$TARGET"
fi

echo "------";
echo "EXEC: ./support/updateCluster.sh $CLUSTER_ENV $TARGET";
./support/updateCluster.sh $CLUSTER_ENV $TARGET
