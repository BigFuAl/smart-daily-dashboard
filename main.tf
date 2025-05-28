provider "azurerm" {
  features {}
  subscription_id = "bb037187-e179-4597-9e58-5f6bc2c5209f"
}

resource "azurerm_resource_group" "rg" {
  name     = "smart-dashboard-rg"
  location = "Canada Central"
}

resource "azurerm_service_plan" "plan" {
  name                = "smartDashboardPlan"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "F1"
}

resource "azurerm_linux_web_app" "webapp" {
  name                = "smart-daily-dashboard-app"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {
    always_on = false

    application_stack {
      node_version = "16-lts"
    }

    ftps_state = "Disabled"
  }

  app_settings = {
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = "false"
    SCM_DO_BUILD_DURING_DEPLOYMENT     = "true"
  }
}

output "web_app_url" {
  value       = azurerm_linux_web_app.webapp.default_hostname
  description = "The URL of the deployed web app"
}