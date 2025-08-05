# Azure App Service Deployment for Valve Chain Frontend
terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Variables
variable "location" {
  description = "Azure region"
  type        = string
  default     = "East US"
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

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "${var.app_name}-rg"
  location = var.location

  tags = {
    Environment = var.environment
    Application = var.app_name
  }
}

# App Service Plan
resource "azurerm_service_plan" "main" {
  name                = "${var.app_name}-plan"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = "B1"

  tags = {
    Environment = var.environment
    Application = var.app_name
  }
}

# Container Registry
resource "azurerm_container_registry" "main" {
  name                = "${replace(var.app_name, "-", "")}acr"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true

  tags = {
    Environment = var.environment
    Application = var.app_name
  }
}

# App Service
resource "azurerm_linux_web_app" "main" {
  name                = "${var.app_name}-app"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_service_plan.main.location
  service_plan_id     = azurerm_service_plan.main.id

  app_settings = {
    DOCKER_REGISTRY_SERVER_URL      = "https://${azurerm_container_registry.main.login_server}"
    DOCKER_REGISTRY_SERVER_USERNAME = azurerm_container_registry.main.admin_username
    DOCKER_REGISTRY_SERVER_PASSWORD = azurerm_container_registry.main.admin_password
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = false
    
    # Application settings
    REACT_APP_ENVIRONMENT = var.environment
    REACT_APP_ENABLE_MOCK_DATA = "false"
    REACT_APP_DEFAULT_LANGUAGE = "en"
  }

  site_config {
    always_on = true
    
    application_stack {
      docker_image     = "ghcr.io/jtheoc80/frontend"
      docker_image_tag = "main"
    }

    health_check_path = "/health"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    Environment = var.environment
    Application = var.app_name
  }
}

# Application Insights
resource "azurerm_application_insights" "main" {
  name                = "${var.app_name}-insights"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  application_type    = "web"

  tags = {
    Environment = var.environment
    Application = var.app_name
  }
}

# Outputs
output "app_service_url" {
  description = "URL of the App Service"
  value       = "https://${azurerm_linux_web_app.main.default_hostname}"
}

output "container_registry_url" {
  description = "URL of the Container Registry"
  value       = azurerm_container_registry.main.login_server
}