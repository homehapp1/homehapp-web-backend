#! /bin/sh

# Do not change these
REV=`git rev-parse --short HEAD`
CWD=`pwd`
CONTAINER_REGISTRY_HOST=eu.gcr.io
ENV="prod"
PNAME="$1-$ENV"
PBNAME="$1"

function printUsage() {
  echo "Required environment variables:"
  echo "  PROJECT_ID:     Google Project ID"
  echo ""
  echo "Usage PROJECT_ID=id ./support/production/updateCluster.sh [project_name]"
}
function printUsageAndExit() {
  printUsage
  exit
}

if [ "$PROJECT_ID" = "" ]; then
  echo "No Google Project ID defined!"
  printUsageAndExit
fi

if [ "$PNAME" = "" ]; then
  echo "No project defined!"
  printUsageAndExit
fi

if [ "$ENV" = "" ]; then
  echo "No environment defined!"
  printUsageAndExit
fi

function configGCloud() {
  local CLUSTER_NAME=`gcloud beta container clusters list --project $PROJECT_ID | awk '{print $1}' | grep "$PNAME"`
  echo "Executing: 'gcloud config set container/cluster $CLUSTER_NAME'"
  gcloud config set container/cluster $CLUSTER_NAME

  local CLUSTER_GOOGLE_NAME=`kubectl config view | awk '{print $2}' | grep $CLUSTER_NAME | tail -n 1`
  echo "Executing: 'kubectl config use-context $CLUSTER_GOOGLE_NAME'"
  kubectl config use-context $CLUSTER_GOOGLE_NAME
}

function updateCluster() {
  local SOURCE_CONFIG="$CWD/infrastructure/configs/prod/project-controller-tpl.json"
  local TARGET_CONFIG="$CWD/tmp/$PNAME-controller.json"
  local TMP_FILE="/tmp/$PNAME-controller.json"
  local CURRENT_CONTROLLER=`kubectl get rc | grep $PROJECT_ID | awk '{print $1}' | grep "$PNAME-controller"`

  sed "s/:PROJECT_NAME/$PNAME/g" $SOURCE_CONFIG > $TARGET_CONFIG
  sed "s/:PROJECT_BASE_NAME/$PBNAME/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:PROJECT_ID/$PROJECT_ID/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:CONTROLLER_NAME/$PNAME-controller-$REV/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:REV/$REV/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:ENV/$ENV/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG

  echo "Executing: 'kubectl rolling-update $CURRENT_CONTROLLER -f $CWD/tmp/$PNAME-controller.json'"
  kubectl rolling-update $CURRENT_CONTROLLER -f "$CWD/tmp/$PNAME-controller.json"
  rm $TARGET_CONFIG
}

function updateProxyCluster() {
  local SOURCE_CONFIG="$CWD/infrastructure/configs/prod/proxy-controller-tpl.json"
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

  echo "Executing: 'kubectl rolling-update $CURRENT_CONTROLLER -f $CWD/tmp/$PNAME-proxy-controller.json'"
  kubectl rolling-update $CURRENT_CONTROLLER -f "$CWD/tmp/$PNAME-proxy-controller.json"
  rm $TARGET_CONFIG
}

configGCloud

echo ""
echo "Updating Cluster Pods for project '$PNAME' to revision $REV for environment $ENV"

updateCluster

echo ""
echo "Updating Proxy Cluster"

updateProxyCluster

echo ""
echo "Finished"
