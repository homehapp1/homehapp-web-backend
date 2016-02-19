#! /bin/sh

# Do not change these
REV=`git rev-parse --short HEAD`
CWD=`pwd`
CONTAINER_REGISTRY_HOST=eu.gcr.io
ENV="prod"
PNAME="$1-$ENV"
PBNAME="$1"
CLUSTER_NAME="homehapp-$1-$ENV"
CLUSTER_GOOGLE_NAME=""
NODE_GOOGLE_NAME=""

function printUsage() {
  echo "Required environment variables:"
  echo "  PROJECT_ID:     Google Project ID"
  echo ""
  echo "Usage PROJECT_ID=id ./support/production/destroyCluster.sh [project_name]"
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

function removeServices() {
  if [ "$CLUSTER_GOOGLE_NAME" = "" ]; then
    CLUSTER_GOOGLE_NAME=`kubectl config view | awk '{print $2}' | grep $CLUSTER_NAME | tail -n 1`
  fi

  if [ "$1" = "-d" ]; then
    echo "Execute: 'kubectl delete services --context=$CLUSTER_GOOGLE_NAME $PNAME'"
    echo "Execute: 'kubectl delete services --context=$CLUSTER_GOOGLE_NAME $PNAME-proxy'"
  else
    kubectl delete services --context=$CLUSTER_GOOGLE_NAME $PNAME
    kubectl delete services --context=$CLUSTER_GOOGLE_NAME "$PNAME-proxy"
  fi
}

function removeControllers() {
  local CONTROLLER_NAME=`kubectl get rc | grep $PROJECT_ID | awk '{print $1}' | grep "$PNAME" | head -n 1`
  local PROXY_CONTROLLER_NAME=`kubectl get rc | grep $PROJECT_ID | awk '{print $1}' | grep "$PNAME-proxy"`

  if [ "$1" = "-d" ]; then
    echo "Execute: 'kubectl stop rc $CONTROLLER_NAME'"
    echo "Execute: 'kubectl stop rc $PROXY_CONTROLLER_NAME'"
  else
    kubectl stop rc $CONTROLLER_NAME
    kubectl stop rc $PROXY_CONTROLLER_NAME
  fi
}

function removeSecrets() {
  if [ "$1" = "-d" ]; then
    echo "Execute: 'kubectl delete secrets --context=$CLUSTER_GOOGLE_NAME proxy-secret'"
  else
    kubectl delete secrets --context=$CLUSTER_GOOGLE_NAME "proxy-secret"
  fi
}

function removeCluster() {
  if [ "$1" = "-d" ]; then
    echo "Execute: 'gcloud beta container clusters delete $CLUSTER_NAME --project $PROJECT_ID'"
  else
    gcloud beta container clusters delete --quiet $CLUSTER_NAME --project $PROJECT_ID
  fi
}

function unconfigureProxyFirewall() {
  if [ "$1" = "-d" ]; then
    echo "Execute: 'gcloud compute firewall-rules delete ${CLUSTER_NAME}-web-public --project $PROJECT_ID'"
  else
    gcloud compute firewall-rules delete --quiet ${CLUSTER_NAME}-web-public --project $PROJECT_ID
  fi
}

if [ "$2" = "-d" ]; then
  echo "In Dry-Run mode"
fi

echo ""
echo "Removing Services for $PNAME"

removeServices $2

echo ""
echo "Removing Replication Controllers for $PNAME"

removeControllers $2

echo ""
echo "Removing Secrets for $PNAME"

removeSecrets $2

echo ""
echo "Removing related firewall rules"

unconfigureProxyFirewall $2

echo "Removing Container Cluster $CLUSTER_NAME"
echo ""

removeCluster $2

echo ""
echo "Cluster removed!"
echo ""
