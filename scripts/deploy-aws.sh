#!/bin/bash

# Deploy to AWS ECS using Terraform
# Usage: ./deploy-aws.sh [environment]

set -e

ENVIRONMENT=${1:-production}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR/../terraform/aws"

echo "🚀 Deploying Valve Chain Frontend to AWS ECS..."
echo "Environment: $ENVIRONMENT"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install it first."
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
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
echo "🌐 Load Balancer DNS: $(terraform output -raw alb_dns_name)"

echo ""
echo "🔗 You can access your application at:"
echo "   http://$(terraform output -raw alb_dns_name)"
echo ""
echo "💡 To set up a custom domain, create a CNAME record pointing to the ALB DNS name."