# Tasker MCP Skill Guide

_Date: 2026-03-17_

This file is a **how-to-use-it guide** for Tasker MCP.
It is written for agents: Soma, Claude Code, Codex, Gemini, and future OpenClaw workers.

This is **not** primarily a status/history doc. It explains:
- what Tasker MCP is for
- when to use it
- how to use it safely
- which actions are good defaults
- which actions require explicit consent
- how to sanity-check the bridge before trusting it
- how to recover when it stops working

---

## 1. What Tasker MCP Is

Tasker MCP is the bridge between the agent and Android device actions exposed through Tasker.

It lets an agent call Android-side automations and phone capabilities through MCP tools instead of trying to improvise shell hacks.

Use Tasker MCP when the task involves:
- alarms
- notifications / flash text
- device state reads
- phone features
- clipboard
- volume
- Wi‑Fi
- location
- other Tasker-managed actions

Think of it as the **Android action bus**.

---

## 2. When To Prefer Tasker MCP

Prefer Tasker MCP when:
- the action is already exposed as a Tasker MCP tool
- the action is phone-native and Tasker is the cleanest path
- the action needs Android permissions that shell scripts do not reliably have
- the user wants automations that should later be reproducible on another OpenClaw phone/device

Examples:
- “Set an alarm for 5:30 AM” → use `tasker_set_alarm`
- “Show a message on my phone” → use `tasker_flash_text`
- “What’s my battery level?” → use `tasker_get_battery_level`
- “Turn volume down” → use `tasker_set_volume`

---

## 3. When NOT To Prefer Tasker MCP

Do **not** default to Tasker MCP when another path is simpler, safer, or already known-good.

Examples:
- Flashlight control: prefer Termux API if that path is already more direct/reliable
- Pure file operations in the workspace: use normal file tools, not Tasker
- Messaging external people: ask first; Tasker capability does not override consent rules
- Anything destructive or privacy-sensitive without clear user intent

If a Tasker tool exists but the action is:
- privacy-sensitive
- externally visible
- costly to reverse
- or likely to surprise the user

…get explicit consent first.

---

## 4. Known-Good Mental Model

There are **three layers** to keep straight:

1. **Tasker on Android**
   - holds the actual profiles/tasks
   - listens for requests

2. **Tasker MCP server CLI**
   - translates MCP tool calls into Tasker requests

3. **OpenClaw / mcporter / agents**
   - call the MCP tools

If something fails, the problem is usually one of these:
- Tasker-side listener/profile not active
- wrong MCP config file edited
- wrong CLI args / wrong transport mode
- stale or drifted config across multiple files

---

## 5. The Big Gotcha: Config Drift

The most important operational lesson:

**Tasker MCP can appear broken even when Tasker itself is fine, because the wrong MCP config file was edited.**

Known drift-prone files:
- `~/.claude/mcp.json`
- `~/.mcporter/mcp.json`

Observed reality:
- `mcporter` was using `~/.claude/mcp.json`
- updating only `~/.mcporter/mcp.json` was not enough

### Agent rule
Whenever Tasker MCP breaks unexpectedly:
1. inspect both files
2. compare the Tasker entry in both
3. do not assume the file you edited is the file in use

---

## 6. Known-Good Configuration Pattern

Current working pattern uses **stdio**, not HTTP mode.

### Working Tasker MCP entry
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

### Important
Older/broken assumptions used HTTP mode incorrectly.
Do not casually switch transport unless you are deliberately revalidating the whole chain.

---

## 7. Tasker-Side Expectations

The Android side should have:
- imported Tasker project
- active HTTP Request profile/listener
- host/port matching the MCP config
- matching API key

Known project path:
- `/sdcard/Tasker/projects/mcp_server.prj.xml`

Known listener endpoint:
- `127.0.0.1:1821`

If tools stop responding, verify Tasker-side assumptions before doing deeper surgery.

---

## 8. Safe Default Workflow For Agents

When using Tasker MCP, follow this order.

### Step 1: Classify the action
Ask:
- Is this read-only?
- Is this local but visible?
- Is this privacy-sensitive?
- Is this external/irreversible?

### Step 2: Decide consent level
- **No extra consent needed:** battery, volume read, flash text test, clipboard set/get if user asked, alarm creation if user explicitly requested it
- **Ask first:** SMS, phone calls, contacts, camera, screenshots, location in ambiguous contexts, browsing URLs, creating new Tasker tasks silently

### Step 3: Run a small smoke test if bridge health is uncertain
Best smoke test:
- `tasker_flash_text`

Why:
- fast
- visible
- low risk
- easy to verify

### Step 4: Perform the requested action
Once the bridge is confirmed alive, do the actual operation.

### Step 5: Report outcome clearly
Say what happened in concrete terms.
Example:
- “Alarm set for 5:30 AM.”
- “Battery level is 47%.”
- “I flashed a confirmation message on the device.”

---

## 9. Best First Tools To Reach For

These are the best tools to treat as the normal Tasker MCP starter set.

### Low-risk / high-utility
- `tasker_flash_text`
- `tasker_set_alarm`
- `tasker_get_battery_level`
- `tasker_get_volume`
- `tasker_set_volume`
- `tasker_get_clipboard`
- `tasker_set_clipboard`
- `tasker_toggle_wifi`

### Use with privacy/context awareness
- `tasker_get_location`

These are good because they are:
- easy to understand
- easy to verify
- useful in daily automation
- less likely to surprise the user

---

## 10. Tools Requiring Explicit User Consent

Do not casually invoke these.

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

Reason:
- privacy risk
- social/external side effects
- physical-world side effects
- user surprise cost

### Consent rule
If the user did not clearly ask for the specific effect, ask first.

---

## 11. Tools To De-Prioritize

These are not necessarily broken. They are just not ideal as default choices.

- `tasker_toggle_flashlight`
  - prefer Termux API path when available
- `tasker_lamp_on`
- `tasker_lamp_off`
  - custom/redundant compared to clearer alternatives
- `tasker_list_files`
  - path/scope expectations should be verified before normal use

---

## 12. How To Actually Call Tasker Tools Correctly

This section is the practical core.
An agent should be able to read this and make correct Tasker MCP calls.

### Rule 1: Discover before assuming
If tool availability or parameter shape is uncertain:
- list the available MCP tools first
- inspect the exact tool name
- inspect the expected arguments

Do not rely on memory alone if there is any uncertainty.

### Rule 2: Use the exact exposed tool name
Tasker tools are exposed with names like:
- `tasker_flash_text`
- `tasker_set_alarm`
- `tasker_get_battery_level`

Do not invent near-matches.
Do not rename them mentally.
Use the exact tool identifier exposed by the server.

### Rule 3: Match argument names exactly
When calling a Tasker tool, pass the argument object using the names the tool expects.

Examples of the kind of mistakes to avoid:
- using `message` when the tool expects `text`
- using `time` when the tool expects separate alarm fields
- using positional arguments instead of named fields

If you are not certain of the schema, inspect it first.

### Rule 4: Start with a low-risk visible tool when validating the bridge
Preferred first validation call:
- `tasker_flash_text`

Reason:
- obvious success condition
- minimal risk
- easy to verify

### Rule 5: Convert user intent into the smallest correct call
Do not pass extra fields unless they are supported and useful.
Prefer the minimum valid payload.

---

### Typical call flow through MCP clients

The exact client wrapper may vary, but the logical flow is:

1. connect to the `tasker` MCP server
2. list tools if needed
3. choose the exact tool
4. send a named-argument payload
5. inspect the returned success/error
6. tell the user what concretely happened

---

### Pattern A: Flash text
Use when:
- proving the bridge is alive
- showing a short on-device confirmation

Logical call shape:
```json
{
  "tool": "tasker_flash_text",
  "arguments": {
    "text": "Tasker MCP is alive"
  }
}
```

If the tool schema uses a different field name, follow the schema, not this example. The point is:
- short text
- visible confirmation
- low-risk payload

---

### Pattern B: Set an alarm
Use when:
- the user explicitly asks for an alarm

Logical call shape:
```json
{
  "tool": "tasker_set_alarm",
  "arguments": {
    "time": "05:30"
  }
}
```

If the actual schema expects split fields such as hour/minute/label, use those exact names instead.

Agent rule:
- normalize the user request first
- then map it into the exact schema expected by the tool

---

### Pattern C: Read-only query
Example: battery level

Logical call shape:
```json
{
  "tool": "tasker_get_battery_level",
  "arguments": {}
}
```

Read-only tools often take no arguments.
Do not invent empty strings or placeholder values if none are required.

---

### Pattern D: Set a device value
Example: volume

Logical call shape:
```json
{
  "tool": "tasker_set_volume",
  "arguments": {
    "level": 5
  }
}
```

Before calling:
- make sure the requested value is sensible
- clamp or clarify impossible values
- avoid passing strings where numeric fields are expected

---

### Pattern E: Consent-gated actions
Example: SMS

Logical call shape:
```json
{
  "tool": "tasker_send_sms",
  "arguments": {
    "number": "+15551234567",
    "message": "Running late"
  }
}
```

Only do this after explicit user approval.
For socially or externally visible actions, do not infer consent from vague wording.

---

### If using mcporter manually
When interacting through `mcporter`, the safe pattern is:
1. list tools on the `tasker` server
2. inspect or confirm the tool name
3. call the tool with a JSON argument object

Conceptually:
```bash
mcporter tools list tasker
mcporter call tasker <exact_tool_name> '<json arguments>'
```

Use the real local syntax supported by the installed mcporter version.
Do not guess field names if the tool listing can tell you.

---

### Argument hygiene rules
Always:
- send named JSON arguments
- use the exact expected field names
- preserve data types correctly
- keep payloads minimal
- avoid speculative optional fields

Never:
- pass freeform prose when structured fields are expected
- assume all Tasker tools use the same parameter names
- keep retrying random payload shapes after repeated failures

---

### Return-handling rules
After a call:
- interpret success conservatively
- if the tool returns a value, report it directly
- if the tool performs an action, state the action plainly
- if the result is ambiguous, say it is ambiguous

Good:
- “Battery is 47%.”
- “I set the alarm for 5:30 AM.”
- “The Tasker bridge responded, but the result payload was unclear.”

Bad:
- pretending success when the tool only acknowledged receipt
- overstating what happened on the device

---

### Minimal agent checklist before every Tasker call
1. Is Tasker MCP the right path for this action?
2. Is the tool name exact?
3. Do I know the exact argument schema?
4. Does this action require explicit consent?
5. Can I verify success clearly afterward?

If any of these are uncertain, slow down and inspect first.

---

## 13. Example Agent Behaviors

### Example A: Set an alarm
User: “Set an alarm for 5:30 AM.”

Agent behavior:
1. Use Tasker MCP
2. Call `tasker_set_alarm`
3. Confirm the result plainly

Good reply:
- “Done — I set an alarm for 5:30 AM.”

### Example B: Check battery
User: “How much battery do I have?”

Agent behavior:
1. Call `tasker_get_battery_level`
2. Return the value directly

Good reply:
- “Battery is at 47%.”

### Example C: Test whether Tasker MCP is alive
User: “Is Tasker working?”

Agent behavior:
1. If user is okay with a visible test, use `tasker_flash_text`
2. Optionally also query battery or volume
3. Report whether the bridge appears alive

Good reply:
- “Yes — I successfully flashed a message on the phone, so the Tasker MCP bridge is responding.”

### Example D: Sensitive action
User: “Text somebody for me.”

Agent behavior:
1. Ask who, what message, and confirm intent
2. Only then consider `tasker_send_sms`

---

## 13. Recommended Smoke Test Procedure

If the bridge might be broken, do this in order.

### Minimal smoke test
1. verify config entry exists
2. verify host/port/api key are present
3. use `tasker_flash_text`

### Slightly stronger smoke test
1. `tasker_flash_text`
2. `tasker_get_battery_level`
3. `tasker_get_volume`

If all three succeed, the bridge is very likely healthy.

Known helper script:
- `/data/data/com.termux/files/home/.openclaw/workspace/tasker-mcp-smoke-test.sh`

Use it when shell-level validation is appropriate.

---

## 14. Failure Diagnosis Playbook

When Tasker MCP fails, check in this order.

### A. Is this config drift?
Compare:
- `~/.claude/mcp.json`
- `~/.mcporter/mcp.json`

Look for mismatches in:
- command path
- toolDescriptions path
- host
- port
- API key
- mode

### B. Is Tasker listener alive?
Check whether Tasker is still listening on:
- `127.0.0.1:1821`

### C. Was the Tasker project/profile disabled?
Confirm the imported Tasker project is still active.

### D. Did someone revert transport assumptions?
If you see HTTP-mode assumptions reintroduced, suspect regression.

### E. Did the tool description file move or change?
Check:
- `/data/data/com.termux/files/home/projects/tasker-mcp/toolDescriptions.json`

---

## 15. What To Tell Future Agents Explicitly

If you are a future agent reading this, remember:

1. **Do not assume Tasker MCP is broken just because one config file looks wrong.**
2. **Check both MCP config locations.**
3. **Prefer stdio mode unless you are intentionally reworking transport.**
4. **Use `tasker_flash_text` as the first health check.**
5. **Treat SMS/calls/camera/contacts as consent-required.**
6. **Do not “clean up” duplicate config files without confirming which one is actually used.**
7. **Do not silently replace known-good settings with theoretically cleaner ones.**

The system has already demonstrated that a “tidier” config can still be the wrong config.

---

## 16. Suggested Prompting Pattern For Agents

When deciding whether to use Tasker MCP, think:

> Is this an Android-native action already exposed as a Tasker tool, and is Tasker the most reliable bridge for it?

If yes, use Tasker MCP.

Before side-effectful actions, think:

> Would this surprise the user if it fired right now?

If yes, ask first.

When debugging, think:

> Is this actually a Tasker problem, or did config drift make the MCP layer lie to me?

---

## 17. Current Tool List Snapshot

Verified working in prior testing:
- `tasker_flash_text`
- `tasker_set_alarm`
- `tasker_get_battery_level`
- `tasker_get_volume`

Present in tool descriptions and likely available:
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

Treat this list as a starting point, not a guarantee. Use smoke tests and judgment.

---

## 18. Related Files

Use these as companion docs/source-of-truth references:
- `/data/data/com.termux/files/home/.openclaw/workspace/TASKER_MCP_STATUS.md`
- `/data/data/com.termux/files/home/.openclaw/workspace/tasker-mcp-smoke-test.sh`
- `/data/data/com.termux/files/home/projects/tasker-mcp/toolDescriptions.json`
- `/sdcard/Tasker/projects/mcp_server.prj.xml`
- `~/.claude/mcp.json`
- `~/.mcporter/mcp.json`

---

## 19. Bottom Line

Tasker MCP is not just “working.”
It is now a practical control surface for Android automation.

The correct way to use it is:
- prefer it for Android-native actions
- start with low-risk tools
- ask before sensitive actions
- smoke-test with `tasker_flash_text`
- suspect config drift early
- preserve known-good configs carefully

If future agents follow this file, they should be able to **use** Tasker MCP, not merely admire the fact that it once worked.
