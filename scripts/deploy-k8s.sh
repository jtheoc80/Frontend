#!/bin/bash

# Deploy to Kubernetes using kubectl
# Usage: ./deploy-k8s.sh [environment]

set -e

ENVIRONMENT=${1:-production}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
K8S_DIR="$SCRIPT_DIR/../k8s"

echo "🚀 Deploying Valve Chain Frontend to Kubernetes..."
echo "Environment: $ENVIRONMENT"

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install it first."
    exit 1
fi

# Check kubectl connectivity
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot connect to Kubernetes cluster. Please check your kubeconfig."
    exit 1
fi

# Deploy to Kubernetes
echo "📦 Applying Kubernetes manifests..."
kubectl apply -f "$K8S_DIR/deployment.yaml"

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n valve-chain

# Get service information
echo "✅ Deployment complete!"

SERVICE_TYPE=$(kubectl get service frontend-service -n valve-chain -o jsonpath='{.spec.type}')
echo "🔧 Service type: $SERVICE_TYPE"

if [ "$SERVICE_TYPE" = "LoadBalancer" ]; then
    EXTERNAL_IP=$(kubectl get service frontend-service -n valve-chain -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    if [ -n "$EXTERNAL_IP" ]; then
        echo "🌐 External IP: $EXTERNAL_IP"
        echo "🔗 You can access your application at: http://$EXTERNAL_IP"
    else
        echo "⏳ Waiting for external IP to be assigned..."
        kubectl get service frontend-service -n valve-chain --watch
    fi
elif [ "$SERVICE_TYPE" = "ClusterIP" ]; then
    echo "🔗 Service is internal only. To access externally:"
    echo "   kubectl port-forward service/frontend-service 8080:80 -n valve-chain"
    echo "   Then visit: http://localhost:8080"
fi

# Show pod status
echo ""
echo "📊 Pod status:"
kubectl get pods -n valve-chain -l app=frontend

# Show ingress information if available
if kubectl get ingress frontend-ingress -n valve-chain &> /dev/null; then
    echo ""
    echo "🌐 Ingress information:"
    kubectl get ingress frontend-ingress -n valve-chain
fi