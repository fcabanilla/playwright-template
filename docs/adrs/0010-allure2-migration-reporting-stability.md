# ADR-0010: Migrate from Allure 3 to Allure 2 for Test Reporting Stability

**Status**: Proposed

**Date**: 2025-10-29

**Authors**: [@fcabanilla]

**Reviewers**: [TBD]

## Context

The current test automation framework uses **Allure 3 (beta 0.0.0-beta.18)** for test reporting and artifact generation. This decision is causing significant operational challenges that impact the team's ability to maintain reliable test reporting and analytics.

### Background

- **Current Setup**: 
  - `allure@^3.0.0-beta.18` (beta version)
  - `@allurereport/plugin-awesome@^3.0.0-beta.18` (beta version)
  - `allure-playwright@3.2.0`
  - Configuration: `allure.config.js` with awesome plugin
  - Report generation: 280+ tests generating extensive artifacts

- **Deployment Environments**:
  - Production (www.cinesa.es)
  - PreProd (preprod-web.ocgtest.es)
  - Lab (lab-web.ocgtest.es)
  - Staging
  - Local development

- **Current Report Capabilities**:
  - Test status tracking (passed/failed)
  - Video recordings (retain-on-failure)
  - Screenshots (only-on-failure)
  - Basic categorization (groupBy: 'titlepath')

### Issues with Allure 3 Beta

1. **Instability & Bugs**
   - Beta version with active development and frequent breaking changes
   - Plugin system not fully stabilized
   - Report generation sometimes fails or produces incomplete reports
   - Missing category classification in some test runs

2. **Plugin System Not Functional**
   - Awesome plugin doesn't properly separate tests into categories
   - Expected feature: Categorization by test suite, tags, and status
   - Actual result: Tests not properly grouped/classified
   - Makes it difficult to analyze results by feature area or priority

3. **Missing Features in Beta**
   - Category API not fully implemented
   - Custom categorization rules unstable
   - Test history tracking inconsistent
   - Environment parametrization limited

4. **Performance & Reliability**
   - Report generation times unpredictable
   - Large test runs (280+ tests) cause generation delays
   - No stable version guarantees
   - Team blocked on missing features

5. **Maintenance Burden**
   - Beta version requires frequent updates
   - Breaking changes without documentation
   - Plugin documentation incomplete
   - Community support limited

### Problem We're Solving

The team needs:
1. **Stable reporting** - Consistent, reliable test result generation
2. **Proper categorization** - Tests organized by feature, priority, status
3. **Multi-environment support** - Clear visibility of test results per environment
4. **Maintainability** - Mature, stable codebase with predictable upgrades
5. **Integration** - Proper support for playwright integration
6. **JIRA traceability** - Ability to link tests to JIRA tickets (via tags - already implemented)

### Forces at Play

- **Technical Requirements**:
  - Multi-platform support (Cinesa + UCI)
  - 290+ automated tests across multiple suites
  - PreProd/Lab/Production environment testing
  - CI/CD integration needs

- **Business Requirements**:
  - QA team needs clear, actionable test reports
  - Product team needs environment-specific visibility
  - JIRA integration essential (tickets now tagged to tests)
  - Release readiness validation

- **Team Constraints**:
  - Limited time for test result investigation
  - Need immediate stability improvements
  - Must support parallel environment testing
  - Backward compatibility desired (archive old reports)

## Decision

**Migrate from Allure 3 (beta) to Allure 2 (stable)** to achieve reporting stability and restore the categorization/filtering capabilities the team depends on.

### Chosen Option

**Downgrade to Allure 2 LTS (Long-Term Support)**

- Replace: `allure@^3.0.0-beta.18` → `allure@^2.x` (latest stable)
- Replace: `@allurereport/plugin-awesome@^3.0.0-beta.18` → `@allurereport/plugin-awesome@^2.x`
- Keep: `allure-playwright@^3.2.0` (compatible with both Allure 2 & 3)
- Update: `allure.config.js` for Allure 2 configuration format
- Add: Additional plugins for proper categorization (e.g., `allure-plugin-category`, `allure-plugin-environment`)

### Rationale for This Decision

1. **Proven Stability**: Allure 2 is production-grade with 5+ years of proven stability
2. **Full Feature Parity**: All required reporting features are stable and mature
3. **Better Plugin Ecosystem**: 
   - `allure-plugin-category` - Stable categorization by custom rules
   - `allure-plugin-environment` - Multi-environment reporting
   - `allure-plugin-jira` - JIRA ticket integration (future enhancement)
4. **Excellent Documentation**: Complete docs, forums, community examples
5. **Quick Implementation**: Configuration change only, no test code changes needed
6. **Zero Risk**: Proven by thousands of teams globally
7. **Maintainability**: Stable API, predictable upgrade path

### Considered Alternatives

#### Alternative A: Fix Allure 3 Beta Issues

- **Pros**:
  - Stays on "latest" technology
  - Future-proof (planned as default)
  - Some modern features may arrive
- **Cons**:
  - Still beta - no stability guarantees
  - Team not responsible for fixing beta software
  - Could break again with next update
  - Undefined timeline for feature completion
  - Ongoing investment with no guaranteed payoff
  - **Reason for rejection**: Too risky and costly for production QA workflow

#### Alternative B: Use Custom Reporting Solution

- **Pros**:
  - Full control over categorization
  - Could integrate JIRA API directly
  - No external dependencies
- **Cons**:
  - Significant development effort (4-6 weeks)
  - Ongoing maintenance burden
  - Loses battle-tested Allure features
  - Team needs to maintain reporter plugin architecture
  - **Reason for rejection**: Disproportionate effort vs. Allure 2 alternative

#### Alternative C: Continue with Allure 3 + Workarounds

- **Pros**:
  - No downgrade needed
  - Minimal immediate action
- **Cons**:
  - Team continues to struggle with instability
  - Reports remain miscategorized
  - JIRA integration never materializes
  - Technical debt grows
  - Morale impact on QA team
  - **Reason for rejection**: Doesn't solve the core problem

## Consequences

### Positive

1. **Immediate Stability**
   - Reports generate reliably and consistently
   - No more report generation failures
   - Predictable performance on large test runs

2. **Proper Test Categorization**
   - Tests organized by suite, priority, status
   - Clear visualization of test results
   - Better analysis and debugging capability

3. **Multi-Environment Visibility**
   - Clear distinction between PreProd/Lab/Production results
   - Environmental parametrization in reports
   - Better triage for environment-specific issues

4. **JIRA Integration Ready**
   - Tagged tests (@OCG-*, @COMS-*) can be integrated
   - Future: Direct JIRA ticket linking in reports
   - Better traceability for regression testing

5. **Improved Maintenance**
   - Mature, stable codebase
   - Excellent documentation
   - Large community and resources
   - Predictable upgrade path

6. **Team Productivity**
   - QA team spends less time troubleshooting reports
   - Clear actionable insights from test results
   - Faster root cause analysis

### Negative

1. **Short-term Effort Required**
   - Configuration migration from Allure 3 → Allure 2 format
   - Plugin configuration updates
   - Report regeneration (1-2 hours)
   - **Mitigation**: All changes are configuration-only

2. **Future Allure 3 Migration**
   - If Allure 3 eventually stabilizes, may need future upgrade
   - **Mitigation**: Clean abstraction layer (already in place via config)

3. **Slight Feature Reduction (Temporary)**
   - Some Allure 3 beta features won't be available until Allure 2 adds them
   - **Mitigation**: Not using any beta-specific features anyway

### Neutral

1. **Dependency Version Change**
   - Will appear in lock files/dependency trees
   - No code changes required
   - Backward compatible with existing test code

2. **Report Archival**
   - Old Allure 3 reports may not render in Allure 2 viewer
   - **Mitigation**: Keep `.allure/history.jsonl` for data continuity

## Implementation

### Implementation Plan

1. **Phase 1: Investigation & Testing (Day 1)**
   - Audit current Allure 3 configuration
   - Research Allure 2 configuration options
   - Set up test environment with Allure 2
   - Validate playwright plugin compatibility
   - Test with 10-20 test run

2. **Phase 2: Configuration Migration (Day 2)**
   - Update `package.json` dependencies
   - Create Allure 2 compatible `allure.config.js`
   - Add categorization plugin configuration
   - Add environment parametrization
   - Update `playwright.config.ts` reporter settings if needed

3. **Phase 3: Testing & Validation (Day 2-3)**
   - Run full regression suite (280+ tests)
   - Generate reports and validate:
     - All tests categorized correctly
     - Environment visibility works
     - JIRA tags preserved in reports
     - Video/screenshot artifacts included
     - Performance acceptable
   - Compare Allure 2 vs Allure 3 output

4. **Phase 4: Update Scripts & Documentation (Day 3)**
   - Update npm scripts (already working)
   - Update README with new reporting format
   - Update ADRs/documentation
   - Create migration guide if needed

5. **Phase 5: Deploy & Monitor (Day 4)**
   - Merge to `feat/allure2-migration-preprod-fixes` branch
   - Run tests in CI/CD
   - Monitor report generation in all environments
   - Archive or regenerate historical reports

6. **Phase 6: Team Training (Day 5)**
   - Brief QA team on new report format
   - Explain categorization improvements
   - Show JIRA integration readiness

### Success Criteria

- ✅ Allure 2 installed and configured without errors
- ✅ Full regression suite (290+ tests) generates report without failures
- ✅ Tests properly categorized by:
  - Component/Feature area
  - Priority (@smoke, @critical, @fast, @medium, @low)
  - Status (passed, failed, skipped)
  - JIRA ticket (@OCG-*, @COMS-*)
- ✅ Multi-environment visibility (PreProd/Lab/Production markers)
- ✅ Video/screenshot artifacts included in all reports
- ✅ Report generation time < 2 minutes for full test suite
- ✅ Historical data preserved (.allure/history.jsonl working)
- ✅ No test code changes required
- ✅ All npm scripts continue to work
- ✅ QA team can navigate and analyze reports effectively

### Rollback Plan

If Allure 2 introduces unexpected issues:

1. **Immediate Rollback** (< 30 minutes)
   ```bash
   git revert <commit>
   npm install
   npm run report:clean
   npm run report:generate
   ```

2. **Points of No Return**
   - After PR merge and CI validation: reversible
   - After main branch deploy: reversible (historical reports archived)

3. **Data Safety**
   - `.allure/results/*.json` format identical between Allure 2 & 3
   - `.allure/history.jsonl` preserved regardless of version
   - All artifact data survives rollback

## Implementation Details

### Dependencies to Update

```json
{
  "devDependencies": {
    "allure": "^2.x",
    "@allurereport/plugin-awesome": "^2.x",
    "allure-playwright": "^3.2.0",
    "@allurereport/plugin-category": "^2.x",
    "@allurereport/plugin-environment": "^2.x"
  }
}
```

### Configuration Example (Allure 2)

```javascript
// allure.config.js (Allure 2 format)
export default {
  name: 'Multi-Cinema Test Automation Report',
  output: '.allure/report',
  historyPath: '.allure/history.jsonl',
  
  // Allure 2 native categorization
  plugins: {
    awesome: {
      options: {
        reportName: 'Cinesa & UCI Cinema Automation',
        theme: 'dark',
        logo: null,
      },
    },
    category: {
      options: {
        categories: [
          {
            name: 'Feature Areas',
            matchedStatuses: ['passed', 'failed'],
            patterns: [
              { name: 'Booking Flow', pattern: '@seatpicker|@bar|@payment' },
              { name: 'Signup/Auth', pattern: '@signup|@login' },
              { name: 'Content', pattern: '@movies|@cinemas|@films' },
            ],
          },
          {
            name: 'Severity',
            matchedStatuses: ['failed'],
            patterns: [
              { name: 'Critical', pattern: '@critical' },
              { name: 'High', pattern: '@high' },
              { name: 'Medium', pattern: '@medium' },
            ],
          },
        ],
      },
    },
    environment: {
      options: {
        environments: ['PreProd', 'Lab', 'Production', 'Local'],
      },
    },
  },
};
```

### Files to Modify

1. `package.json` - Update Allure versions
2. `allure.config.js` - Update configuration format
3. `npm scripts` - Already compatible
4. `docs/REPORTING.md` - New documentation file
5. `README.md` - Update reporting section

### Files NOT to Modify

- No test files need changes
- No fixture files need changes
- No playwright.config.ts changes (reporter already compatible)
- No page object changes

## Notes

### Related Links

- [Allure 2 Documentation](https://docs.qameta.io/allure/)
- [Allure Playwright Plugin](https://github.com/allure-framework/allure-pytest)
- [ADR-0005: TypeScript Progressive Strictness](./0005-typescript-progressive-strictness.md)
- [JIRA Tickets Tagging](../TAG_STRATEGY.md)
- GitHub Issue: [Allure 3 Beta Instability](TBD)

### Related ADRs

- **ADR-0003**: Multi-Cinema Architecture (reporter strategy)
- **ADR-0004**: Unified Environment Configuration (TEST_ENV)

### Team Discussion Points

1. **Timeline**: Propose targeting this sprint for implementation
2. **Effort**: Configuration-only change, low risk
3. **Communication**: Update QA team before running tests
4. **Artifacts**: Plan for archiving Allure 3 reports (if desired)

## Decision Timeline

- **Proposed**: 2025-10-29
- **Review Period**: 2025-10-29 to 2025-10-31 (3 days)
- **Target Implementation Start**: 2025-10-31
- **Expected Completion**: 2025-11-02

## Update History

- **2025-10-29**: ADR Created and Proposed
- **Status**: Awaiting Team Review

---

**ADR Format Version**: 1.0  
**Created**: October 29, 2025  
**Last Review**: October 29, 2025  
**Maintained by**: Cinema Automation Team

