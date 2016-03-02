#! /bin/sh

# Do not change these
REV=`git rev-parse --short HEAD`
CWD=`pwd`
CONTAINER_REGISTRY_HOST=eu.gcr.io
ENV=$1
PNAME="$2-$ENV"
PBNAME="$2"
CLUSTER_NAME="homehapp-$ENV"
CLUSTER_GOOGLE_NAME=""

REPLICAS=2
MEM="400Mi"
CPU="80m"

function printUsage() {
  echo "Required environment variables:"
  echo "  PROJECT_ID:     Google Project ID"
  echo ""
  echo "Usage PROJECT_ID=id ./support/updateCluster.sh [stg,prod] [project_name]"
  echo "Add -d for dry-run"
}
function printUsageAndExit() {
  printUsage
  exit
}

if [ "$PROJECT_ID" = "" ]; then
  echo "No Google Project ID defined!"
  printUsageAndExit
fi

if [ "$ENV" = "" ]; then
  echo "No environment defined!"
  printUsageAndExit
fi

if [ "$PNAME" = "" ]; then
  echo "No project defined!"
  printUsageAndExit
fi

if [ "$PBNAME" = "api" ]; then
  if [ "$ENV" = "prod" ]; then
    REPLICAS=4
    MEM="1200Mi"
    CPU="200m"
  fi
fi

function setContext() {
  if [ "$CLUSTER_GOOGLE_NAME" = "" ]; then
    CLUSTER_GOOGLE_NAME=`kubectl config view | awk '{print $2}' | grep $CLUSTER_NAME | tail -n 1`
  fi

  if [ "$1" = "-d" ]; then
    echo "Execute: 'kubectl config use-context $CLUSTER_GOOGLE_NAME'"
  else
    kubectl config use-context $CLUSTER_GOOGLE_NAME
  fi
}

function updateCluster() {
  local SOURCE_CONFIG="$CWD/infrastructure/configs/$ENV/project-controller-tpl.json"
  local TARGET_CONFIG="$CWD/tmp/$PNAME-controller.json"
  local TMP_FILE="/tmp/$PNAME-controller.json"
  local CURRENT_CONTROLLER=`kubectl get rc | grep $PROJECT_ID | awk '{print $1}' | grep "$PNAME-controller"`

  sed "s/:PROJECT_NAME/$PNAME/g" $SOURCE_CONFIG > $TARGET_CONFIG
  sed "s/:PROJECT_BASE_NAME/$PBNAME/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:PROJECT_ID/$PROJECT_ID/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:CONTROLLER_NAME/$PNAME-controller-$REV/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:REV/$REV/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:ENV/$ENV/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:REPLICAS/$REPLICAS/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:CPU/$CPU/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:MEM/$MEM/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG

  if [ "$1" = "-d" ]; then
    echo "Executing: 'kubectl rolling-update $CURRENT_CONTROLLER -f $CWD/tmp/$PNAME-controller.json' --update-period=20s"
  else
    kubectl rolling-update $CURRENT_CONTROLLER -f "$CWD/tmp/$PNAME-controller.json" --update-period=20s
    rm $TARGET_CONFIG
  fi
}

function updateProxyCluster() {
  local SOURCE_CONFIG="$CWD/infrastructure/configs/$ENV/proxy-controller-tpl.json"
  local TARGET_CONFIG="$CWD/tmp/$PNAME-proxy-controller.json"
  local TMP_FILE="/tmp/$PNAME-proxy-controller.json"
  local UC_PNAME=`echo "${PBNAME}_${ENV}" | awk '{print toupper($0)}'`
  local CURRENT_CONTROLLER=`kubectl get rc | grep $PROJECT_ID | awk '{print $1}' | grep "$PNAME-proxy-controller"`

  local SERVICE_HOST="${UC_PNAME}_SERVICE_HOST"
  local SERVICE_PORT="${UC_PNAME}_SERVICE_PORT_ENDPOINT"

  sed "s/:PROJECT_NAME/$PNAME-proxy/g" $SOURCE_CONFIG > $TARGET_CONFIG
  sed "s/:PROJECT_ID/$PROJECT_ID/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:CONTROLLER_NAME/$PNAME-proxy-controller-$REV/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:REV/$REV/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:ENV/$ENV/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:SERVICE_HOST/$SERVICE_HOST/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:SERVICE_PORT/$SERVICE_PORT/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG

  if [ "$1" = "-d" ]; then
    echo "Executing: 'kubectl rolling-update $CURRENT_CONTROLLER -f $CWD/tmp/$PNAME-proxy-controller.json'"
  else
    kubectl rolling-update $CURRENT_CONTROLLER -f "$CWD/tmp/$PNAME-proxy-controller.json"
    rm $TARGET_CONFIG
  fi
}

if [ "$3" = "-d" ]; then
  echo "In Dry-Run mode"
fi

setContext $3

echo ""
echo "Updating Cluster Pods for project '$PBNAME' to revision $REV for environment $ENV"

updateCluster $3

# if [ "$ENV" = "prod" ]; then
#   echo ""
#   echo "Updating Proxy Cluster"
#
#   updateProxyCluster $3
# fi

echo ""
echo "Finished"
