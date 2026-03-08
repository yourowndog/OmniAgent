# OpenClaw & MCP Setup Guide

## Phase 1: Fire Up the "Office" (OpenClaw)
Before you can index code, you need the AI interface running so you can give it instructions.

1. **Start the Gateway:**
   * Open a new Termux session.
   * Type: `proot-distro login debian --user openclaw`
   * Type: `start-claw`
2. **Open the Interface:**
   * Swipe left in Termux to open a second session.
   * Type: `proot-distro login debian --user openclaw`
   * Type: `openclaw tui` (This opens the Terminal User Interface).
3. **Explore:** Just poke around the OpenClaw interface for 5 minutes to get comfortable.

## Phase 2: Give the AI its "Eyes" (jCodeMunch)
1. **Find your Config File:** OpenClaw will have a configuration file where you define which tools it has access to (usually `mcp_config.json`).
2. **Add the Configuration:** Add this exact block to your config:
   ```json
   "jcodemunch": {
     "command": "proot-distro",
     "args": [
       "login",
       "debian",
       "--",
       "/root/.local/bin/uvx",
       "jcodemunch-mcp"
     ],
     "env": {}
   }
   ```
3. **Usage:** Once connected, ask your AI: "Look at the folder `/data/data/com.termux/files/home/keyboard-local` and tell me how it works."

## Phase 3: Give the AI its "Hands" (Tasker MCP)
1. You will add the `tasker-mcp-server-cli-aarch64` file to your config file just like you did with jCodeMunch.
2. The binary is located at: `~/tasker-mcp/tasker-mcp-server-cli-aarch64`