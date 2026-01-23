---
purpose: Build, test, lint, deploy commands discovered for this project
updated: { { DATE } }
---

# Project Commands

## Development

```bash
npm run dev        # Start development server
bun run src/index.ts  # Run CLI directly
```

## Build

```bash
npm run build      # Build for production
bun build ...      # Additional build options
```

## Test

```bash
bun test           # Run all tests
bun test --watch   # Watch mode
bun test file.ts   # Run single file
```

## Lint

```bash
npm run lint       # Check for issues
npm run lint:fix   # Auto-fix issues
```

## Typecheck

```bash
npm run typecheck  # TypeScript checking only
```

## Database

```bash
npm run db:push    # Push schema changes
npm run db:studio  # Open database UI
```

## Deployment

```bash
npm run deploy     # Deploy to production
```

## CI/CD

- **Lint**: Runs on push
- **Test**: Runs on push
- **Deploy**: Triggers on main branch

## Beads (Task Tracking)

```bash
bd ready              # Find unblocked tasks
bd list --status=open # All open issues
bd show <id>          # Full details
bd create "Title" -p 2        # Create task
bd update <id> --status in_progress  # Claim
bd close <id> --reason "Done"        # Complete
bd sync               # Push to git
```
