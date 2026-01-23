# OpenCodeKit Template - Configuration Guide

**Project-specific OpenCode configuration and custom extensions.**

---

## Quick Start

### 1. Environment Setup

```bash
# Copy environment template
cp .opencode/.env.example .opencode/.env

# Add required API keys (minimum)
# Edit .opencode/.env and add:
CONTEXT7_API_KEY=your_context7_api_key_here
EXA_API_KEY=your_exa_api_key_here
```

### 2. Verify Configuration

```bash
# Start OpenCode (should load without errors)
opencode

# Test MCP services
# In OpenCode chat: "search context7 for Next.js documentation"
```

---

## Directory Structure

```
.opencode/
├── .env.example           # Environment variables template (COPY TO .env)
├── README.md              # This file
├── opencode.json          # OpenCode configuration
├── AGENTS.md              # Global agent rules
│
├── agent/                 # Custom agents (5 total)
├── command/               # Custom commands (26 workflows)
├── skill/                 # Domain expertise (27 skills)
├── tool/                  # Custom MCP tools (memory-*, observation)
├── plugin/                # Background plugins (enforcer, compactor, truncator)
└── memory/                # Persistent context
```

---

## Required Environment Variables

**Minimum setup (.opencode/.env):**

```bash
# Required for core functionality
CONTEXT7_API_KEY=your_context7_api_key_here  # Library docs
EXA_API_KEY=your_exa_api_key_here            # Web search
```

**Optional (enable specific features):**

```bash
# Figma integration
FIGMA_API_KEY=your_figma_api_key_here

# Google Stitch (AI UI design)
GOOGLE_CLOUD_PROJECT=your_gcp_project_id
STITCH_ACCESS_TOKEN=$(gcloud auth print-access-token)

# Cloud deployments (devops skill)
CLOUDFLARE_API_TOKEN=your_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
```

**Get API keys:**

- Context7: https://context7.com
- Exa: https://exa.ai
- Figma: https://www.figma.com/developers/api#access-tokens
- Google Cloud: https://console.cloud.google.com (for Stitch)

---

## Agent System (5 Custom + 2 Built-in)

**Primary Agents:**

- **@build** - Main orchestrator (Claude Opus 4.5) - handles 70% of work
- **@general** - Fast subagent for small, well-defined tasks

**Subagents:**

- **@plan** - Architecture, multi-phase coordination
- **@scout** - External research (library docs + GitHub patterns)
- **@review** - Code review + debugging + security audit
- **@vision** - UI/UX design: mockup, UI review, accessibility, aesthetics, visual

**Built-in (OpenCode):**

- **@explore** - Fast codebase search
- **@general** - Simple tasks and fallback

---

## Custom Commands (26 workflows)

**Invoke with `/` prefix:**

- `/commit` - Intelligent git commits
- `/pr` - Create pull requests
- `/design` - Thoughtful design with brainstorming expertise
- `/fix` - Systematic debugging with root-cause analysis
- `/implement` - High-quality implementation with TDD and subagents
- `/finish` - Verified completion with structured integration options

**See:** `.opencode/command/` for all commands

---

## Skills System (27 skills)

**Core:** brainstorming, writing-plans, executing-plans, verification-before-completion, using-superpowers, finishing-a-development-branch
**Code:** requesting-code-review, receiving-code-review, root-cause-tracing, test-driven-development, testing-anti-patterns, condition-based-waiting, defense-in-depth, systematic-debugging
**UI/UX:** frontend-design, mockup-to-code, visual-analysis, ui-ux-research, accessibility-audit, design-system-audit
**Workflow:** gemini-large-context, subagent-driven-development, dispatching-parallel-agents, using-git-worktrees, sharing-skills, writing-skills, testing-skills-with-subagents

**Note:** Skills load via native `skill()` tool. Commands auto-load relevant expertise.

---

## Memory System (2-Layer Architecture)

```
Memory (Permanent)     → Beads (Multi-session)    → Git (Audit Trail)
.opencode/memory/       .beads/artifacts/          .git/
```

**Memory:** Permanent knowledge, decisions, learnings  
**Beads:** Multi-session tasks with spec/research/plan/review artifacts  
**Git:** Automatic execution history

**See:** `AGENTS.md` for global rules and tool priority

---

## Active Plugins (Background)

Plugins run automatically in every session:

- **enforcer** - OS notification when session idles with incomplete TODOs
- **compactor** - Warns at 70%, 85%, 95% context usage - prevents rushed work
- **truncator** - Dynamic output truncation based on context remaining

**Compactor thresholds**:

- 70% - Gentle reminder, still plenty of room
- 85% - Consider pruning or summarizing
- 95% - Critical: prune immediately or start new session

---

## Custom Tools

- **memory-read** - Load previous context, templates
- **memory-update** - Save learnings, handoffs
- **memory-search** - Search across all memory files (keyword-based)
- **observation** - Create structured observations (decision, bugfix, feature, etc.)

---

### AST-Grep Usage

---

## MCP Services

**Enabled by default (3 total):**

1. **context7** - Up-to-date library documentation (37.6k+ libraries)
   - Requires: CONTEXT7_API_KEY
   - GitHub: https://github.com/upstash/context7

2. **exa** - Web search + code context (3.3k+ repos)
   - Requires: EXA_API_KEY
   - GitHub: https://github.com/exa-labs/exa-mcp-server

3. **gh_grep** - Search 1M+ public GitHub repositories
   - No API key needed (public service)
   - GitHub: https://github.com/Shachlan/grep.app-mcp

**Skill-Embedded MCP (load on-demand):**

4. **figma** - Extract Figma layouts and design tokens
   - Requires: FIGMA_API_KEY
   - Use: `skill({ name: "figma" })` then `skill_mcp()`

5. **playwright** - Browser automation for testing
   - No API key needed
   - Use: `skill({ name: "playwright" })` then `skill_mcp()`

6. **chrome-devtools** - DevTools for debugging and performance
   - No API key needed
   - Use: `skill({ name: "chrome-devtools" })` then `skill_mcp()`

7. **stitch** - Google Stitch AI-powered UI design generation
   - Requires: Google Cloud project with Stitch API enabled
   - Tools: `stitch_list_projects`, `stitch_create_project`, `stitch_generate_screen_from_text`, etc.
   - See: [Stitch MCP Setup](#stitch-mcp-setup) below

---

## Stitch MCP Setup

Google Stitch MCP enables AI-powered UI design generation directly from OpenCode.

### Prerequisites

1. **Google Cloud CLI** installed: https://cloud.google.com/sdk/docs/install
2. **Google Cloud Project** with billing enabled

### Setup Steps

**Step 1: Authenticate with Google Cloud**

```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Set up Application Default Credentials
gcloud auth application-default login
```

**Step 2: Enable Stitch MCP**

```bash
# Enable the Stitch API
gcloud services enable stitch.googleapis.com --project=YOUR_PROJECT_ID

# Enable Stitch for MCP access (required!)
gcloud beta services mcp enable stitch.googleapis.com --project=YOUR_PROJECT_ID
```

**Step 3: Set Environment Variables**

Add to your `.opencode/.env` or export before starting OpenCode:

```bash
# Google Cloud Project ID
GOOGLE_CLOUD_PROJECT=your-project-id

# Access token (refresh when expired - tokens last ~1 hour)
STITCH_ACCESS_TOKEN=$(gcloud auth print-access-token)
```

**Step 4: Verify Configuration**

The Stitch MCP is pre-configured in `opencode.json`. After setting environment variables, restart OpenCode and test:

```bash
# In OpenCode, call Stitch tools directly:
stitch_list_projects
stitch_create_project --title "My App"
```

### Available Stitch Tools

| Tool                               | Description                       |
| ---------------------------------- | --------------------------------- |
| `stitch_list_projects`             | List all your Stitch projects     |
| `stitch_create_project`            | Create a new UI design project    |
| `stitch_get_project`               | Get project details               |
| `stitch_list_screens`              | List screens in a project         |
| `stitch_get_screen`                | Get screen details with HTML code |
| `stitch_generate_screen_from_text` | Generate UI from text prompt      |

### Example Usage

```bash
# Create a new project
stitch_create_project --title "E-commerce App"

# Generate a login screen
stitch_generate_screen_from_text \
  --projectId "PROJECT_ID" \
  --prompt "Create a modern login page with email and password fields, social login buttons, and a forgot password link" \
  --deviceType "MOBILE"
```

### Troubleshooting

**"Stitch API not enabled":**

```bash
gcloud beta services mcp enable stitch.googleapis.com --project=YOUR_PROJECT_ID
```

**"Authentication failed":**

```bash
# Refresh your access token (expires after ~1 hour)
export STITCH_ACCESS_TOKEN=$(gcloud auth print-access-token)
# Restart OpenCode
```

**"Project not set":**

```bash
gcloud config set project YOUR_PROJECT_ID
export GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
```

### Documentation

- [Google Stitch](https://stitch.withgoogle.com)
- [Stitch MCP Setup](https://stitch.withgoogle.com/docs/mcp/setup)
- [Google Cloud MCP Overview](https://docs.cloud.google.com/mcp/overview)

---

## Getting Started Examples

### Simple Task

```
User: "Find all TypeScript files"
@build: [executes directly]
Result: 42 files found
```

### Research Task

```
User: "Research Next.js 14 App Router"
@build → @scout (docs + GitHub patterns)
Result: Comprehensive research doc
```

### Complex Feature

```
User: "Build auth system"
@build → @plan (4 phases)
@plan → @review (security audit)
Result: Secure auth with tests
```

### Using Commands

```
User: "/design implement dashboard"
@build: [loads brainstorming skill]
Result: Dashboard with shadcn/ui
```

---

## Troubleshooting

**"Notifications not working" (WSL/Windows):**

If running OpenCode in WSL, notifications require additional setup:

```bash
# 1. Install dependencies
sudo apt install -y libnotify-bin dunst

# 2. Start dunst (run each time you open WSL terminal)
dunst >/dev/null 2>&1 &

# 3. Or add to ~/.bashrc for auto-start:
if ! pgrep -x dunst >/dev/null; then
  dunst >/dev/null 2>&1 &
fi
```

**"API key not found":**

- Check .env location (.opencode/.env or ~/.config/opencode/.env)
- No quotes around values (CONTEXT7_API_KEY=abc not "abc")
- Restart OpenCode after changes

**"MCP server failed":**

- Check enabled: true in opencode.json
- Verify command path (python, npx in PATH)
- Check logs: ~/.config/opencode/logs/

**"Skills not loading":**

- Skills load via native `skill()` tool (auto-discovered)
- Use /design to load brainstorming
- Use /fix to load systematic-debugging
- Check `.opencode/skill/` directory exists

---

## Best Practices

**Environment:**

- Use .opencode/.env for project keys
- Use ~/.config/opencode/.env for global keys
- Never commit .env files
- Rotate API keys regularly

**Memory:**

- Update memory after major phases
- Document decisions in architecture notes
- Log blockers in research findings
- Keep research organized (YYYY-MM-DD-topic.md)

**Delegation:**

- Use @build for 70% of work
- Delegate to @plan for 3+ phases
- Use @review before deployment (code review + security)
- Use @scout for library docs + GitHub patterns
- Use @explore for codebase search

---

## Resources

- **OpenCode Docs:** https://opencode.ai/docs
- **Context7 API:** https://context7.com
- **Exa API:** https://exa.ai
- **Skills Documentation:** `.opencode/skill/`
- **Architecture Guide:** `AGENTS.md`

---

**OpenCodeKit v0.15.7**  
**Architecture:** Two-Layer (Memory + Beads + Git)  
**New in v0.13.2:** Multimodal support for gemini-claude models (image, PDF input)  
**Package:** `npx opencodekit` to scaffold new projects  
**Last Updated:** January 21, 2026
