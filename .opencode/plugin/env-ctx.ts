import type { Plugin } from "@opencode-ai/plugin";

const session_set = new Set<string>();
const cwd = process.cwd();
const env_ctx = `
<environment_context>
  <cwd>${cwd}</cwd>
</environment_context>
`.trim();

export const EnvironmentContextPlugin: Plugin = async () => {
  return {
    async "chat.message"(_input, output) {
      const { message } = output;
      const sessionID = message?.sessionID;
      if (!sessionID) return;

      if (session_set.has(sessionID)) {
        return;
      }

      output.parts.unshift({
        id: `env-ctx-${Date.now()}`,
        messageID: message.id,
        sessionID,
        type: "text",
        text: env_ctx,
        synthetic: true,
      });

      session_set.add(sessionID);
    },
  };
};
