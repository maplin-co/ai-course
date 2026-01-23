---
type: decision
created: 2026-01-22T04:46:05.981Z
confidence: high
valid_until: null
superseded_by: null
concepts: ["AGENTS.md", "prompt-engineering", "system-prompt", "best-practices", "structure"]
---

# 🎯 AGENTS.md prompt engineering improvements

🟢 **Confidence:** high

Applied best practices from Anthropic, OpenAI, Mistral, Google, and prompt engineering experts to AGENTS.md:

1. Added Identity section at top (defines WHO before WHAT)
2. Moved Core Constraints near top (critical rules should be prominent)
3. Converted Delegation agents list to bullet points (scanability)
4. Converted LSP Operations to table format (checklist-style)
5. Added Error Protocol section (fallback patterns, retry limits)
6. Added brief Beads context intro (explains WHAT before HOW)
7. Added commit/secrets constraints to Core Constraints

Key best practices applied:
- Structure: Identity → Priority → Constraints → Instructions → Examples
- "DO NOT" framing (inhibition > instruction)
- Tables/bullets for scanability
- Atomic summaries for each section
- Error handling protocols
