#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

KEY="${1:-}"
if [ -z "$KEY" ]; then
  echo "usage: $0 tk_..." >&2
  exit 2
fi

BIN="/data/data/com.termux/files/home/projects/tasker-mcp/tasker-mcp-server-cli-aarch64"
TOOLS="/data/data/com.termux/files/home/projects/tasker-mcp/toolDescriptions.json"

if nc -z 127.0.0.1 1821; then
  echo "Tasker HTTP server is listening on 127.0.0.1:1821"
else
  echo "Tasker HTTP server is NOT listening on 127.0.0.1:1821" >&2
  exit 3
fi

PAYLOAD='{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"tasker_flash_text","arguments":{"text":"Tasker MCP smoke test OK"}}}'

echo "$PAYLOAD" | "$BIN" \
  -tools "$TOOLS" \
  -tasker-host 127.0.0.1 \
  -tasker-port 1821 \
  -tasker-api-key "$KEY" \
  -mode stdio
