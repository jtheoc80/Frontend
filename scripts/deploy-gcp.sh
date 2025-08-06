#!/bin/bash

# Deploy to GCP Cloud Run using Terraform
# Usage: ./deploy-gcp.sh [project_id] [environment]

set -e

PROJECT_ID=${1:-""}
ENVIRONMENT=${2:-production}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR/../terraform/gcp"

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Please provide a GCP project ID."
    echo "Usage: ./deploy-gcp.sh [project_id] [environment]"
    exit 1
fi

echo "🚀 Deploying Valve Chain Frontend to GCP Cloud Run..."
echo "Project ID: $PROJECT_ID"
echo "Environment: $ENVIRONMENT"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK is not installed. Please install it first."
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install it first."
    exit 1
fi

# Check gcloud authentication
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Not authenticated with Google Cloud. Please run 'gcloud auth login' first."
    exit 1
fi

# Set the project
gcloud config set project "$PROJECT_ID"

cd "$TERRAFORM_DIR"

# Initialize Terraform
echo "📦 Initializing Terraform..."
terraform init

# Plan deployment
echo "📋 Planning deployment..."
terraform plan -var="project_id=$PROJECT_ID" -var="environment=$ENVIRONMENT"

# Apply deployment
echo "🔨 Applying deployment..."
terraform apply -var="project_id=$PROJECT_ID" -var="environment=$ENVIRONMENT" -auto-approve

# Get outputs
echo "✅ Deployment complete!"
echo "🌐 Cloud Run URL: $(terraform output -raw cloud_run_url)"
echo "🔢 Load Balancer IP: $(terraform output -raw load_balancer_ip)"
echo "📦 Artifact Registry: $(terraform output -raw artifact_registry_url)"

echo ""
echo "🔗 You can access your application at:"
echo "   $(terraform output -raw cloud_run_url)"
echo ""
echo "💡 To deploy your Docker image to Artifact Registry:"
echo "   1. Configure Docker: gcloud auth configure-docker $(terraform output -raw artifact_registry_url | cut -d'/' -f1)"
echo "   2. Build and tag: docker build -t $(terraform output -raw artifact_registry_url)/frontend:latest ."
echo "   3. Push image: docker push $(terraform output -raw artifact_registry_url)/frontend:latest"