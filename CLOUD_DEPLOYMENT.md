# Cloud Deployment Guide

This guide covers deploying the Valve Chain Frontend application to various cloud platforms using containerization and infrastructure as code.

## Overview

The application has been made cloud-ready with the following features:
- **Containerization**: Docker and docker-compose support
- **CI/CD**: GitHub Actions workflows for automated building and deployment
- **Multi-cloud support**: AWS ECS, Azure App Service, and GCP Cloud Run configurations
- **Kubernetes**: Production-ready Kubernetes manifests
- **Infrastructure as Code**: Terraform configurations for all major cloud providers
- **Monitoring**: Health checks, logging, and error tracking
- **Security**: Container scanning and security best practices

## Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed locally
- Docker and Docker Compose installed
- Terraform installed (for IaC deployments)
- Cloud provider CLI tools (AWS CLI, Azure CLI, or gcloud)
- kubectl (for Kubernetes deployments)

## Environment Configuration

### 1. Environment Variables

Copy the example environment file and configure for your target environment:

```bash
# For development
cp .env.example .env

# For production
cp .env.production .env.production.local
```

Key environment variables:
- `REACT_APP_API_BASE_URL`: Backend API endpoint
- `REACT_APP_ETHEREUM_RPC_URL`: Blockchain RPC endpoint
- `REACT_APP_PO_CONTRACT_ADDRESS`: Smart contract address
- `REACT_APP_SENTRY_DSN`: Error tracking endpoint (optional)
- `REACT_APP_ANALYTICS_ID`: Analytics tracking ID (optional)

### 2. Build Configuration

The application supports different build modes:
- **Development**: Hot reloading, debug logging enabled
- **Staging**: Production build with staging configurations
- **Production**: Optimized build with monitoring enabled

## Docker Deployment

### Local Development

```bash
# Start development environment with hot reloading
docker-compose --profile dev up frontend-dev

# Start production build locally
docker-compose up frontend
```

### Production Docker Build

```bash
# Build production image
docker build -t valve-chain-frontend:latest .

# Run production container
docker run -p 3000:80 \
  -e REACT_APP_ENVIRONMENT=production \
  valve-chain-frontend:latest
```

## Cloud Platform Deployments

### AWS ECS Deployment

Deploy to AWS Elastic Container Service using Terraform:

```bash
# Deploy to AWS
./scripts/deploy-aws.sh production

# Custom configuration
cd terraform/aws
terraform init
terraform plan -var="environment=production" -var="aws_region=us-west-2"
terraform apply
```

**Features:**
- Auto-scaling ECS service (2-10 instances)
- Application Load Balancer with health checks
- CloudWatch logging and monitoring
- VPC with public/private subnets
- Security groups with minimal required access

**Estimated Cost:** $50-200/month depending on traffic

### Azure App Service Deployment

Deploy to Azure App Service using Terraform:

```bash
# Deploy to Azure
./scripts/deploy-azure.sh production

# Custom configuration
cd terraform/azure
terraform init
terraform plan -var="environment=production" -var="location=East US"
terraform apply
```

**Features:**
- Linux App Service with Docker container support
- Application Insights for monitoring
- Auto-scaling capabilities
- Integrated container registry
- SSL certificate support

**Estimated Cost:** $40-150/month depending on tier

### Google Cloud Run Deployment

Deploy to Google Cloud Run using Terraform:

```bash
# Deploy to GCP (replace with your project ID)
./scripts/deploy-gcp.sh my-project-id production

# Custom configuration
cd terraform/gcp
terraform init
terraform plan -var="project_id=my-project-id" -var="environment=production"
terraform apply
```

**Features:**
- Serverless container platform
- Pay-per-request pricing
- Automatic scaling (0-10 instances)
- Built-in load balancing
- Global CDN integration

**Estimated Cost:** $10-50/month depending on traffic

### Kubernetes Deployment

Deploy to any Kubernetes cluster:

```bash
# Deploy to current kubectl context
./scripts/deploy-k8s.sh production

# Manual deployment
kubectl apply -f k8s/deployment.yaml
```

**Features:**
- Horizontal Pod Autoscaler (3-10 replicas)
- Rolling updates with zero downtime
- Resource limits and requests
- Health checks and readiness probes
- Ingress with SSL termination
- ConfigMaps and Secrets management

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) provides:

### Continuous Integration
- Automated testing on pull requests
- Code quality checks and builds
- TypeScript compilation validation
- Security vulnerability scanning

### Continuous Deployment
- Automatic Docker image building
- Container registry publishing (GitHub Container Registry)
- Security scanning with Trivy
- Deployment to staging/production environments

### Triggering Deployments

1. **Automatic**: Push to `main` or `develop` branches
2. **Manual**: Trigger workflow dispatch in GitHub Actions
3. **Pull Request**: Builds and tests on PR creation

## Monitoring and Logging

### Application Monitoring

The application includes built-in monitoring:
- **Health Checks**: `/health` endpoint for container orchestration
- **Error Boundary**: Catches and reports React errors
- **Performance Logging**: Tracks component performance
- **User Action Tracking**: Logs user interactions

### External Monitoring Integration

Configure external monitoring services:

```bash
# Sentry for error tracking
REACT_APP_SENTRY_DSN=https://your-dsn@sentry.io/project

# Google Analytics
REACT_APP_ANALYTICS_ID=G-XXXXXXXXXX

# Custom logging endpoint
REACT_APP_LOGGING_ENDPOINT=https://your-logging-service.com/api/logs
```

### Log Aggregation

- **AWS**: CloudWatch Logs automatically configured
- **Azure**: Application Insights integration
- **GCP**: Cloud Logging integration
- **Kubernetes**: Supports Fluentd, Filebeat, or similar log shippers

## Security Best Practices

### Container Security
- Multi-stage Docker builds to minimize attack surface
- Non-root user execution
- Regular base image updates
- Vulnerability scanning in CI/CD

### Network Security
- HTTPS-only communication
- Security headers (CSP, HSTS, etc.)
- CORS configuration
- Private subnets for backend resources

### Secrets Management
- Environment variables for configuration
- Cloud provider secret management integration
- No secrets in container images or version control

## Scaling and Performance

### Horizontal Scaling
- **AWS ECS**: Auto Scaling Groups based on CPU/memory
- **Azure App Service**: Built-in auto-scaling rules
- **GCP Cloud Run**: Automatic request-based scaling
- **Kubernetes**: Horizontal Pod Autoscaler

### Performance Optimization
- Static asset caching with long-term cache headers
- Gzip compression for all text-based assets
- CDN integration for global content delivery
- Lazy loading for non-critical components

### Cost Optimization
- **Development**: Use smaller instance sizes
- **Staging**: Scale down during off-hours
- **Production**: Monitor and optimize resource usage
- **Storage**: Use appropriate storage classes for static assets

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   docker build --no-cache -t valve-chain-frontend .
   
   # Verify dependencies
   npm audit
   npm ci --legacy-peer-deps
   ```

2. **Container Won't Start**
   ```bash
   # Check container logs
   docker logs <container-id>
   
   # Verify health check
   curl http://localhost:3000/health
   ```

3. **Cloud Deployment Issues**
   ```bash
   # Check Terraform state
   terraform show
   
   # Verify cloud resources
   aws ecs describe-services --cluster valve-chain-frontend-cluster
   az webapp show --name valve-chain-frontend-app --resource-group valve-chain-frontend-rg
   gcloud run services describe valve-chain-frontend --region=us-central1
   ```

### Health Check Endpoints

The application provides several endpoints for monitoring:
- `GET /health` - Basic health check
- `GET /` - Application availability check

### Debug Mode

Enable debug logging in development:
```bash
REACT_APP_ENABLE_DEBUG_LOGGING=true
REACT_APP_ENVIRONMENT=development
```

## Maintenance

### Regular Tasks
- Update base Docker images monthly
- Review and update dependencies quarterly
- Monitor security advisories
- Review cloud costs monthly
- Update SSL certificates as needed

### Backup Strategy
- Source code: Version controlled in Git
- Configuration: Infrastructure as Code in Terraform
- Container images: Stored in container registries
- No persistent data (stateless frontend application)

## Support

For deployment issues:
1. Check the troubleshooting section above
2. Review application logs
3. Verify cloud provider status pages
4. Contact support with specific error messages and configuration details

## Cost Estimation

### Monthly Cost Estimates (USD)

| Platform | Development | Staging | Production |
|----------|-------------|---------|------------|
| AWS ECS | $30-50 | $80-120 | $150-300 |
| Azure App Service | $25-40 | $60-100 | $120-250 |
| GCP Cloud Run | $10-20 | $30-60 | $80-200 |
| Kubernetes (Managed) | $70-100 | $150-200 | $300-500 |

*Costs vary based on traffic, region, and specific configuration choices.*