/**
 * LSP Plugin - Active LSP Tool Enforcement
 *
 * Forces agents to actively use LSP tools when code files are detected.
 * This is NOT a suggestion - agents MUST execute LSP operations immediately.
 *
 * Mechanism:
 * 1. Hooks into grep/glob/read tool outputs (tool.execute.after)
 * 2. Hooks into user messages mentioning code files (chat.message)
 * 3. Injects MANDATORY LSP execution commands
 * 4. Uses strong language to override agent tendencies to skip
 *
 * Based on oh-my-opencode's LSP forcing pattern.
 */

import type { Plugin } from "@opencode-ai/plugin";

// File extensions that support LSP
const LSP_SUPPORTED_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".py",
  ".go",
  ".rs",
  ".java",
  ".c",
  ".cpp",
  ".h",
  ".hpp",
  ".cs",
  ".rb",
  ".php",
  ".swift",
  ".kt",
  ".scala",
  ".lua",
  ".zig",
  ".vue",
  ".svelte",
]);

// Regex to extract file:line patterns from tool output
const FILE_LINE_PATTERNS = [
  // Standard grep output: path/file.ts:42: content
  /^([^\s:]+\.(ts|tsx|js|jsx|py|go|rs|java|c|cpp|h|hpp|cs|rb|php|swift|kt|scala|lua|zig|vue|svelte)):(\d+):/gm,
  // Just path with line: path/file.ts:42
  /([^\s:]+\.(ts|tsx|js|jsx|py|go|rs|java|c|cpp|h|hpp|cs|rb|php|swift|kt|scala|lua|zig|vue|svelte)):(\d+)/g,
  // Glob/list output with just paths
  /^([^\s:]+\.(ts|tsx|js|jsx|py|go|rs|java|c|cpp|h|hpp|cs|rb|php|swift|kt|scala|lua|zig|vue|svelte))$/gm,
];

// Patterns that indicate user is asking about code
const CODE_INTENT_PATTERNS = [
  /\b(edit|modify|change|update|fix|refactor|add|remove|delete)\b.*\.(ts|tsx|js|jsx|py|go|rs)/i,
  /\b(function|class|method|variable|type|interface)\s+\w+/i,
  /\b(implement|create|build)\b.*\b(feature|component|module)/i,
  /@[^\s]+\.(ts|tsx|js|jsx|py|go|rs)/i, // @file.ts mentions
  /\b(src|lib|app|components?)\/[^\s]+\.(ts|tsx|js|jsx)/i, // Path patterns
];

interface FileMatch {
  filePath: string;
  line?: number;
  character?: number;
}

function extractFileMatches(output: string): FileMatch[] {
  const matches: FileMatch[] = [];
  const seen = new Set<string>();

  for (const pattern of FILE_LINE_PATTERNS) {
    pattern.lastIndex = 0;

    let match = pattern.exec(output);
    while (match !== null) {
      const filePath = match[1];
      const line = match[3] ? Number.parseInt(match[3], 10) : undefined;

      const key = `${filePath}:${line || 0}`;
      if (!seen.has(key)) {
        seen.add(key);
        matches.push({
          filePath,
          line,
          character: 1,
        });
      }

      match = pattern.exec(output);
    }
  }

  return matches.slice(0, 5);
}

function extractFilesFromUserMessage(text: string): string[] {
  const files: string[] = [];
  const seen = new Set<string>();

  // Match @file.ts patterns
  const atMentions = text.match(/@([^\s]+\.(ts|tsx|js|jsx|py|go|rs))/gi) || [];
  for (const mention of atMentions) {
    const file = mention.replace("@", "");
    if (!seen.has(file)) {
      seen.add(file);
      files.push(file);
    }
  }

  // Match path patterns like src/foo.ts
  const pathPatterns =
    text.match(/\b(src|lib|app|components?)\/[^\s]+\.(ts|tsx|js|jsx|py|go|rs)/gi) || [];
  for (const path of pathPatterns) {
    if (!seen.has(path)) {
      seen.add(path);
      files.push(path);
    }
  }

  return files.slice(0, 3);
}

function generateLspCommands(matches: FileMatch[]): string {
  if (matches.length === 0) return "";

  const commands: string[] = [];

  for (const match of matches) {
    if (match.line) {
      // With line number - get definition and references
      commands.push(
        `lsp({ operation: "goToDefinition", filePath: "${match.filePath}", line: ${match.line}, character: ${match.character || 1} })`,
      );
      commands.push(
        `lsp({ operation: "findReferences", filePath: "${match.filePath}", line: ${match.line}, character: ${match.character || 1} })`,
      );
      commands.push(
        `lsp({ operation: "hover", filePath: "${match.filePath}", line: ${match.line}, character: ${match.character || 1} })`,
      );
    } else {
      // Just file path - get document symbols
      commands.push(
        `lsp({ operation: "documentSymbol", filePath: "${match.filePath}", line: 1, character: 1 })`,
      );
    }
  }

  const uniqueCommands = [...new Set(commands)].slice(0, 6);

  // AGGRESSIVE enforcement format - designed to force action
  return `

╔══════════════════════════════════════════════════════════════════════════════╗
║  ⚡ LSP EXECUTION REQUIRED - DO NOT SKIP                                      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  Code files detected. You MUST execute these LSP operations NOW.             ║
║  DO NOT proceed with edits until LSP context is retrieved.                   ║
║                                                                              ║
║  EXECUTE IMMEDIATELY (copy-paste ready):                                     ║
║                                                                              ║
${uniqueCommands.map((cmd) => `║  → ${cmd}`).join("\n")}
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  WHY THIS IS MANDATORY:                                                      ║
║  • grep/read show text, LSP shows semantic meaning                           ║
║  • LSP provides accurate type info, definitions, call hierarchies            ║
║  • Editing without LSP context leads to broken code                          ║
║  • This is a HARD RULE, not a suggestion                                     ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  WORKFLOW: grep/read → LSP → understand → THEN edit                          ║
╚══════════════════════════════════════════════════════════════════════════════╝
`;
}

function generateUserMessageNudge(files: string[]): string {
  const lspCommands = files.map(
    (f) => `lsp({ operation: "documentSymbol", filePath: "${f}", line: 1, character: 1 })`,
  );

  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ [LSP CONTEXT REQUIRED]

Before making ANY changes to these files, you MUST first retrieve LSP context:

${lspCommands.map((cmd) => `→ ${cmd}`).join("\n")}

This is a HARD RULE. Do NOT guess about code structure.
Workflow: READ file → LSP documentSymbol/hover → UNDERSTAND → THEN edit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
}

function shouldInjectNudge(toolName: string): boolean {
  return ["grep", "glob", "read", "batch"].includes(toolName);
}

function hasCodeFiles(output: string): boolean {
  for (const ext of LSP_SUPPORTED_EXTENSIONS) {
    if (output.includes(ext)) return true;
  }
  return false;
}

function userMessageMentionsCode(text: string): boolean {
  return CODE_INTENT_PATTERNS.some((pattern) => pattern.test(text));
}

export const Lsp: Plugin = async () => {
  return {
    name: "lsp",
    version: "1.1.0",

    /**
     * Hook: chat.message
     * Injects LSP reminder when user mentions code files in their message
     * This catches intent BEFORE tools are executed
     */
    "chat.message": async (input, output) => {
      const { sessionID, messageID } = input;
      const { message, parts } = output;

      // Only process user messages
      if (message.role !== "user") return;

      // Extract text from all parts
      const fullText = parts
        .filter((p) => p.type === "text")
        .map((p) => ("text" in p ? p.text : ""))
        .join(" ");

      // Check if user is mentioning code files or asking about code
      if (!userMessageMentionsCode(fullText)) return;

      // Extract specific files mentioned
      const files = extractFilesFromUserMessage(fullText);

      // If files found, inject specific LSP commands
      // If no specific files but code intent detected, inject general reminder
      const nudgeText =
        files.length > 0
          ? generateUserMessageNudge(files)
          : `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ [LSP FIRST - HARD RULE]

Code modification detected. Before editing:
1. Use grep/glob to find relevant files
2. Use READ to view the file
3. Use LSP (documentSymbol, goToDefinition, findReferences) to understand structure
4. ONLY THEN make edits

Do NOT skip LSP. Editing without semantic context leads to broken code.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

      // Inject synthetic message part with all required fields
      const partId = `lsp-nudge-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      parts.push({
        id: partId,
        sessionID,
        messageID: messageID || "",
        type: "text",
        text: nudgeText,
        synthetic: true,
      } as import("@opencode-ai/sdk").Part);
    },

    /**
     * Hook: tool.execute.after
     * Injects LSP commands after grep/glob/read returns code file results
     * This catches AFTER tools show code files
     */
    "tool.execute.after": async (input, output) => {
      const { tool: toolName } = input;
      const result = output.output;

      // Skip if not a search/read tool
      if (!shouldInjectNudge(toolName)) return;

      // Skip if no code files in output
      if (typeof result !== "string" || !hasCodeFiles(result)) return;

      // Extract file matches
      const matches = extractFileMatches(result);
      if (matches.length === 0) return;

      // Generate LSP commands (not suggestions - COMMANDS)
      const lspBlock = generateLspCommands(matches);
      if (!lspBlock) return;

      // Append mandatory LSP block to tool output
      output.output = `${result}${lspBlock}`;
    },
  };
};

export default Lsp;
