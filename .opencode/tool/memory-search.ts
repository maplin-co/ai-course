import fs from "node:fs/promises";
import path from "node:path";
import { tool } from "@opencode-ai/plugin";

interface SearchResult {
	file: string;
	matches: { line: number; content: string }[];
}

async function searchDirectory(
	dir: string,
	pattern: RegExp,
	results: SearchResult[],
	baseDir: string,
): Promise<void> {
	try {
		const entries = await fs.readdir(dir, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name);

			if (entry.isDirectory()) {
				// Skip hidden directories and vector_db
				if (entry.name.startsWith(".") || entry.name === "vector_db") {
					continue;
				}
				await searchDirectory(fullPath, pattern, results, baseDir);
			} else if (entry.name.endsWith(".md")) {
				const content = await fs.readFile(fullPath, "utf-8");
				const lines = content.split("\n");
				const matches: { line: number; content: string }[] = [];

				lines.forEach((line, index) => {
					if (pattern.test(line)) {
						matches.push({
							line: index + 1,
							content: line.trim().substring(0, 150),
						});
					}
				});

				if (matches.length > 0) {
					const relativePath = path.relative(baseDir, fullPath);
					results.push({ file: relativePath, matches });
				}
			}
		}
	} catch {
		// Directory doesn't exist or not readable
	}
}

async function keywordSearch(
	query: string,
	type: string | undefined,
	_limit: number,
): Promise<SearchResult[]> {
	const memoryDir = path.join(process.cwd(), ".opencode/memory");
	const beadsDir = path.join(process.cwd(), ".beads/artifacts");
	const globalMemoryDir = path.join(
		process.env.HOME || "",
		".config/opencode/memory",
	);

	// Create case-insensitive regex from query
	let pattern: RegExp;
	try {
		pattern = new RegExp(query, "i");
	} catch {
		// Escape special chars if not valid regex
		const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		pattern = new RegExp(escaped, "i");
	}

	const results: SearchResult[] = [];

	// Handle type filtering
	if (type === "beads") {
		await searchDirectory(beadsDir, pattern, results, beadsDir);
	} else if (type && type !== "all") {
		const typeMap: Record<string, string> = {
			handoffs: "handoffs",
			research: "research",
			templates: "_templates",
			observations: "observations",
		};
		const subdir = typeMap[type];
		if (subdir) {
			const searchDir = path.join(memoryDir, subdir);
			await searchDirectory(searchDir, pattern, results, memoryDir);
		}
	} else {
		// Search all: memory + beads
		await searchDirectory(memoryDir, pattern, results, memoryDir);
		await searchDirectory(beadsDir, pattern, results, beadsDir);
		await searchDirectory(globalMemoryDir, pattern, results, globalMemoryDir);
	}

	return results;
}

function formatKeywordResults(
	query: string,
	results: SearchResult[],
	limit: number,
): string {
	if (results.length === 0) {
		return `No matches found for "${query}".`;
	}

	let output = `# Search: "${query}"\n\n`;
	output += `Found ${results.length} file(s) with matches.\n\n`;

	for (const result of results) {
		output += `## ${result.file}\n\n`;
		const matchesToShow = result.matches.slice(0, limit);
		for (const match of matchesToShow) {
			output += `- **Line ${match.line}:** ${match.content}\n`;
		}
		if (result.matches.length > limit) {
			output += `- ... and ${result.matches.length - limit} more matches\n`;
		}
		output += "\n";
	}

	return output;
}

export default tool({
	description: `Search across all memory files using keywords.
	
	Purpose:
	- Find past decisions, research, or handoffs
	- Searches: project memory, beads artifacts, and global memory
	- Returns file paths with matched lines and context
	
	Example:
	memory-search({ query: "authentication", type: "all", limit: 10 })`,
	args: {
		query: tool.schema
			.string()
			.describe("Search query: keywords or regex pattern"),
		type: tool.schema
			.string()
			.optional()
			.describe(
				"Filter by type: 'all' (default), 'handoffs', 'research', 'templates', 'observations', 'beads'",
			),
		limit: tool.schema.number().optional().describe("Max results (default: 5)"),
	},
	execute: async (args: { query: string; type?: string; limit?: number }) => {
		const limit = args.limit || 5;
		const results = await keywordSearch(args.query, args.type, limit);
		return formatKeywordResults(args.query, results, limit);
	},
});
