---
description: Start Ralph Wiggum autonomous loop for task completion
argument-hint: "<task> [--prd <file>]"
agent: build
---

# Ralph Wiggum Loop

First, load the ralph skill for complete instructions:

```typescript
skill({ name: "ralph" });
```

## Task

$ARGUMENTS

## Quick Start

1. **Load the skill** (above) to get full workflow instructions
2. **Detect environment**: Check lock files to determine package manager
3. **Create progress.txt**: Track completed tasks and notes
4. **Start iterating**: Follow the loop pattern from the skill

## The Loop (Summary)

```
Read PRD → Pick task → Implement ONE feature → Validate → Commit → Update progress → Repeat
```

Exit when ALL tasks complete by outputting:

```
<promise>COMPLETE</promise>
```

## See Also

- Full instructions: `skill({ name: "ralph" })`
- Skill location: `.opencode/skill/ralph/SKILL.md`
