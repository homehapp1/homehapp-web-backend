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

echo "Updating Cluster Pods for project '$PNAME' to revision $REV for environment $ENV"

# Arguments:
# envName: Enum(prod, stg)
function updateCluster() {
  kubectl rolling-update "$PNAME-controller" --image="$CONTAINER_REGISTRY_HOST/$PROJECT_ID/$PNAME:$REV-$1"
}

updateCluster $ENV
