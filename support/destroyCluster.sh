#! /bin/sh

# Do not change these
REV=`git rev-parse --short HEAD`
CWD=`pwd`
CONTAINER_REGISTRY_HOST=eu.gcr.io
PNAME=$1
ENV=$2
CLUSTER_NAME="homehapp-$PNAME-$ENV"
CLUSTER_GOOGLE_NAME=""
NODE_GOOGLE_NAME=""

function printUsage() {
  echo "Required environment variables:"
  echo "  PROJECT_ID:     Google Project ID"
  echo ""
  echo "Usage PROJECT_ID=id ./support/destroyCluster.sh [project_name] [stg,prod]"
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

if [ "$PNAME" = "" ]; then
  echo "No project defined!"
  printUsageAndExit
fi

if [ ! -d "$CWD/tmp" ]; then
  mkdir "$CWD/tmp"
fi

if [ "$3" = "-d" ]; then
  echo "In Dry-Run mode"
fi

function removeService() {
  if [ "$CLUSTER_GOOGLE_NAME" = "" ]; then
    CLUSTER_GOOGLE_NAME=`kubectl config view | awk '{print $2}' | grep $CLUSTER_NAME | tail -n 1`
  fi

  if [ "$1" = "-d" ]; then
    echo "Execute: 'kubectl delete services --context=$CLUSTER_GOOGLE_NAME $PNAME'"
  else
    kubectl delete services --context=$CLUSTER_GOOGLE_NAME  $PNAME
  fi
}

function removeController() {
  local CONTROLLER_NAME=`kubectl get rc | grep $PROJECT_ID | awk '{print $1}' | grep "$PNAME-controller"`
  if [ "$1" = "-d" ]; then
    echo "Execute: 'kubectl stop rc $CONTROLLER_NAME'"
  else
    kubectl stop rc $CONTROLLER_NAME
  fi
}

function removeCluster() {
  if [ "$1" = "-d" ]; then
    echo "Execute: 'gcloud beta container clusters delete $CLUSTER_NAME --project $PROJECT_ID'"
  else
    gcloud beta container clusters delete --quiet $CLUSTER_NAME --project $PROJECT_ID
  fi
}

# function closeFirewall() {
#   if [ "$1" = "-d" ]; then
#     echo "Execute: 'gcloud compute firewall-rules delete $PNAME-80 --project $PROJECT_ID'"
#   else
#     gcloud compute firewall-rules delete $PNAME-80 --project $PROJECT_ID
#   fi
# }

echo ""
echo "Removing Service $PNAME-service"

removeService $3

echo ""
echo "Removing Replication Controller $PNAME-controller"

removeController $3

echo "Removing Container Cluster $CLUSTER_NAME"
echo ""

removeCluster $3

# echo ""
# echo "Removing firewall rule for service"
#
# closeFirewall $3

echo ""
echo "Cluster removed!"
echo ""
