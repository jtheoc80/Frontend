# GCP Cloud Run Deployment for Valve Chain Frontend
terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Variables
variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "valve-chain-frontend"
}

# Enable required APIs
resource "google_project_service" "run_api" {
  service = "run.googleapis.com"
}

resource "google_project_service" "container_api" {
  service = "container.googleapis.com"
}

# Artifact Registry
resource "google_artifact_registry_repository" "main" {
  location      = var.region
  repository_id = "${var.app_name}-repo"
  description   = "Docker repository for ${var.app_name}"
  format        = "DOCKER"

  labels = {
    environment = var.environment
    application = var.app_name
  }

  depends_on = [google_project_service.container_api]
}

# Cloud Run Service
resource "google_cloud_run_service" "main" {
  name     = var.app_name
  location = var.region

  template {
    spec {
      containers {
        image = "ghcr.io/jtheoc80/frontend:main"
        
        ports {
          container_port = 80
        }

        env {
          name  = "NODE_ENV"
          value = "production"
        }

        env {
          name  = "REACT_APP_ENVIRONMENT"
          value = var.environment
        }

        env {
          name  = "REACT_APP_ENABLE_MOCK_DATA"
          value = "false"
        }

        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }

        liveness_probe {
          http_get {
            path = "/health"
            port = 80
          }
          initial_delay_seconds = 30
          period_seconds        = 10
        }
      }

      container_concurrency = 80
      timeout_seconds       = 300
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = "1"
        "autoscaling.knative.dev/maxScale" = "10"
        "run.googleapis.com/cpu-throttling" = "true"
      }

      labels = {
        environment = var.environment
        application = var.app_name
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_project_service.run_api]
}

# IAM policy to allow public access
resource "google_cloud_run_service_iam_member" "public" {
  service  = google_cloud_run_service.main.name
  location = google_cloud_run_service.main.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Load Balancer (optional, for custom domain)
resource "google_compute_global_address" "main" {
  name = "${var.app_name}-ip"
}

# Outputs
output "cloud_run_url" {
  description = "URL of the Cloud Run service"
  value       = google_cloud_run_service.main.status[0].url
}

output "load_balancer_ip" {
  description = "IP address of the load balancer"
  value       = google_compute_global_address.main.address
}

output "artifact_registry_url" {
  description = "URL of the Artifact Registry"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.main.repository_id}"
}