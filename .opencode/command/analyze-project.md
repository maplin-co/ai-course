---
description: Analyze project health, quality standards, and ready work
argument-hint: "[--quick|--deep]"
agent: build
---

# Analyze Project

Comprehensive project analysis with stack-specific best practices.

## Arguments

$ARGUMENTS

---

## Phase 1: Environment Detection

Detect project type to determine analysis strategy:

```bash
# Check config files
ls -la package.json pyproject.toml Cargo.toml go.mod pom.xml build.gradle 2>/dev/null || true

# Check lock files for package manager
ls -la bun.lockb yarn.lock pnpm-lock.yaml package-lock.json 2>/dev/null || true

# Check for monorepo
ls -la pnpm-workspace.yaml lerna.json nx.json turbo.json 2>/dev/null || true
```

Read the main config file to detect framework:

```typescript
read({ filePath: "package.json" }); // or pyproject.toml, Cargo.toml, etc.
```

---

## Phase 2: Parallel Research & Discovery

Once stack is detected, launch parallel subagent tasks using the Task tool.
Run all three in parallel (single message with multiple Task calls):

```typescript
// Scout: Research best practices for detected stack
Task({
  subagent_type: "scout",
  description: "Best practices research",
  prompt: `Research best practices for [DETECTED_STACK]:
    - Code quality standards and linting rules
    - Testing patterns and coverage expectations
    - Project structure conventions
    - Common anti-patterns to avoid
    Return as actionable checklist with specific recommendations.`,
});

// Scout: Framework-specific quality standards
Task({
  subagent_type: "scout",
  description: "Quality standards research",
  prompt: `Research quality standards for [DETECTED_FRAMEWORK]:
    - Recommended ESLint/Biome/Ruff rules
    - Type safety requirements
    - Performance best practices
    - Security checklist
    Return as comparison criteria checklist.`,
});

// Explore: Analyze codebase architecture
Task({
  subagent_type: "explore",
  description: "Architecture analysis",
  prompt: `Analyze this codebase architecture thoroughly:
    - Directory structure pattern (feature-based, layer-based, etc.)
    - Key modules and their responsibilities
    - Entry points and data flow
    - Test organization and coverage patterns
    Return as detailed architecture summary with file paths.`,
});
```

**Fallback:** If Task tool fails or network is unavailable, use local tools:

- `memory-search` for existing project knowledge
- Use `glob` + `read` to explore structure
- Skip external research phases

---

## Phase 3: Git & Version Control Health

```bash
# Current state
git status --short
git branch --show-current
git log --oneline -5

# Commits ahead/behind
git rev-list --left-right --count origin/main...HEAD 2>/dev/null || true

# Recent activity
git log -1 --format="%h %s (%cr by %an)"

# Uncommitted changes
git diff --stat
```

---

## Phase 4: Code Quality Checks

Run quality checks based on detected stack:

### For TypeScript/JavaScript:

```bash
# Type errors
npm run typecheck 2>/dev/null || npx tsc --noEmit 2>/dev/null || true

# Linting
npm run lint 2>/dev/null || npx biome check . 2>/dev/null || npx eslint . 2>/dev/null || true

# TODO/FIXME count
grep -r "TODO\|FIXME\|HACK\|XXX" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l || echo "0"
```

### For Python:

```bash
# Type checking
mypy . 2>/dev/null || true

# Linting
ruff check . 2>/dev/null || pylint **/*.py 2>/dev/null || true

# TODO count
grep -r "TODO\|FIXME" . --include="*.py" 2>/dev/null | wc -l || echo "0"
```

### For Rust:

```bash
cargo check 2>/dev/null || true
cargo clippy 2>/dev/null || true
```

---

## Phase 5: Test Health

```bash
# Run tests with coverage if available
npm test -- --coverage 2>/dev/null || \
bun test --coverage 2>/dev/null || \
pytest --cov 2>/dev/null || \
cargo test 2>/dev/null || \
go test ./... 2>/dev/null || \
echo "No test runner detected"
```

---

## Phase 6: Dependency & Security Health

```bash
# Outdated dependencies
npm outdated 2>/dev/null || pnpm outdated 2>/dev/null || pip list --outdated 2>/dev/null || true

# Security audit
npm audit 2>/dev/null || pip-audit 2>/dev/null || cargo audit 2>/dev/null || true
```

---

## Phase 7: CI/CD & Documentation Health

```bash
# CI status (GitHub Actions)
gh run list --limit 3 2>/dev/null || true

# Documentation presence
ls -la README.md CHANGELOG.md CONTRIBUTING.md AGENTS.md docs/ 2>/dev/null || true

# README freshness
git log -1 --format="%cr" -- README.md 2>/dev/null || true
```

---

## Phase 8: Task/Work Health (if Beads configured)

```bash
bd status 2>/dev/null || echo "Beads not configured"
bd ready 2>/dev/null || true
bd blocked 2>/dev/null || true
```

---

## Phase 9: Integrate Research Results

Task tool returns results directly - no collection needed.
Integrate findings from Phase 2 subagents into the report:

1. **Best practices checklist** → Compare against Phase 4 quality results
2. **Quality standards** → Use as criteria for Health Score calculation
3. **Architecture summary** → Include in report Architecture section

If subagents failed in Phase 2, use fallback data:

- Check `memory-read({ file: "project/architecture" })` for cached architecture
- Use `glob` + `read` to explore structure
- Skip best practices comparison (mark as "N/A - offline mode")

---

## Phase 10: Generate Report

Compile all findings into a comprehensive report:

```markdown
# Project Analysis Report

**Generated:** [DATE]
**Stack:** [DETECTED_STACK]
**Framework:** [DETECTED_FRAMEWORK]

## Health Score: X/100

| Category      | Score | Status  | Notes             |
| ------------- | ----- | ------- | ----------------- |
| Security      | X/20  | OK/Warn | X vulnerabilities |
| Code Quality  | X/20  | OK/Warn | X lint errors     |
| Test Coverage | X/20  | OK/Warn | X% coverage       |
| Dependencies  | X/20  | OK/Warn | X outdated        |
| Documentation | X/20  | OK/Warn | X missing         |

## Current State vs Best Practices

Based on [FRAMEWORK] best practices research:

| Practice            | Expected    | Actual   | Status |
| ------------------- | ----------- | -------- | ------ |
| Type Safety         | Strict mode | ...      | ✓/✗    |
| Test Coverage       | >80%        | X%       | ✓/✗    |
| Linting             | Zero errors | X errors | ✓/✗    |
| Dependency Security | No vulns    | X vulns  | ✓/✗    |

## Architecture Summary

[From explore agent]

## Priority Recommendations

1. **[HIGH]** [Action based on findings]
2. **[MEDIUM]** [Action based on findings]
3. **[LOW]** [Action based on findings]

## Ready Work

| ID  | Title | Priority | Type |
| --- | ----- | -------- | ---- |
| ... | ...   | ...      | ...  |
```

---

## Phase 11: Save to Memory

Save report for trend tracking:

```typescript
memory_update({
  file: "project/analysis-[YYYY-MM-DD]",
  content: "[GENERATED_REPORT]",
  mode: "replace",
});
```

---

## Output Modes

### --quick (Default)

- Phase 1, 3, 8 only
- ~30 seconds
- Basic status dashboard

### --deep

- All phases including subagent research
- ~3-5 minutes
- Full analysis with best practices comparison
