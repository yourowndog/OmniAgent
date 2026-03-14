# OmniAgent Debugging Guide

### Server Logs
The OpenClaw gateway logs its internal reasoning, tool calls, and errors here:
`/data/data/com.termux/files/usr/tmp/openclaw-10374/openclaw-2026-03-13.log`

### Common Issues
1. **Self-Kill Loop:** If an agent attempts to restart the gateway via `exec`, it may leave zombie processes. Use `pkill -9 -f openclaw` to clear.
2. **Session Locks:** If the gateway won't start, delete any `*.lock` files in `~/.openclaw/agents/main/sessions/`.
3. **ACP Failures:** If sub-agents fail to spawn, the ACP runtime might need a manual restart of the gateway.
