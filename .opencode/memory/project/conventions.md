---
purpose: Code patterns, commit style, team conventions
updated: { { DATE } }
---

# Project Conventions

## Code Style

### TypeScript

- **Module**: ESNext, bundler moduleResolution
- **Strict**: Disabled
- **Imports**: Group stdlib, third-party, local

### Python

- **Version**: 3.10+
- **Style**: type hints required, dataclasses for config

## Naming Conventions

| Type      | Convention | Example           |
| --------- | ---------- | ----------------- |
| Classes   | PascalCase | `UserService`     |
| Functions | snake_case | `get_user_data()` |
| Variables | snake_case | `user_data`       |
| Constants | UPPER_CASE | `MAX_RETRIES`     |
| Files     | kebab-case | `user-service.ts` |

## Import Order

```typescript
// 1. Node.js stdlib
import fs from "node:fs/promises";
import path from "node:path";

// 2. Third-party
import { cli } from "cac";
import { log } from "@clack/prompts";

// 3. Local
import { initCommand } from "./commands/init.js";
```

## Commit Messages

```
type(scope): subject

body (optional)

footer (optional)
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Code Review

- **Self-review**: Run lint/typecheck before PR
- **Test coverage**: Add tests for new features
- **Docs**: Update README for user-facing changes

## Patterns to Avoid

- Premature abstraction
- Circular dependencies
- Magic numbers/strings
