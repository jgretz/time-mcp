import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpTool } from './types.ts';
import { getTime } from './get-time.ts';

export const tools: McpTool[] = [getTime];

export function registerTools(server: McpServer): void {
  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.inputSchema,
        annotations: tool.annotations,
      },
      tool.handler,
    );
  }
}
