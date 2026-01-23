---
purpose: Index of available memory templates
updated: 2026-01-12
---

# Memory Templates

Copy these templates to `.opencode/memory/project/` when starting a new project.

## Available Templates

| Template          | Purpose                                        |
| ----------------- | ---------------------------------------------- |
| `architecture.md` | Document project structure, modules, data flow |
| `conventions.md`  | Code style, naming, patterns, commit rules     |
| `gotchas.md`      | Known issues, edge cases, troubleshooting      |
| `commands.md`     | Build, test, lint, deploy commands             |

## Usage

```bash
# Copy template (replace DATE)
cp _templates/architecture.md ../project/architecture.md
sed -i '' "s/{{DATE}}/$(date +%Y-%m-%d)/g" ../project/architecture.md

# Or create your own from scratch
touch ../project/architecture.md
```

## Tips

- Fill out templates when you first learn about a project
- Update as you discover new patterns or issues
- Use `observation` tool for quick notes during work
- Use `memory-search` to find relevant context later
