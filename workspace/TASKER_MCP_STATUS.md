# Tasker MCP Status

_Date: 2026-03-17_

## Executive Summary

Tasker MCP is now working.

The root issue was **config drift across two MCP config locations** plus an earlier incorrect transport assumption:

- `~/.claude/mcp.json` was the file actually being used by `mcporter`
- `~/.mcporter/mcp.json` was also present, but patching only that file did **not** fix `mcporter`
- Earlier broken config used `-mode http` / `TASKER_HTTP_PORT`, which is wrong for this Tasker MCP CLI
- Correct setup uses **stdio** and passes Tasker connection info as CLI args

## Current Known-Good Config

### Primary path actually used by mcporter
`/data/data/com.termux/files/home/.claude/mcp.json`

### Secondary/duplicate path
`/data/data/com.termux/files/home/.mcporter/mcp.json`

### Working Tasker entry
```json
{
  "tasker": {
    "command": "/data/data/com.termux/files/home/projects/tasker-mcp/tasker-mcp-server-cli-aarch64",
    "args": [
      "-tools",
      "/data/data/com.termux/files/home/projects/tasker-mcp/toolDescriptions.json",
      "-tasker-host",
      "127.0.0.1",
      "-tasker-port",
      "1821",
      "-tasker-api-key",
      "tk_…",
      "-mode",
      "stdio"
    ],
    "env": {}
  }
}
```

## Tasker-Side Status

Official import file staged here:
- `/sdcard/Tasker/projects/mcp_server.prj.xml`

Tasker HTTP Request profile is active and listening on:
- `127.0.0.1:1821`

API key was generated and configured.

## Verified Working Tasks

These have been actually exercised successfully:

1. **tasker_flash_text**
   - Verified through direct CLI JSON-RPC
   - Verified through `mcporter call`

2. **tasker_set_alarm**
   - Verified through direct CLI JSON-RPC
   - Verified through `mcporter call`

3. **tasker_get_battery_level**
   - Verified through `mcporter call`
   - Returned: `47`

4. **tasker_get_volume**
   - Verified through `mcporter call`
   - Returned: `11`

## Exposed by Tasker MCP but Not Yet Individually Verified

These are present in the current `toolDescriptions.json` and should be available, but were not individually exercised in this session:

- `tasker_browse_url`
- `tasker_call_number`
- `tasker_create_task`
- `tasker_get_clipboard`
- `tasker_get_contacts`
- `tasker_get_location`
- `tasker_lamp_off`
- `tasker_lamp_on`
- `tasker_list_files`
- `tasker_play_music`
- `tasker_print`
- `tasker_say`
- `tasker_screenshot`
- `tasker_send_sms`
- `tasker_set_clipboard`
- `tasker_set_volume`
- `tasker_take_photo`
- `tasker_toggle_flashlight`
- `tasker_toggle_wifi`

## Suggested Repertoire Policy

### Safe to keep in normal repertoire
These are low-risk / easy-to-verify:
- `tasker_flash_text`
- `tasker_set_alarm`
- `tasker_get_battery_level`
- `tasker_get_volume`
- `tasker_get_clipboard`
- `tasker_get_location` (with awareness of privacy)
- `tasker_set_clipboard`
- `tasker_set_volume`
- `tasker_toggle_wifi`

### Available but should be treated as explicit-consent actions
These can have stronger side effects or privacy implications:
- `tasker_call_number`
- `tasker_send_sms`
- `tasker_take_photo`
- `tasker_screenshot`
- `tasker_browse_url`
- `tasker_play_music`
- `tasker_print`
- `tasker_create_task`
- `tasker_say`
- `tasker_get_contacts`

### Probably omit from default repertoire for now
Not because they are broken, but because they are redundant, custom, or environment-specific:
- `tasker_toggle_flashlight` — prefer Termux API for flashlight where possible
- `tasker_lamp_on`
- `tasker_lamp_off`
- `tasker_list_files` (until expected scope/path behavior is verified)

## Likely Ongoing Issue: Config Drift

The biggest continuing risk is not Tasker itself — it is **MCP config drift**.

### Why this matters
If another agent or sync step updates only one file, the system can silently regress.

### Drift-prone files
- `~/.claude/mcp.json`
- `~/.mcporter/mcp.json`

### Recommendation
Pick a single source of truth and either:
1. delete/retire the duplicate after confirming nothing depends on it, or
2. maintain a small sync script that updates both files together

## Re-parse Recommendation

Because the user noted that MCP-related files are changing and being synchronized across folders, re-parse/check these after any major MCP sync or agent automation pass:

- `~/.claude/mcp.json`
- `~/.mcporter/mcp.json`
- `/data/data/com.termux/files/home/projects/tasker-mcp/toolDescriptions.json`
- `/sdcard/Tasker/projects/mcp_server.prj.xml`

## Handy Smoke Test

Script created here:
- `/data/data/com.termux/files/home/.openclaw/workspace/tasker-mcp-smoke-test.sh`

Purpose:
- checks `127.0.0.1:1821`
- sends `tasker_flash_text`
- quickly proves the bridge is alive

## Bottom Line

Tasker MCP is functioning.

The remaining maintenance concern is **which config file is authoritative** and whether future sync operations will overwrite the working Tasker entry.
