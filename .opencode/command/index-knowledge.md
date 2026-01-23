---
description: Generate hierarchical AGENTS.md knowledge base
argument-hint: "[optional focus or notes]"
agent: plan
---

# Index Knowledge: $ARGUMENTS

Generate or refresh hierarchical `AGENTS.md` files for this codebase.

## Load Skill

```typescript
skill({ name: "index-knowledge" });
```

Then follow the skill workflow to:

- Analyze the repo structure
- Identify subsystem boundaries
- Generate/refresh `AGENTS.md` files (root + nested where appropriate)

<user-request>
$ARGUMENTS
</user-request>
