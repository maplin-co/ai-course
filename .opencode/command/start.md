---
description: Start working on a bead - claim it and prepare context
argument-hint: "<bead-id> [--worktree] [--research]"
agent: build
---

# Start: $ARGUMENTS

You're claiming a task and preparing to work on it. This is the entry point before implementation.

## Parse Arguments

| Argument     | Default  | Description                                    |
| ------------ | -------- | ---------------------------------------------- |
| `<bead-id>`  | required | The bead to start working on                   |
| `--worktree` | false    | Create isolated git worktree for this work     |
| `--research` | false    | Run parallel subagent research before starting |

## Load Skills

```typescript
skill({ name: "beads" });
```

## Ensure Git Hooks Installed

First-time setup per repo (prevents stale JSONL issues):

```bash
bd hooks install 2>/dev/null || echo "Hooks already installed"
```

## Current State

### Git Status

!`git status --porcelain`
!`git branch --show-current`

### Active Tasks

!`bd list --status=in_progress`

If you have uncommitted changes, ask the user:

1. Stash them (`git stash`)
2. Commit them first
3. Continue anyway (risky)

If you already have tasks in_progress, warn the user before claiming another.

## Task Details

!`bd show $ARGUMENTS`

Identify the task type from the bead:

| Type      | Hierarchy Level | Typical Scope                     |
| --------- | --------------- | --------------------------------- |
| `epic`    | Parent          | Multi-session, has subtasks       |
| `task`    | Middle          | Single session, may have subtasks |
| `subtask` | Leaf            | Single focused unit of work       |

Check for parent/child relationships:

```bash
bd dep tree $ARGUMENTS 2>/dev/null || echo "No dependencies"
```

## Claim The Task

```bash
bd update $ARGUMENTS --status in_progress
```

## Workspace Setup

### Create Feature Branch

Extract task info and parent branch for a readable branch name:

```bash
# Get current branch (parent branch)
PARENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Get task title and type from bead
BEAD_INFO=$(bd show $ARGUMENTS --json 2>/dev/null)
BEAD_TITLE=$(echo "$BEAD_INFO" | jq -r '.title // ""' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | cut -c1-40)
BEAD_TYPE=$(echo "$BEAD_INFO" | jq -r '.type // "task"')

# Map bead type to branch prefix
case "$BEAD_TYPE" in
  "bug") PREFIX="fix" ;;
  "feature"|"epic") PREFIX="feat" ;;
  "refactor") PREFIX="refactor" ;;
  "chore") PREFIX="chore" ;;
  *) PREFIX="feat" ;;
esac

# Create branch: <parent>/<type>/<bead-id>-<description>
BRANCH_NAME="${PARENT_BRANCH}/${PREFIX}/$ARGUMENTS-${BEAD_TITLE}"
git checkout -b "$BRANCH_NAME" 2>/dev/null || echo "Branch already exists or already on it"
```

**Branch naming convention:**
| Parent Branch | Bead Type | Example |
|---------------|-----------|---------|
| main | bug | `main/fix/bd-a1b2-login-error` |
| develop | feature | `develop/feat/bd-c3d4-user-auth` |
| release-v2 | chore | `release-v2/chore/bd-e5f6-update-deps` |

### Option B: Git Worktree (if --worktree flag)

For isolated work that won't conflict with main workspace:

```typescript
skill({ name: "using-git-worktrees" });
```

**When to use worktrees:**

- Epic-level work spanning multiple sessions
- Parallel work on different features
- Need to keep main workspace clean
- Long-running features with frequent context switches

**Worktree setup:**

```bash
# Get current branch (parent branch)
PARENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Get task title for readable worktree name
BEAD_INFO=$(bd show $ARGUMENTS --json 2>/dev/null)
BEAD_TITLE=$(echo "$BEAD_INFO" | jq -r '.title // ""' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | cut -c1-40)
BEAD_TYPE=$(echo "$BEAD_INFO" | jq -r '.type // "task"')

# Map bead type to branch prefix
case "$BEAD_TYPE" in
  "bug") PREFIX="fix" ;;
  "feature"|"epic") PREFIX="feat" ;;
  "refactor") PREFIX="refactor" ;;
  *) PREFIX="feat" ;;
esac

# Create branch: <parent>/<type>/<bead-id>-<description>
BRANCH_NAME="${PARENT_BRANCH}/${PREFIX}/$ARGUMENTS-${BEAD_TITLE}"

# Verify .gitignore has worktree directory
grep -q "^\.worktrees/$" .gitignore || echo ".worktrees/" >> .gitignore

# Create worktree with readable branch name
git worktree add ".worktrees/$ARGUMENTS" -b "$BRANCH_NAME"

# Navigate to worktree
cd .worktrees/$ARGUMENTS

# Install dependencies (auto-detect project type)
[ -f package.json ] && npm install
[ -f Cargo.toml ] && cargo build
[ -f requirements.txt ] && pip install -r requirements.txt
[ -f go.mod ] && go mod download
```

**Beads in worktrees:** The `.beads/` database is shared with main repo automatically. No special configuration needed unless using `BEADS_DIR` for external storage.

## Parallel Research (if --research flag or epic-level work)

For complex tasks, gather context before diving in:

```typescript
// Run subagents in parallel - multiple Task calls in one message
Task({
  subagent_type: "explore",
  description: "Explore codebase patterns",
  prompt: `Research codebase patterns for $ARGUMENTS:
    - Find similar implementations
    - Identify affected files
    - Note testing patterns used
    Return: File list, patterns found, testing approach`,
});

Task({
  subagent_type: "scout",
  description: "Research external docs",
  prompt: `Research external docs for $ARGUMENTS:
    - API documentation for libraries involved
    - Best practices for the approach
    - Common pitfalls to avoid
    Return: Key findings, code examples, warnings`,
});

// Both run in parallel, results available immediately
```

**Subagent delegation rules:**

- Subagents are **read-only** - they don't modify beads state
- Results returned immediately when all complete
- Use for research, not for implementation

## Existing Artifacts

!`ls .beads/artifacts/$ARGUMENTS/ 2>/dev/null || echo "No artifacts yet"`

Look for:

- `spec.md` - Requirements and constraints
- `prd.md` - PRD (optional, recommended for features)
- `prd.json` - PRD tasks (generated from prd.md)
- `progress.txt` - PRD execution progress (append-only)
- `research.md` - Previous research
- `plan.md` - Implementation plan
- `handoffs/` - Previous session handoffs

## Check Previous Sessions

```typescript
search_session({ query: "$ARGUMENTS" });
list_sessions({ limit: 3 });
```

Load context from previous work on this bead.

## Load Related Memory (Semantic Search)

Search for relevant past work and learnings before starting:

```typescript
// Find similar past work (semantic similarity)
memory -
  search({
    query: "[task title/description from bead]",
    mode: "semantic",
    limit: 3,
  });

// Find related observations (gotchas, patterns, learnings)
memory -
  search({
    query: "[task keywords]",
    mode: "semantic",
    type: "observation",
    limit: 3,
  });
```

**Review findings before diving in.** Past observations may contain:

- Gotchas to avoid
- Patterns that worked well
- Decisions already made

If memory search fails (Ollama not running), continue without it.

## PRD Tasks (If Present)

- If `.beads/artifacts/$ARGUMENTS/prd.json` exists: next is `/complete-next-task $ARGUMENTS`.
- If `.beads/artifacts/$ARGUMENTS/prd.md` exists but `prd.json` does not: generate tasks with `prd-task` (see `/create` for the full PRD workflow).

## Determine Next Step

Based on task type and what exists:

### For Epics (parent tasks)

| State              | Next Command                      |
| ------------------ | --------------------------------- |
| No subtasks        | `/plan $ARGUMENTS --create-beads` |
| Has ready subtasks | `/start <first-subtask-id>`       |
| All subtasks done  | `/finish $ARGUMENTS`              |

### For Tasks/Subtasks (leaf work)

| Artifacts Found       | Next Command                     |
| --------------------- | -------------------------------- |
| Nothing               | `/research $ARGUMENTS`           |
| Only spec.md          | `/plan $ARGUMENTS`               |
| spec.md + research.md | `/plan $ARGUMENTS`               |
| plan.md exists        | `/implement $ARGUMENTS`          |
| prd.json exists       | `/complete-next-task $ARGUMENTS` |

## Output

```
Started: $ARGUMENTS
━━━━━━━━━━━━━━━━━━━

Type: [epic/task/subtask]
Branch: $ARGUMENTS
Workspace: [main | worktree: .worktrees/$ARGUMENTS]
Status: in_progress

Hierarchy:
├── Parent: [parent-id or "none"]
└── Children: [count or "none"]

Artifacts:
• spec.md: [exists/missing]
• research.md: [exists/missing]
• plan.md: [exists/missing]

Research: [launched/skipped]

Next: [recommended command based on state]
```

## Quick Start

If `--quick` flag is passed and plan.md exists, skip directly to:

```
/implement $ARGUMENTS
```
