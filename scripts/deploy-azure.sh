#!/bin/bash

# Deploy to Azure App Service using Terraform
# Usage: ./deploy-azure.sh [environment]

set -e

ENVIRONMENT=${1:-production}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR/../terraform/azure"

echo "🚀 Deploying Valve Chain Frontend to Azure App Service..."
echo "Environment: $ENVIRONMENT"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first."
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install it first."
    exit 1
fi

# Check Azure login
if ! az account show &> /dev/null; then
    echo "❌ Not logged into Azure. Please run 'az login' first."
    exit 1
fi

cd "$TERRAFORM_DIR"

# Initialize Terraform
echo "📦 Initializing Terraform..."
terraform init

# Plan deployment
echo "📋 Planning deployment..."
terraform plan -var="environment=$ENVIRONMENT"

# Apply deployment
echo "🔨 Applying deployment..."
terraform apply -var="environment=$ENVIRONMENT" -auto-approve

# Get outputs
echo "✅ Deployment complete!"
echo "🌐 App Service URL: $(terraform output -raw app_service_url)"
echo "📦 Container Registry: $(terraform output -raw container_registry_url)"

echo ""
echo "🔗 You can access your application at:"
echo "   $(terraform output -raw app_service_url)"
echo ""
echo "💡 To deploy your Docker image:"
echo "   1. Build and tag your image: docker build -t $(terraform output -raw container_registry_url)/frontend:latest ."
echo "   2. Login to ACR: az acr login --name \$(terraform output -raw container_registry_url | cut -d'.' -f1)"
echo "   3. Push image: docker push $(terraform output -raw container_registry_url)/frontend:latest"