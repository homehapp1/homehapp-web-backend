#! /bin/sh

# Do not change these
REV=`git rev-parse --short HEAD`
CWD=`pwd`
CONTAINER_REGISTRY_HOST=eu.gcr.io
PNAME=$1
ENV=$2

function printUsage() {
  echo "Required environment variables:"
  echo "  PROJECT_ID:     Google Project ID"
  echo ""
  echo "Usage PROJECT_ID=id ./support/updateCluster.sh [project_name] [stg|prod]"
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
  local CLUSTER_NAME=`gcloud beta container clusters list --project $PROJECT_ID | awk '{print $1}' | grep "$PNAME-$ENV"`
  echo "Executing: 'gcloud config set container/cluster $CLUSTER_NAME'"
  gcloud config set container/cluster $CLUSTER_NAME

  local CLUSTER_GOOGLE_NAME=`kubectl config view | awk '{print $2}' | grep $CLUSTER_NAME | tail -n 1`
  echo "Execute: 'kubectl config use-context $CLUSTER_GOOGLE_NAME'"
  kubectl config use-context $CLUSTER_GOOGLE_NAME
}

function updateCluster() {
  local SOURCE_CONFIG="$CWD/infrastructure/configs/project-controller-tpl.json"
  local TARGET_CONFIG="$CWD/tmp/$PNAME-controller.json"
  local TMP_FILE="/tmp/$PNAME-controller.json"
  local CURRENT_CONTROLLER=`kubectl get rc | grep $PROJECT_ID | awk '{print $1}' | grep "$PNAME-controller"`

  sed "s/:PROJECT_NAME/$PNAME/g" $SOURCE_CONFIG > $TARGET_CONFIG
  sed "s/:PROJECT_ID/$PROJECT_ID/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:CONTROLLER_NAME/$PNAME-controller-$REV/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:REV/$REV/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:ENV/$ENV/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG

  echo "Executing: 'kubectl rolling-update $CURRENT_CONTROLLER -f $CWD/tmp/$PNAME-controller.json'"
  kubectl rolling-update $CURRENT_CONTROLLER -f "$CWD/tmp/$PNAME-controller.json"
  rm $TARGET_CONFIG
}

configGCloud

echo ""
echo "Updating Cluster Pods for project '$PNAME' to revision $REV for environment $ENV"

updateCluster

echo ""
