---
description: Complete the next incomplete PRD task for a bead
argument-hint: "<bead-id>"
agent: build
---

# Complete Next Task: $ARGUMENTS

Complete one task from a bead PRD task list.

This command is **Beads-native**:

- PRD: `.beads/artifacts/<bead-id>/prd.md`
- Tasks: `.beads/artifacts/<bead-id>/prd.json`
- Progress: `.beads/artifacts/<bead-id>/progress.txt`

## Preconditions

- A bead exists: `bd show $ARGUMENTS`
- PRD task list exists:

```bash
ls ".beads/artifacts/$ARGUMENTS/prd.json"
```

If missing:

- Create PRD: `.beads/artifacts/$ARGUMENTS/prd.md` (use `skill({ name: "prd" })`)
- Convert: `skill({ name: "prd-task" })`

## Process

### 1) Get Bearings

- Read `.beads/artifacts/$ARGUMENTS/progress.txt` (create if missing)
- Read `.beads/artifacts/$ARGUMENTS/prd.json`
- Pick the next task with `passes: false`

### 2) Implement the Task

Implement only what’s needed to satisfy the verification steps.

### 3) Run Feedback Loops (Required)

Run what applies to the repo:

- tests
- lint
- typecheck

Do not commit if any fail.

### 4) Update PRD JSON

Set that task’s `passes` to `true`.

### 5) Update Progress Log

Append a short entry to `.beads/artifacts/$ARGUMENTS/progress.txt`:

```markdown
## Task - <task.id>

- What was implemented
- Files changed
- Learnings / patterns
```

### 6) Commit (Ask First)

Show staged changes and ask user before committing.

## Completion

If all tasks have `passes: true`, report that the PRD is complete and recommend:

- `/finish $ARGUMENTS`
