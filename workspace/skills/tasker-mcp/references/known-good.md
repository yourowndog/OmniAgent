# Known-Good Tasker MCP Reference

Source basis: `/data/data/com.termux/files/home/.openclaw/workspace/TASKER_MCP_STATUS.md`

Use this file for exact known-good facts while keeping `SKILL.md` focused on operational behavior.

## Known-good MCP entry pattern

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

## Important paths

Primary observed config in use:
- `/data/data/com.termux/files/home/.claude/mcp.json`

Secondary duplicate config:
- `/data/data/com.termux/files/home/.mcporter/mcp.json`

Tool descriptions:
- `/data/data/com.termux/files/home/projects/tasker-mcp/toolDescriptions.json`

Tasker project import:
- `/sdcard/Tasker/projects/mcp_server.prj.xml`

Smoke test script:
- `/data/data/com.termux/files/home/.openclaw/workspace/tasker-mcp-smoke-test.sh`

## Tasker-side expectations

- active HTTP Request profile/listener
- listener bound at `127.0.0.1:1821`
- API key matches MCP config
- Tasker project imported and active

## Verified working tools

Verified in prior testing:
- `tasker_flash_text`
- `tasker_set_alarm`
- `tasker_get_battery_level`
- `tasker_get_volume`

## Present in tool descriptions and likely available

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

## Historical gotchas

- The major issue was config drift across multiple MCP config files.
- Editing only one config file did not reliably fix the actual runtime.
- Earlier HTTP-mode assumptions were wrong for the working CLI setup.
- Known-good setup uses stdio and explicit Tasker connection args.
