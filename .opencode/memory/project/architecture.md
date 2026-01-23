---
purpose: Key modules, directory structure, architectural decisions
updated: { { DATE } }
---

# Project Architecture

## Directory Structure

```
src/              # Source code
  index.ts        # Entry point
  commands/       # CLI commands
  utils/          # Utilities

dist/             # Built output
.opencode/        # OpenCode configuration
.beads/           # Task tracking
```

## Key Modules

### Module Name

**Purpose**: Brief description

**Files**:

- `src/module/file.ts`

**Dependencies**:

- External libs
- Internal modules

## Data Flow

```
User Action
  → Module A
    → Module B
      → External Service
```

## External Dependencies

- **Library**: Version, purpose
- **Service**: API endpoint, auth method

## Architectural Decisions

| Decision | Rationale    | Trade-offs   |
| -------- | ------------ | ------------ |
| Choice 1 | Why this way | Limitation 1 |

## TODO

- [ ] Document missing modules
- [ ] Add dependency diagram
- [ ] Map data flow diagrams
