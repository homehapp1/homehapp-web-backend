#! /bin/sh

# Do not change these
REV=`git rev-parse --short HEAD`
CWD=`pwd`
CONTAINER_REGISTRY_HOST=eu.gcr.io
PNAME=$1
ENV=$2
CLEAN=$3
BUILD_REVISION_FILE="$CWD/BUILD_REVISION";

function printUsage() {
  echo "Required environment variables:"
  echo "  PROJECT_ID:     Google Project ID"
  echo ""
  echo "Usage ./support/createContainers.sh [project name] OR PROJECT_NAME=name ./support/createContainers.sh"
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
  PNAME=$PROJECT_NAME
fi
if [ "$PNAME" = "" ]; then
  echo "No project defined!"
  printUsageAndExit
fi

echo "Building Docker Containers for project '$PNAME' to revision $REV"

function checkAndUpdateBuildRevision() {
  if [ -f $BUILD_REVISION_FILE ]; then
    local CURR_REV=`cat $BUILD_REVISION_FILE`
    local NEW_REV=`expr $CURR_REV + 1`
    echo "Updating build revision to ${NEW_REV}"
    echo $NEW_REV > $BUILD_REVISION_FILE
  else
    echo "Setting build revision to 1"
    echo "1" > $BUILD_REVISION_FILE
  fi
}

# Arguments:
# envName: Enum(prod, stg)
function buildContainer() {
  dockerFile="$CWD/Dockerfile.$PNAME.$1"
  docker build -t $CONTAINER_REGISTRY_HOST/$PROJECT_ID/$PNAME -f $dockerFile $CWD
}

# Arguments:
# envName: Enum(prod, stg)
function tagContainer() {
  revString="$REV-$1"
  docker tag -f $CONTAINER_REGISTRY_HOST/$PROJECT_ID/$PNAME $CONTAINER_REGISTRY_HOST/$PROJECT_ID/$PNAME:$revString
}

function cleanOldImages() {
  docker images | grep "$PROJECT_ID/$PNAME" | grep -v 'latest' | grep -v $REV-prod | grep -v $REV-stg | awk '{print $3}' | xargs docker rmi
}

function pushContainers() {
  gcloud docker push $CONTAINER_REGISTRY_HOST/$PROJECT_ID/$PNAME
}

checkAndUpdateBuildRevision

if [ "$ENV" = "prod" ]; then
  echo "Building and tagging production container"
  echo ""
  buildContainer "prod"
  tagContainer "prod"
else
  echo "Building and tagging staging container"
  echo ""
  buildContainer "stg"
  tagContainer "stg"
fi

if [ "$CLEAN" = "1" ]; then
  echo "Cleaning old Docker containers"
  echo ""
  cleanOldImages
  echo ""
fi

echo ""
echo "Pushing containers to registry"
echo ""
pushContainers

echo "Finished!"
exit
