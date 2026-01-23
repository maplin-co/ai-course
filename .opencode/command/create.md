---
description: Create a tracked task with spec
argument-hint: "[title or description]"
agent: build
---

# Create: $ARGUMENTS

You're creating a new tracked task. Keep it simple unless complexity demands otherwise.

## Check For Duplicates First

!`bd list --status=all | grep -i "[keywords]"`

If similar work exists, link to it or extend it instead of creating duplicate.

## Gather Requirements

If `$ARGUMENTS` is clear, use it directly. If vague, ask:

1. What problem are we solving?
2. Bug, feature, or task?
3. What's the acceptance criteria?
4. Any constraints?

Keep it brief. Don't over-engineer the interview.

## Assess Complexity

**Simple** (single bead): One file, one clear action, ~30 min or less
**Complex** (needs decomposition): Multiple domains, natural phases, hours of work

If complex, ask: "This looks like it needs decomposition. Create an epic with subtasks?"

## Create The Bead

Simple task:

```bash
bd create "[title]" -t task -p 2
```

Bug:

```bash
bd create "[title]" -t bug -p 1
```

Feature:

```bash
bd create "[title]" -t feature -p 2
```

Epic (if decomposing):

```bash
bd create "[title]" -t epic -p 1
```

## Create Spec

Write `.beads/artifacts/<bead-id>/spec.md`.

Treat `spec.md` as a **short task card** (one screen): goal + success criteria + constraints. Put the detailed plan and task breakdown in `prd.md`.

```markdown
# [Title]

**Bead:** <bead-id>
**Created:** [date]

## Goal

[1-2 sentences: What and why]

## Success Criteria

- [ ] [Criterion 1]
  - Verify: `[command]`
- [ ] [Criterion 2]
  - Verify: `[command]`

## Constraints

**Must:** [required]
**Never:** [forbidden]

## PRD (Optional)

If this task has a PRD, keep details there:

- `.beads/artifacts/<bead-id>/prd.md`
- `.beads/artifacts/<bead-id>/prd.json` (generated)

## Notes

[only brief context here; details belong in prd.md]
```

## If Epic: Create Subtasks

```bash
# First task (no blockers)
bd create "[subtask 1]" -t task -p 2

# Second task (blocked by first)
bd create "[subtask 2]" -t task -p 2
bd dep add bd-[second] bd-[first] --type blocks
```

Visualize:

!`bd dep tree bd-[epic]`

## Optional: Create a PRD (Recommended for features)

If the work is more than a small one-off change, create a PRD alongside the spec.

- Template: `.opencode/memory/_templates/prd.md`
- Output: `.beads/artifacts/<bead-id>/prd.md`

```typescript
skill({ name: "prd" });
```

Write the PRD so it includes a `## Tasks` section (each `### ... [category]` with `**Verification:**` bullets).

After PRD is written, convert it to executable tasks:

```typescript
skill({ name: "prd-task" });
```

This generates:

- `.beads/artifacts/<bead-id>/prd.json`
- `.beads/artifacts/<bead-id>/progress.txt`

## Sync

```bash
bd sync
```

## Output

```
Created: bd-[id]

Type: [task/bug/feature/epic]
Priority: [0-4]
Spec: .beads/artifacts/bd-[id]/spec.md

Next:
- `/start bd-[id]` (recommended)
- or `/implement bd-[id]` (direct implementation)
```

If epic with subtasks:

```
Created: bd-[epic] (Epic)

Subtasks:
├── bd-[epic].1: [title] ← READY
├── bd-[epic].2: [title] ← blocked by .1
└── bd-[epic].3: [title] ← blocked by .2

Next: /implement bd-[epic].1
```
