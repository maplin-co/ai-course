import fs from "node:fs/promises";
import path from "node:path";
import { tool } from "@opencode-ai/plugin";

// Observation types following claude-mem patterns
type ObservationType =
	| "decision"
	| "bugfix"
	| "feature"
	| "pattern"
	| "discovery"
	| "learning"
	| "warning";

type ConfidenceLevel = "high" | "medium" | "low";

const TYPE_ICONS: Record<ObservationType, string> = {
	decision: "🎯",
	bugfix: "🐛",
	feature: "✨",
	pattern: "🔄",
	discovery: "💡",
	learning: "📚",
	warning: "⚠️",
};

const CONFIDENCE_ICONS: Record<ConfidenceLevel, string> = {
	high: "🟢",
	medium: "🟡",
	low: "🔴",
};

// Patterns to detect file references in observation content
const FILE_PATTERNS = [
	// file:line format (e.g., src/auth.ts:42)
	/(?:^|\s)([a-zA-Z0-9_\-./]+\.[a-zA-Z]{2,4}):(\d+)/g,
	// backtick file paths (e.g., `src/auth.ts`)
	/`([a-zA-Z0-9_\-./]+\.[a-zA-Z]{2,4})`/g,
	// common source paths
	/(?:^|\s)(src\/[a-zA-Z0-9_\-./]+\.[a-zA-Z]{2,4})/g,
	/(?:^|\s)(\.opencode\/[a-zA-Z0-9_\-./]+\.[a-zA-Z]{2,4})/g,
];

interface FileReference {
	file: string;
	line?: number;
}

// Extract file references from observation content
function extractFileReferences(content: string): FileReference[] {
	const refs: FileReference[] = [];
	const seen = new Set<string>();

	for (const pattern of FILE_PATTERNS) {
		// Reset regex state
		pattern.lastIndex = 0;
		let match = pattern.exec(content);

		while (match !== null) {
			const file = match[1];
			const line = match[2] ? Number.parseInt(match[2], 10) : undefined;
			const key = `${file}:${line || ""}`;

			if (!seen.has(key) && !file.includes("node_modules")) {
				seen.add(key);
				refs.push({ file, line });
			}
			match = pattern.exec(content);
		}
	}

	return refs;
}

export default tool({
	description: `Create a structured observation for future reference.
	
	Purpose:
	- Capture decisions, bugs, features, patterns, discoveries, learnings, or warnings
	- Auto-detects file references from content (file:line, \`path\`, src/, .opencode/)
	- Stores in .opencode/memory/observations/ with YAML frontmatter
	- Optionally updates bead notes and handles observation supersession
	
	Example:
	observation({
	  type: "decision",
	  title: "Use JWT for auth",
	  content: "Decided to use JWT tokens because...",
	  concepts: "authentication, jwt, security",
	  confidence: "high"
	})`,
	args: {
		type: tool.schema
			.string()
			.describe(
				"Observation type: decision, bugfix, feature, pattern, discovery, learning, warning",
			),
		title: tool.schema.string().describe("Brief title for the observation"),
		content: tool.schema
			.string()
			.describe("Detailed observation content with context"),
		concepts: tool.schema
			.string()
			.optional()
			.describe(
				"Comma-separated concept tags (e.g., 'authentication, oauth, security')",
			),
		files: tool.schema
			.string()
			.optional()
			.describe(
				"Comma-separated related files (e.g., 'src/auth.ts, src/login.ts')",
			),
		bead_id: tool.schema
			.string()
			.optional()
			.describe("Related bead ID for traceability"),
		confidence: tool.schema
			.string()
			.optional()
			.describe(
				"Confidence level: high (verified), medium (likely), low (uncertain). Defaults to high.",
			),
		supersedes: tool.schema
			.string()
			.optional()
			.describe(
				"Filename of observation this supersedes (for contradiction handling)",
			),
	},
	execute: async (args: {
		type: string;
		title: string;
		content: string;
		concepts?: string;
		files?: string;
		bead_id?: string;
		confidence?: string;
		supersedes?: string;
	}) => {
		const obsDir = path.join(process.cwd(), ".opencode/memory/observations");

		// Validate type
		const validTypes: ObservationType[] = [
			"decision",
			"bugfix",
			"feature",
			"pattern",
			"discovery",
			"learning",
			"warning",
		];
		const obsType = args.type.toLowerCase() as ObservationType;
		if (!validTypes.includes(obsType)) {
			return `Error: Invalid observation type '${args.type}'.\nValid types: ${validTypes.join(", ")}`;
		}

		// Validate confidence level
		const validConfidence: ConfidenceLevel[] = ["high", "medium", "low"];
		const confidence = (args.confidence?.toLowerCase() ||
			"high") as ConfidenceLevel;
		if (!validConfidence.includes(confidence)) {
			return `Error: Invalid confidence level '${args.confidence}'.\nValid levels: ${validConfidence.join(", ")}`;
		}

		// Generate filename: YYYY-MM-DD-type-slug.md
		const now = new Date();
		const dateStr = now.toISOString().split("T")[0];
		const slug = args.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "")
			.substring(0, 40);
		const filename = `${dateStr}-${obsType}-${slug}.md`;
		const filePath = path.join(obsDir, filename);

		// Parse concepts and files
		const concepts = args.concepts
			? args.concepts.split(",").map((c) => c.trim())
			: [];
		let files = args.files ? args.files.split(",").map((f) => f.trim()) : [];

		// Auto-detect file references from content
		const detectedRefs = extractFileReferences(args.content);
		const detectedFiles = detectedRefs.map((r) => r.file);

		// Merge detected files with explicitly provided files
		const allFiles = [...new Set([...files, ...detectedFiles])];
		files = allFiles;

		// Build observation content with YAML frontmatter
		const icon = TYPE_ICONS[obsType];
		const confidenceIcon = CONFIDENCE_ICONS[confidence];

		// YAML frontmatter for temporal validity
		let observation = "---\n";
		observation += `type: ${obsType}\n`;
		observation += `created: ${now.toISOString()}\n`;
		observation += `confidence: ${confidence}\n`;
		observation += "valid_until: null\n";
		observation += "superseded_by: null\n";
		if (args.supersedes) {
			observation += `supersedes: ${args.supersedes}\n`;
		}
		if (args.bead_id) {
			observation += `bead_id: ${args.bead_id}\n`;
		}
		if (concepts.length > 0) {
			observation += `concepts: [${concepts.map((c) => `"${c}"`).join(", ")}]\n`;
		}
		if (files.length > 0) {
			observation += `files: [${files.map((f) => `"${f}"`).join(", ")}]\n`;
		}
		observation += "---\n\n";

		// Content
		observation += `# ${icon} ${args.title}\n\n`;
		observation += `${confidenceIcon} **Confidence:** ${confidence}\n\n`;
		observation += args.content;
		observation += "\n";

		try {
			// Ensure directory exists
			await fs.mkdir(obsDir, { recursive: true });

			// Write observation
			await fs.writeFile(filePath, observation, "utf-8");

			// Handle supersedes - update old observation's superseded_by field
			let supersedesStatus = "";
			if (args.supersedes) {
				try {
					const oldPath = path.join(obsDir, args.supersedes);
					const oldContent = await fs.readFile(oldPath, "utf-8");
					// Update superseded_by in frontmatter
					const updatedContent = oldContent.replace(
						/superseded_by: null/,
						`superseded_by: "${filename}"`,
					);
					if (updatedContent !== oldContent) {
						await fs.writeFile(oldPath, updatedContent, "utf-8");
						supersedesStatus = `\nSupersedes: ✓ Marked ${args.supersedes} as superseded`;
					}
				} catch {
					supersedesStatus = `\nSupersedes: ⚠ Could not update ${args.supersedes}`;
				}
			}

			let beadUpdate = "";

			// Update bead notes if bead_id provided
			if (args.bead_id) {
				try {
					const { execSync } = await import("node:child_process");
					const noteContent = `${icon} ${obsType}: ${args.title}`;
					execSync(
						`bd edit ${args.bead_id} --note "${noteContent.replace(/"/g, '\\"')}"`,
						{
							cwd: process.cwd(),
							encoding: "utf-8",
							timeout: 5000,
						},
					);
					beadUpdate = `\nBead updated: ${args.bead_id}`;
				} catch {
					beadUpdate = `\nWarning: Could not update bead ${args.bead_id}`;
				}
			}

			// Build auto-detected files info
			let autoDetectedInfo = "";
			if (detectedFiles.length > 0) {
				autoDetectedInfo = `\nAuto-detected: ${detectedFiles.length} file reference(s)`;
			}

			return `✓ Observation saved: ${filename}\n\nType: ${icon} ${obsType}\nTitle: ${args.title}\nConfidence: ${confidenceIcon} ${confidence}\nConcepts: ${concepts.join(", ") || "none"}\nFiles: ${files.join(", ") || "none"}${autoDetectedInfo}${supersedesStatus}${beadUpdate}\n\nPath: ${filePath}`;
		} catch (error) {
			if (error instanceof Error) {
				return `Error saving observation: ${error.message}`;
			}
			return "Unknown error saving observation";
		}
	},
});
