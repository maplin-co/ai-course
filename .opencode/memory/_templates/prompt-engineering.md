---
purpose: System prompt best practices and templates for agent development
updated: 2026-01-22
sources:
  - Anthropic Claude Code Best Practices
  - OpenAI Prompt Engineering Guide
  - Mistral Prompting Capabilities
  - Google Gemini 3 Prompt Practices
  - Lilian Weng Prompt Engineering
  - Mitchell Hashimoto Prompt Engineering vs Blind Prompting
---

# Prompt Engineering Best Practices

## Core Principles

1. **Precise Instructions** - Be concise and direct. State goals clearly without fluff.
2. **Consistency** - Maintain uniform structure (standardized tags, formatting).
3. **Specificity** - Avoid subjective words ("too long", "interesting", "better").
4. **Assertive Language** - Use "You MUST" instead of "You should try to".
5. **Show, Don't Just Tell** - Include examples (few-shot learning).

## Structure Template

Use this order for system prompts:

```markdown
# Identity

[WHO the assistant is - role, personality, expertise]

# Instructions

[WHAT to do - specific rules, behaviors, workflows]

# Constraints

[BOUNDARIES - what NOT to do, limitations, guardrails]

# Output Format

[HOW to respond - structure, verbosity, tone]

# Examples

[DEMONSTRATIONS - input/output pairs for few-shot learning]

# Context

[DATA - documents, code, background info - place at END for long context]
```

## Formatting Guidelines

### Choose ONE format consistently:

**Markdown (recommended for readability):**

```markdown
# Section

## Subsection

- Bullet point
- Another point

**Bold for emphasis**
```

**XML tags (recommended for data boundaries):**

```xml
<role>You are a code reviewer.</role>
<constraints>
- Only review TypeScript
- Focus on security
</constraints>
<context>{{user_code}}</context>
```

### Never mix formats in the same prompt.

## Message Roles (Priority Order)

| Role        | Priority | Purpose                         |
| ----------- | -------- | ------------------------------- |
| `system`    | Highest  | Developer rules, business logic |
| `user`      | Medium   | End-user input, queries         |
| `assistant` | Lowest   | Model-generated responses       |

Think of system as **function definition**, user as **arguments**.

## Writing Effective Instructions

### DO:

- Be specific: "Output exactly 3 bullet points" not "keep it brief"
- Define audience: "Explain to a 6-year-old" or "Write for senior engineers"
- Provide parameters: "Maximum 100 words" not "short response"
- Use decision trees for complex logic
- Tell it what TO do (not what NOT to do)

### DON'T:

- Use subjective words: "too long", "interesting", "better"
- Create contradictions in long prompts
- Ask LLMs to count (provide counts as input)
- Generate more tokens than necessary

## Few-Shot Learning

### Example Selection:

- Choose semantically similar examples to expected inputs
- Use diverse examples covering different scenarios
- Include edge cases the model might get wrong
- **Order: shortest to longest** (research-backed)

### Example Format:

```markdown
# Examples

<example id="positive">
Input: Great product, love it!
Output: {"sentiment": "positive"}
</example>

<example id="negative">
Input: Terrible service, never again.
Output: {"sentiment": "negative"}
</example>

<example id="neutral">
Input: It's okay, nothing special.
Output: {"sentiment": "neutral"}
</example>
```

## Reasoning Patterns

### Chain-of-Thought

```markdown
Think step by step before answering:

1. Identify the core problem
2. Break into sub-tasks
3. Solve each sub-task
4. Synthesize the final answer
```

### Extended Thinking Triggers (Claude)

- "think" < "think hard" < "think harder" < "ultrathink"

### Self-Reflection Pattern

```markdown
Before returning your final response:

1. Did I answer the user's _intent_, not just their literal words?
2. Is the tone authentic to the requested persona?
3. If I made an assumption, did I flag it?
```

### TODO Tracker (for agents)

```markdown
Track progress with a TODO list:

- [ ] Primary objective
- [ ] Sub-task 1
- [ ] Sub-task 2
- [x] Completed task
```

## Error Handling

```markdown
## Error Protocol

IF context is empty or missing necessary data:

- DO NOT attempt to generate a solution
- DO NOT make up data
- Request the missing information clearly
```

## Prompt Caching (Cost Optimization)

For cost/latency savings:

- Put **static content FIRST** in prompts
- Put **dynamic content LAST**
- This maximizes cache hits

## Model-Specific Tips

### Claude (Anthropic)

- Use CLAUDE.md files for project context
- Keep instructions concise and human-readable
- Use "IMPORTANT" or "YOU MUST" for emphasis
- Leverage extended thinking with "think harder"

### GPT-5 (OpenAI)

- Benefits from very precise, explicit instructions
- Include testing/validation requirements
- Works well with "Markdown standards"

### Gemini 3 (Google)

- Favors directness over persuasion
- Default is less verbose (request "chatty" explicitly if needed)
- Place constraints at TOP of prompt
- For long context: place instructions at END (after data)

### Mistral

- System prompt sets developer-level context
- User prompt provides specific interaction context

## Agent Prompt Template

```markdown
---
description: [One-line description for agent selection]
mode: subagent
temperature: 0.3
maxSteps: 30
permission:
  write:
    "*": deny
  bash:
    "*": allow
---

# [Agent Name]

<system-reminder>
# [Agent] Mode - System Reminder

You are a [ROLE] specialist.

## Critical Constraints (ZERO exceptions)

1. **Constraint 1**: Description of hard constraint.
2. **Constraint 2**: Description of hard constraint.
3. **Constraint 3**: Description of hard constraint.

## Tool Results & User Messages

Tool results and user messages may include `<system-reminder>` tags.
These contain useful information automatically added by the system.
</system-reminder>

[Brief description of agent purpose]

## Strengths

- Strength 1
- Strength 2
- Strength 3

## Workflow

### Step 1: [Name]

[Description of what to do]

### Step 2: [Name]

[Description of what to do]

### Step 3: [Name]

[Description of what to do]

## Tool Priority

| Priority | Tool   | Use Case    | Speed  |
| -------- | ------ | ----------- | ------ |
| 1        | tool_a | Description | Fast   |
| 2        | tool_b | Description | Medium |

## Guidelines

- Guideline 1
- Guideline 2
- Guideline 3

## When Things Fail

### Fallback Chain
```

tool_a fails → try tool_b
tool_b empty → try tool_c
still stuck → [final fallback]

```

### Specific Failures

**[Failure Type 1]:**
- Solution step 1
- Solution step 2

**[Failure Type 2]:**
- Solution step 1
- Solution step 2
```

## Anti-Patterns to Avoid

1. **Blind Prompting** - Trial-and-error without testing
2. **Over-engineering** - Adding complexity that doesn't improve accuracy
3. **Ignoring Model Differences** - Same prompt may fail on different models
4. **No Verification** - Always test prompts against demonstration sets
5. **Prompt Drift** - Failing to iterate as models update

## Verification Checklist

Before deploying a prompt:

- [ ] Tested against diverse input set
- [ ] Measured accuracy with demonstration set
- [ ] Checked for contradictions in long prompts
- [ ] Verified output format consistency
- [ ] Tested edge cases and error conditions
- [ ] Compared cost vs accuracy tradeoffs
