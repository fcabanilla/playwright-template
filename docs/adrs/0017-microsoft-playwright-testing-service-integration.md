# ADR-0017: Microsoft Playwright Testing Service Integration

**Status**: Accepted

**Date**: 2025-11-17

**Authors**: [@github-copilot]

**Reviewers**: [@matiasma, @team]

## Context

The Playwright test automation framework needed cloud-based test execution and centralized online reporting capabilities to improve team collaboration, reduce local resource consumption, and provide accessible test results for stakeholders.

### Background

- Current framework runs tests locally, requiring significant local resources
- Test results only visible to the person executing tests
- No centralized dashboard for test execution history and trends
- Team members need access to test execution videos, screenshots, and detailed logs
- CI/CD pipelines could benefit from cloud-based parallel execution

### Forces at Play

- **Team Collaboration**: Multiple team members need access to test results
- **Resource Optimization**: Local machines have limited parallel execution capacity
- **Stakeholder Visibility**: Business users need access to test execution reports
- **CI/CD Integration**: Cloud execution enables better pipeline integration
- **Cost Efficiency**: Microsoft Playwright Testing Service provides free tier
- **Maintenance**: Reduce local setup complexity for team members

## Decision

### Chosen Option

**Microsoft Playwright Testing Service Integration**

We have integrated Microsoft Playwright Testing Service to enable cloud-based test execution with centralized reporting capabilities.

### Considered Alternatives

#### Option A: Self-hosted Selenium Grid

- **Pros**:
  - Full control over infrastructure
  - No external dependencies
  - Custom configuration options
- **Cons**:
  - High maintenance overhead
  - Infrastructure costs
  - Complex setup and scaling
  - No built-in reporting
- **Reason for rejection**: High maintenance burden and infrastructure costs

#### Option B: BrowserStack/Sauce Labs

- **Pros**:
  - Mature platforms with extensive browser coverage
  - Established reporting features
- **Cons**:
  - Significant licensing costs
  - Vendor lock-in
  - Additional complexity for Playwright integration
- **Reason for rejection**: High costs and less native Playwright support

#### Option C: GitHub Actions with matrix strategy

- **Pros**:
  - Free for public repos
  - Good CI/CD integration
- **Cons**:
  - Limited reporting capabilities
  - No persistent dashboard
  - Still requires local development setup
- **Reason for rejection**: Insufficient reporting and collaboration features

## Consequences

### Positive

- **Cloud Execution**: Tests run on Microsoft's cloud infrastructure
- **Centralized Reporting**: Online dashboard accessible to all team members
- **Resource Optimization**: Reduced local machine resource consumption
- **Team Collaboration**: Shared access to test results, videos, and screenshots
- **Cost Efficient**: Free tier covers current testing needs
- **Easy Setup**: Simple token-based authentication
- **CI/CD Ready**: Can be integrated into build pipelines

### Negative

- **External Dependency**: Relies on Microsoft's service availability
- **Token Management**: Requires secure handling of access tokens
- **Learning Curve**: Team needs to understand cloud execution concepts
- **Limited Customization**: Less control over execution environment than self-hosted

### Neutral

- **Authentication**: New JWT token-based authentication process
- **Configuration**: Additional configuration files for cloud connection
- **Documentation**: Need to maintain cloud-specific documentation

## Implementation

### Implementation Plan

1. **Azure Resource Creation**: Created Microsoft Playwright Testing Service resource
2. **Authentication Setup**: Generated JWT access token with workspace permissions
3. **Framework Configuration**: Added cloud connection configuration files
4. **NPM Scripts**: Created dedicated commands for cloud test execution
5. **Documentation**: Documented setup process and usage guidelines
6. **Team Onboarding**: Prepared access requirements for team members

### Success Criteria

- ✅ Tests execute successfully in cloud environment
- ✅ Authentication works with JWT tokens
- ✅ Team members can access online reports
- ✅ Screenshots and videos available in dashboard
- ✅ Performance comparable to local execution
- ✅ Integration with existing test structure maintained

### Rollback Plan

- Revert configuration changes to remove cloud connection
- Continue using local execution as primary method
- Cloud service can be disabled via environment variables
- No changes to core test logic, so rollback is safe

## Implementation Details

### Files Created/Modified

```
config/azure/
├── playwright-service.config.ts     # Cloud service configuration
└── README.md                       # Setup documentation

package.json                        # Added cloud execution scripts
playwright.config.ts               # Added conditional cloud connection
```

### NPM Commands Added

```json
{
  "test:cloud:smoke": "Test single component in cloud",
  "test:cloud:cinesa": "Run full Cinesa test suite in cloud", 
  "test:cloud:uci": "Run full UCI test suite in cloud",
  "cloud:reports": "Open cloud reporting dashboard"
}
```

### Environment Variables

```bash
USE_PLAYWRIGHT_SERVICE=true          # Enable cloud execution
PLAYWRIGHT_SERVICE_URL=wss://...     # WebSocket endpoint
PLAYWRIGHT_SERVICE_ACCESS_TOKEN=...  # JWT authentication token
```

## Access Requirements for Team

### For Team Members

**Required Azure Permissions:**
- **Reader** access to resource: `OCG-SPPT-PRD-PWT-WS`
- **Resource Group**: `OCG-WE-SPPT-PRD-RG-PLAYWRIGHT`
- **Subscription**: `SPPT-Prod (OCG-Sub-SPPT-Prod)`

**Request from IT/Azure Admin:**
```
User: [team-member-email]
Role: Reader
Scope: /subscriptions/6ad94225-bb48-492d-b77c-73379cba1ec8/resourceGroups/OCG-WE-SPPT-PRD-RG-PLAYWRIGHT/providers/Microsoft.AzurePlaywrightService/accounts/OCG-SPPT-PRD-PWT-WS
```

### For Administrators

**Current Configuration:**
- **Service Name**: OCG-SPPT-PRD-PWT-WS
- **Workspace ID**: 9a9f6272-8172-4490-a5c6-156fc12ff7da
- **Region**: West Europe
- **Access Token**: Valid until 2026-11-17

## Notes

### Related Links

- [Microsoft Playwright Testing Documentation](https://docs.microsoft.com/en-us/azure/playwright-testing/)
- [Azure Resource](https://portal.azure.com/#@odeoncinemas.onmicrosoft.com/resource/subscriptions/6ad94225-bb48-492d-b77c-73379cba1ec8/resourceGroups/OCG-WE-SPPT-PRD-RG-PLAYWRIGHT/providers/Microsoft.AzurePlaywrightService/accounts/OCG-SPPT-PRD-PWT-WS/overview)
- [Configuration Guide](../config/azure/README.md)

### Update

- **Last review**: 2025-11-17 by [@github-copilot]
- **Next review**: 2025-12-17
- **Implementation status**: Completed

---

**Template Version**: 1.0  
**Created**: November 17, 2025  
**Maintained by**: Cinema Automation Team