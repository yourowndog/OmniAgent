---
name: tasker-mcp
description: Use Tasker MCP to perform Android-native actions through the Tasker bridge: alarms, flash text, battery/volume queries, clipboard, Wi‑Fi, location, and other Tasker-exposed tools. Use when an agent needs to actually call Tasker tools correctly, validate the bridge, map user intent into Tasker MCP tool calls, or debug Tasker MCP config drift. Do not use for plain workspace file operations or when a simpler native path is already known-good.
---

# Tasker MCP

Use this skill to **operate** Tasker MCP, not merely describe it.

## Core workflow

1. Decide whether Tasker MCP is the right path.
2. Identify the exact exposed Tasker tool name.
3. Confirm the expected argument schema before calling if uncertain.
4. For uncertain bridge health, validate with `tasker_flash_text` first.
5. Perform the requested action with the smallest correct payload.
6. Report the concrete outcome plainly.

## Prefer Tasker MCP for

Use Tasker MCP when the action is Android-native and already exposed by Tasker, especially:
- alarms
- flash text / on-device confirmations
- battery queries
- volume read/set
- clipboard get/set
- Wi‑Fi toggle
- location queries

## Do not default to Tasker MCP for

Avoid Tasker MCP when:
- normal workspace files/tools are sufficient
- a simpler known-good path already exists
- the action is sensitive and the user has not clearly asked for it
- Tasker exposure exists but adds unnecessary risk or complexity

Prefer non-Tasker paths for redundant cases like flashlight control when a better local path is already known-good.

## Exact-name rule

Use the exact exposed tool name.
Do not invent near-matches.
Examples:
- `tasker_flash_text`
- `tasker_set_alarm`
- `tasker_get_battery_level`
- `tasker_get_volume`

If uncertain, inspect/list the available Tasker tools first.

## Argument-shape rule

Pass the exact field names the tool expects.
Do not guess.
Do not improvise positional arguments.
Do not assume all Tasker tools use the same parameter names.

If you are uncertain about the schema:
1. inspect the tool definition
2. confirm the argument names
3. send the minimum valid payload

## Best first health check

When the bridge may be unhealthy, start with:
- `tasker_flash_text`

Why:
- low risk
- visible success condition
- fast to verify

Then optionally confirm with read-only tools like:
- `tasker_get_battery_level`
- `tasker_get_volume`

## Safe default tools

Treat these as the default starter set:
- `tasker_flash_text`
- `tasker_set_alarm`
- `tasker_get_battery_level`
- `tasker_get_volume`
- `tasker_set_volume`
- `tasker_get_clipboard`
- `tasker_set_clipboard`
- `tasker_toggle_wifi`

Use `tasker_get_location` with privacy awareness.

## Consent-required tools

Ask first before using:
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

Reason: privacy risk, external side effects, or surprise cost.

## Minimal call patterns

These are logical examples. Follow the real schema exposed by the installed tool definitions.

### Flash text
```json
{
  "tool": "tasker_flash_text",
  "arguments": {
    "text": "Tasker MCP is alive"
  }
}
```

### Read-only query
```json
{
  "tool": "tasker_get_battery_level",
  "arguments": {}
}
```

### Set a device value
```json
{
  "tool": "tasker_set_volume",
  "arguments": {
    "level": 5
  }
}
```

### Alarm
```json
{
  "tool": "tasker_set_alarm",
  "arguments": {
    "time": "05:30"
  }
}
```

If the actual tool expects `hour`/`minute` or other fields, use those exact names instead.

## Result-handling rule

After each call:
- report success conservatively
- state what definitely happened
- if the result is ambiguous, say so

Good:
- “Battery is 47%.”
- “I set an alarm for 5:30 AM.”
- “The bridge responded, but the result payload was ambiguous.”

Bad:
- claiming success without evidence
- overstating what changed on the device

## Config-drift warning

The biggest historical failure mode was **config drift**, not Tasker itself.

Known drift-prone files:
- `~/.claude/mcp.json`
- `~/.mcporter/mcp.json`

Operational rule:
- if Tasker MCP unexpectedly fails, inspect both files before assuming Tasker is broken
- compare command path, args, host, port, API key, and mode

## Known-good transport pattern

Current known-good pattern uses:
- Tasker CLI server in **stdio** mode
- Tasker listener on `127.0.0.1:1821`

Do not casually replace the known-good transport/config model with a cleaner-sounding one unless you are deliberately revalidating the entire chain.

## Failure triage order

When calls start failing:
1. inspect both MCP config files
2. verify exact Tasker entry matches known-good settings
3. verify Tasker listener/profile is still active
4. verify tool descriptions file still exists and matches expectations
5. run a visible smoke test with `tasker_flash_text`

## Minimal checklist before every Tasker call

1. Is Tasker MCP the right path?
2. Do I have the exact tool name?
3. Do I know the exact argument schema?
4. Does this action require explicit consent?
5. Can I verify success clearly afterward?

If not, inspect first.

## Read this reference when needed

For known-good config details, tool inventory, and historical debugging facts, read:
- `references/known-good.md`
