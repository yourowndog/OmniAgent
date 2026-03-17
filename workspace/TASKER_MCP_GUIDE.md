# TASKER_MCP_GUIDE.md

_Date: 2026-03-17_

This is the guide for actually using Tasker MCP.

It is not a status report.
It is not a vague architecture note.
It is the document a future agent should be able to read, from zero, and then successfully call Tasker tools on this Android device.

This guide is opinionated because the setup was fragile, the failure modes were non-obvious, and the wrong “cleanup” would absolutely break a working system.

---

## 1. Quick Start

If you only read one section, read this one.

### What Tasker MCP is

Tasker MCP is the bridge between an agent and Android actions implemented through Tasker.

Here, the working chain is:

1. Agent or CLI sends an MCP tool call
2. `tasker-mcp-server-cli-aarch64` receives it over **stdio**
3. that CLI forwards the request to Tasker’s local HTTP listener
4. Tasker executes the action on the phone
5. result comes back through the CLI

### The one fact that matters most

The working setup uses:
- `-mode stdio` for the MCP server CLI
- Tasker listener on `127.0.0.1:1821`
- a Tasker API key passed to the CLI with `-tasker-api-key`

A lot of confusion came from mixing up:
- MCP transport mode (`stdio`)
- Tasker listener transport (HTTP on localhost:1821)

Those are not the same thing.

### Minimum needed to call a Tasker tool correctly

You need:
- the exact tool name
- the exact argument schema
- the working Tasker MCP server config
- the correct API key

For verified tools in this environment, the exact schemas are:

#### `tasker_flash_text`
- required params:
  - `text` (`string`)

#### `tasker_set_alarm`
- required params:
  - `time` (`string`, `HH:MM` 24-hour format)

#### `tasker_get_battery_level`
- required params: none

#### `tasker_get_volume`
- required params: none

---

### Exact JSON-RPC call format over stdio

This is the exact working JSON-RPC shape used to call a Tasker tool through the CLI:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "tasker_flash_text",
    "arguments": {
      "text": "Tasker MCP smoke test OK"
    }
  }
}
```

That payload is piped to the Tasker MCP CLI over stdin.

### Exact working stdio example

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"tasker_flash_text","arguments":{"text":"Tasker MCP smoke test OK"}}}' | \
/data/data/com.termux/files/home/projects/tasker-mcp/tasker-mcp-server-cli-aarch64 \
  -tools /data/data/com.termux/files/home/projects/tasker-mcp/toolDescriptions.json \
  -tasker-host 127.0.0.1 \
  -tasker-port 1821 \
  -tasker-api-key "$KEY" \
  -mode stdio
```

That is a real working pattern taken from the smoke test script.

### Exact `mcporter call` format

`mcporter` uses this call shape:

```bash
mcporter call <server>.<tool> [key=value ...]
```

For Tasker, that means:

```bash
mcporter call tasker.tasker_flash_text text='Tasker MCP guide test OK'
```

Real verified example run in this environment:

```bash
mcporter call tasker.tasker_get_battery_level
```

Returned:

```text
62
```

Real verified example run in this environment:

```bash
mcporter call tasker.tasker_flash_text text='Tasker MCP guide test OK'
```

Returned:

```text
{ content: [ { type: 'text', text: '' } ] }
```

That empty text response is normal for `tasker_flash_text`; the real effect is on-device.

### Fastest possible success path

If you are a future agent and need to prove Tasker works:

1. verify `127.0.0.1:1821` is listening
2. call `tasker_flash_text`
3. call `tasker_get_battery_level`

If both succeed, the chain is probably healthy.

---

## 2. Tool Reference

This section documents the tools that were actually verified working.

### `tasker_flash_text`

**Exact tool name**
- `tasker_flash_text`

**Purpose**
- Displays a short message on the phone using Tasker’s Flash action.

**Required params**
- `text` (`string`) — the text to show on the phone

**Example params**
```json
{
  "text": "Tasker MCP smoke test OK"
}
```

**Exact JSON-RPC example**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "tasker_flash_text",
    "arguments": {
      "text": "Tasker MCP smoke test OK"
    }
  }
}
```

**Exact mcporter example**
```bash
mcporter call tasker.tasker_flash_text text='Tasker MCP guide test OK'
```

**What it returns**
- through `mcporter`, it returned:
```text
{ content: [ { type: 'text', text: '' } ] }
```
- the important effect is visual on the phone, not the response text

**What proved it works**
- verified through direct CLI JSON-RPC
- verified through `mcporter call`
- used in the smoke test script

**Gotchas**
- success is mostly on-device, so the response payload may look unhelpful
- if you expect a rich text result, you may incorrectly think it failed when it actually worked
- this is the best first smoke test because it is visible and low-risk

---

### `tasker_set_alarm`

**Exact tool name**
- `tasker_set_alarm`

**Purpose**
- Sets an alarm on the phone.

**Required params**
- `time` (`string`) — time in 24-hour `HH:MM` format

**Exact schema that worked**
```json
{
  "time": "05:30"
}
```

This is important:
- not `hour`
- not `minute`
- not `label`
- not split fields
- the proved schema here is a single `time` string in `HH:MM`

**Exact JSON-RPC example**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "tasker_set_alarm",
    "arguments": {
      "time": "05:30"
    }
  }
}
```

**Exact mcporter example**
```bash
mcporter call tasker.tasker_set_alarm time='05:30'
```

**What it returns**
- result shape was not captured as usefully as battery level
- actual proof of success came from the alarm being set on-device

**What proved it works**
- verified through direct CLI JSON-RPC
- verified through `mcporter call`
- documented in `TASKER_MCP_STATUS.md`

**Gotchas**
- do not invent alternate schemas
- if you pass `hour`/`minute` because that feels more natural, you may break the call
- this tool has side effects, so only call it when the user explicitly asked for an alarm or when you are intentionally testing with permission

---

### `tasker_get_battery_level`

**Exact tool name**
- `tasker_get_battery_level`

**Purpose**
- Returns the current battery percentage.

**Required params**
- none

**Exact params**
```json
{}
```

**Exact JSON-RPC example**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "tasker_get_battery_level",
    "arguments": {}
  }
}
```

**Exact mcporter example**
```bash
mcporter call tasker.tasker_get_battery_level
```

**What it returns**
- a numeric battery percentage
- verified return in this environment:
```text
62
```

**What proved it works**
- verified through `mcporter call`
- previously documented as returning battery level correctly

**Gotchas**
- none significant
- this is one of the safest read-only validation tools

---

### `tasker_get_volume`

**Exact tool name**
- `tasker_get_volume`

**Purpose**
- Returns the current phone media volume level.

**Required params**
- none

**Exact params**
```json
{}
```

**Exact JSON-RPC example**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "tasker_get_volume",
    "arguments": {}
  }
}
```

**Exact mcporter example**
```bash
mcporter call tasker.tasker_get_volume
```

**What it returns**
- a numeric media volume level
- previously verified return in this setup: `11`

**What proved it works**
- verified through `mcporter call`
- documented in `TASKER_MCP_STATUS.md`

**Gotchas**
- result is media volume, not every possible Android volume stream

---

## 3. Authentication

### How the API key works

The Tasker listener expects an API key.
The MCP server CLI passes that key to Tasker using:

```bash
-tasker-api-key <key>
```

That key is part of the bridge configuration. If it is wrong, the CLI may still start, but calls into Tasker will fail.

### Where the working config lives

This was one of the most important discoveries.

The config file that `mcporter` was actually using here was:

- `~/.claude/mcp.json`

There was also a second config file present:

- `~/.mcporter/mcp.json`

That duplicate file was a trap.
Editing only `~/.mcporter/mcp.json` did **not** reliably fix the live runtime.

### Known-good Tasker MCP entry

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

### `-mode stdio` vs `-mode http` confusion

This was one of the main sources of pain.

The working model is:
- MCP CLI transport: `-mode stdio`
- Tasker listener transport: HTTP on `127.0.0.1:1821`

The wrong model was:
- trying to treat the Tasker MCP CLI itself like it should run in HTTP mode for this setup

If you forget this distinction, you can break a working configuration while trying to “fix” it.

### What happens if the API key is wrong

If the API key is wrong, expect one of these symptoms:
- tool calls fail even though the CLI binary exists
- listener may appear alive on `127.0.0.1:1821`, but actual actions do not work
- smoke test fails despite apparently correct host/port values

If calls fail and host/port look right, suspect the API key next.

---

## 4. Troubleshooting

These are the problems we actually hit, not theoretical ones.

### Problem 1: Config drift between `~/.claude/mcp.json` and `~/.mcporter/mcp.json`

**Symptom**
- changes looked correct in one file
- `mcporter` still behaved as if nothing was fixed

**Cause**
- two config files existed
- the runtime was using `~/.claude/mcp.json`
- updating only `~/.mcporter/mcp.json` did not fix the actual running config

**Solution**
1. inspect both files
2. compare the Tasker entry exactly
3. assume neither file is authoritative until proven
4. verify which one the running tool is actually importing

**Rule**
Do not casually “clean up” duplicate config files until you know which one is live.

---

### Problem 2: `-mode stdio` vs `-mode http` confusion

**Symptom**
- transport assumptions kept changing
- fixes based on the wrong mental model did not help

**Cause**
- confusion between MCP server transport and Tasker’s local listener transport

**Solution**
Remember the chain:
- MCP side: stdio
- Tasker side: HTTP on localhost:1821

Do not conflate them.

---

### Problem 3: Needing a whole-chain smoke test

A partial check was not enough.
You needed to prove the whole path worked.

**Correct whole-chain smoke test**
1. verify port `127.0.0.1:1821` is listening
2. run the Tasker MCP CLI in stdio mode
3. send a real JSON-RPC tool call
4. confirm on-device behavior

That is why `tasker_flash_text` was the right test.

---

### How to verify the Tasker HTTP listener is alive on `127.0.0.1:1821`

Use:

```bash
nc -z 127.0.0.1 1821
```

In the smoke test script, this is used as:

```bash
if nc -z 127.0.0.1 1821; then
  echo "Tasker HTTP server is listening on 127.0.0.1:1821"
else
  echo "Tasker HTTP server is NOT listening on 127.0.0.1:1821" >&2
  exit 3
fi
```

If this check fails, stop there.
The Tasker listener is not alive, and higher-level MCP calls are not the right place to debug first.

---

### How to smoke test the whole chain

Use the script inline below, or reproduce the same steps manually.

#### Smoke test logic
- validate API key was provided
- validate port `1821` is open
- send `tasker_flash_text` via JSON-RPC over stdio

If all of that works, the bridge is alive.

---

## 5. For Agent Authors

This section is for people designing or evolving agents that can use Tasker MCP.

### How to integrate Tasker MCP into an agent’s repertoire

Treat Tasker MCP as the Android-native action layer.
Use it when the user wants phone/device capabilities that are already exposed as tools.

Good default repertoire:
- `tasker_flash_text`
- `tasker_set_alarm`
- `tasker_get_battery_level`
- `tasker_get_volume`
- `tasker_set_volume`
- `tasker_get_clipboard`
- `tasker_set_clipboard`
- `tasker_toggle_wifi`

Use with context/privacy awareness:
- `tasker_get_location`

### Safe to auto-approve

These are generally safe because they are low-risk, local, or read-only:
- `tasker_flash_text`
- `tasker_get_battery_level`
- `tasker_get_volume`
- `tasker_set_volume` when user explicitly asked to change volume
- `tasker_set_alarm` when user explicitly asked to set an alarm
- `tasker_get_clipboard` / `tasker_set_clipboard` only when directly relevant to the user’s request
- `tasker_toggle_wifi` only when clearly requested

### Require explicit user consent

These should not be auto-fired casually:
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

### Why those tools require consent

Because they can:
- contact other people
- expose private information
- create unexpected external side effects
- trigger cameras, screenshots, or browsing behavior
- surprise the user in the physical world

### Opinionated rule for agents

If an action would surprise a human standing next to the phone, ask first.

---

## 6. Smoke Test Script (Inline)

This is the smoke test script from `~/.openclaw/workspace/tasker-mcp-smoke-test.sh`.

```bash
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
```

---

## Bottom line

The things that mattered were not obvious:
- the live config file was not the one you might assume
- stdio vs HTTP had to be understood correctly
- the API key mattered
- smoke testing the whole chain was essential
- the exact schema for working tools mattered more than intuition

If you are a future agent, do not “improve” this setup from theory.
Use the exact working patterns first.
Prove the chain is alive.
Then make changes carefully.
