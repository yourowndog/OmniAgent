# OmniAgent — Claude Context

## What This Project Is
OmniAgent is Sam's personal autonomous AI agent built to run on a Galaxy S25 Ultra via Termux.
The goal: replace dumb voice assistants with a bespoke, context-aware agent that understands
Sam's actual life — concrete plant work schedules (callouts), SMS workflows, navigation, and
personal preferences.

**Status: Active — Gateway running, memory working, MCP servers connected.**

---

## CRITICAL: Read Before Doing Anything

**Read `CRITICAL-ANDROID-COMPAT.md` in this directory.** It explains the two-node architecture,
what works on Android, what doesn't, and how to debug crashes. This will save you hours.

**TL;DR:** OpenClaw runs on glibc Node v22 which reports `platform=linux`. This is intentional.
Claude Code sees Termux native Node v25 (`platform=android`). Don't try to "fix" this mismatch.

---

## The Stack

| Layer | Tool | Notes |
|---|---|---|
| Voice Input | Whisper API | High-fidelity transcription |
| Reasoning | Gemini 3 Flash API | Primary model (`google/gemini-3-flash-preview`) |
| Local Models | LLM (.gguf in ~/models/) | Fallback / offline reasoning |
| Device Control | Tasker MCP | SMS, alarms, app launching, hardware |
| Code Intelligence | jCodeMunch MCP | Indexes local repos for AI context |
| Memory | LanceDB + OpenAI embeddings | `text-embedding-3-small`, NOT gemini embeddings |
| Agent Platform | **OpenClaw** | The glue — runs the AI agent as a persistent service |

---

## OpenClaw — The Core Platform

OpenClaw runs **natively in Termux** (NOT proot anymore, switched 2026-03-12 via AidanPark installer).

### How to Boot OpenClaw

```
1. claw          → create/attach tmux session named "claw"
2. start-claw    → launches gateway in window 0, TUI in window 1
```

That's it. No proot needed.

### OpenClaw Quick Commands
```
start-claw       — Start OpenClaw gateway + TUI via tmux
openclaw tui     — Open terminal user interface
openclaw config  — Configuration
openclaw doctor  — Health checks
update-openclaw  — Update to latest version
```

### OpenClaw Config
- File: `~/projects/OmniAgent/openclaw.json` (symlinked at `~/.openclaw/openclaw.json`)
- Gateway port: `18789` (loopback only, token auth)
- Primary model: `google/gemini-3-flash-preview`
- Memory: `memory-core` plugin (file-backed) with OpenAI `text-embedding-3-small` embeddings
  - LanceDB is broken on Android (Rust `renameat2` Permission Denied). Config preserved but disabled.
- Browser: headless chromium at `/data/data/com.termux/files/usr/bin/chromium-browser`

### Node.js Architecture (IMPORTANT)
- OpenClaw uses **glibc Node v22** (`~/.openclaw-android/node/bin/node`)
- NOT Termux native Node v25 — glibc node reports `platform=linux`
- Compat shim: `~/.openclaw-android/patches/glibc-compat.js`
- PATH priority set in `~/.bashrc` (interactive shells only)
- `npm_config_os=linux` prevents EBADPLATFORM errors

### MCP Servers (via mcporter)
All configured in `~/.claude.json` and `~/.gemini/settings.json`:
- `tasker` — 23 tools, native aarch64 binary
- `notebooklm-mcp` — 32 tools, Python via uv
- `github-mcp-server` — 26 tools, via npx
- `firebase-mcp-server` — 16 tools, via npx
- `pinecone-mcp-server` — 9 tools, via npx
- `sequential-thinking` — 1 tool, via node
- `brave-search` — 2 tools
- `jcodemunch` — via proot-distro (offline in mcporter, works in Claude Code)

---

## Existing Code

### alarm_parser.py
Early prototype for the "Alarms via Callout Logic" goal.
- Scans recent SMS for "all drivers" callout messages (work schedule texts)
- Parses the callout time via regex
- Calculates 3 alarm times: T-120min, T-135min, T-150min before callout
- Currently only **prints** alarm times — does not actually set alarms yet

---

## Phase 1 Goals (MVP)
- [ ] Voice trigger: "Hey Omni, set my alarms" → scan SMS → set 3 alarms via Tasker
- [ ] Voice navigation: "Take me to the Bonham plant" → open Google Maps to saved location
- [ ] Notification summary: read + triage unread notifications
- [ ] Voice-to-SMS: transcribe reply → confirm → send

## Phase 2–4 Goals
See GOALS.md for full roadmap.

---

## Key File Paths
- Project: `~/projects/OmniAgent/` (symlinked at `~/.openclaw/`)
- OpenClaw config: `~/projects/OmniAgent/openclaw.json`
- Compat docs: `~/projects/OmniAgent/CRITICAL-ANDROID-COMPAT.md`
- Compat shim: `~/.openclaw-android/patches/glibc-compat.js`
- Agent comms: `~/agent-comms/` (Claude <-> Gemini collaboration docs)
- Tasker MCP binary: `~/projects/tasker-mcp/tasker-mcp-server-cli-aarch64`
- LLM weights: `~/models/`
- NotebookLM auth: `~/.notebooklm-mcp-cli/profiles/default/`
