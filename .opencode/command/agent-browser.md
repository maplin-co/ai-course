---
description: Automate browser tasks (scraping, form filling, web interaction)
argument-hint: "[what you want to do in the browser]"
agent: general
---

# Agent Browser: $ARGUMENTS

Automate browser tasks using agent-browser CLI.

## Load Skill

```typescript
skill({ name: "agent-browser" });
```

Then follow the skill instructions to help with browser automation.

<user-request>
$ARGUMENTS
</user-request>
