# time-mcp

A tiny MCP server that returns the current date and time. Defaults to US
Eastern (`America/New_York`, DST-correct); callers may pass any IANA timezone.

It doubles as the **reference template for hosting an MCP server on fly.io**
over HTTP (Streamable HTTP transport + bearer auth). No database.

## Tool

- `get_time({ timezone? })` — current time. `timezone` is an IANA name
  (e.g. `Europe/London`, `Asia/Tokyo`); defaults to `America/New_York`.

## Layout (the hosting template)

- `src/server.ts` — `createServer()` factory (`McpServer` + tools).
- `src/index.ts` — **stdio** entry, for local dev / Claude Desktop stdio.
- `src/http.ts` — **hosted** entry: Hono + `Bun.serve`, `GET /ping` health
  check, bearer-gated `POST /mcp` Streamable HTTP transport (stateless).
- `src/http/auth.ts` — bearer-token middleware (`MCP_AUTH_TOKEN`).
- `deploy/Dockerfile`, `deploy/fly.toml` — fly.io deploy.

## Develop

```sh
bun install
bun test
bun run dev          # stdio
MCP_AUTH_TOKEN=dev bun run start   # http on :3000
curl localhost:3000/ping
```

## Deploy (fly.io)

```sh
# once
fly launch --no-deploy --copy-config --config deploy/fly.toml
fly secrets set MCP_AUTH_TOKEN="$(openssl rand -hex 32)" -a joshgretz-time-mcp

# each deploy
fly deploy --config deploy/fly.toml --dockerfile deploy/Dockerfile
```

Then register in Claude Desktop (`claude_desktop_config.json`) — see the
parent migration plan. Either native remote:

```json
"time": {
  "type": "http",
  "url": "https://joshgretz-time-mcp.fly.dev/mcp",
  "headers": { "Authorization": "Bearer <MCP_AUTH_TOKEN>" }
}
```

or, on older Desktop builds, the `mcp-remote` stdio bridge:

```json
"time": {
  "command": "npx",
  "args": ["mcp-remote", "https://joshgretz-time-mcp.fly.dev/mcp",
           "--header", "Authorization: Bearer <MCP_AUTH_TOKEN>"]
}
```
