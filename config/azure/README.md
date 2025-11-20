# Microsoft Playwright Testing Service - Setup Guide

## Overview

This guide documents the complete setup process for integrating Microsoft Playwright Testing Service with our test automation framework.

## Prerequisites

- Azure subscription access
- Azure CLI or Azure Portal access
- Node.js and npm installed
- Existing Playwright test framework

## Setup Process

### 1. Azure Resource Creation

**Service Created:**
- **Name**: OCG-SPPT-PRD-PWT-WS  
- **Type**: Microsoft Playwright Testing Service
- **Resource Group**: OCG-WE-SPPT-PRD-RG-PLAYWRIGHT
- **Region**: West Europe
- **Subscription**: SPPT-Prod (OCG-Sub-SPPT-Prod)

**Resource Configuration:**
```
Workspace ID: 9a9f6272-8172-4490-a5c6-156fc12ff7da
WebSocket Endpoint: wss://westeurope.api.playwright.microsoft.com/playwrightworkspaces/9a9f6272-8172-4490-a5c6-156fc12ff7da/browsers
Region: westeurope
```

### 2. Authentication Setup

**Access Token Generated:**
- **Type**: JWT Bearer Token
- **Scope**: Remote execution permissions
- **Validity**: Until November 17, 2026
- **User**: Matias Manzanelli (m.manzanelli@odeon.com)

### 3. Framework Configuration

**Files Created:**

```
config/azure/playwright-service.config.ts
config/azure/README.md
```

**Key Configuration:**
```typescript
export const playwrightServiceConfig = {
  baseEndpoint: 'https://westeurope.api.playwright.microsoft.com/playwrightworkspaces/9a9f6272-8172-4490-a5c6-156fc12ff7da',
  browserEndpoint: 'wss://westeurope.api.playwright.microsoft.com/playwrightworkspaces/9a9f6272-8172-4490-a5c6-156fc12ff7da/browsers',
  workspaceId: '9a9f6272-8172-4490-a5c6-156fc12ff7da',
  region: 'westeurope'
};
```

### 4. NPM Scripts Configuration

**Scripts Added to package.json:**
```json
{
  "test:cloud:smoke": "Run single test file in cloud",
  "test:cloud:cinesa": "Run full Cinesa suite in cloud", 
  "test:cloud:uci": "Run full UCI suite in cloud"
}
```

### 5. Environment Variables

**Required Variables:**
```bash
USE_PLAYWRIGHT_SERVICE=true
PLAYWRIGHT_SERVICE_URL=wss://westeurope.api.playwright.microsoft.com/playwrightworkspaces/9a9f6272-8172-4490-a5c6-156fc12ff7da/browsers
PLAYWRIGHT_SERVICE_ACCESS_TOKEN=[JWT_TOKEN]
```

## Usage

### Running Tests in Cloud

```bash
# Quick smoke test
npm run test:cloud:smoke

# Full test suites
npm run test:cloud:cinesa
npm run test:cloud:uci
```

### Viewing Results

**Current Options:**
1. **Terminal Output**: Session IDs, execution details
2. **Local Artifacts**: Screenshots, traces in `.allure/playwright-artifacts/`
3. **Azure Portal**: Reports section (requires permissions)

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check access token validity
2. **400 Bad Request**: Verify OS parameter in URL
3. **WebSocket errors**: Check network connectivity
4. **Permission denied**: Verify Azure resource permissions

### Validation Commands

```bash
# Test cloud connectivity
npm run test:cloud:smoke

# Verify local artifacts
ls .allure/playwright-artifacts/

# Check configuration
node -e "console.log(process.env.USE_PLAYWRIGHT_SERVICE)"
```

## Team Access Requirements

See ADR-0017 for detailed access requirements and Azure permission setup.

## Maintenance

### Token Renewal

**Current Token Expires**: November 17, 2026

**Renewal Process:**
1. Access Azure Portal
2. Navigate to OCG-SPPT-PRD-PWT-WS
3. Generate new access token
4. Update environment variables in scripts

### Monitoring

- Monitor Azure costs in subscription dashboard
- Check execution quotas in Playwright Testing Service
- Review failed executions in Azure Portal logs

## Security Considerations

- Access tokens stored in package.json (for development)
- Production deployments should use Azure Key Vault
- Rotate tokens before expiration
- Limit access permissions to minimum required

---

**Last Updated**: November 17, 2025  
**Maintained by**: Cinema Automation Team