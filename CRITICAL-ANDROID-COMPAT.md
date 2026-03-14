# CRITICAL: Android/Termux Compatibility Architecture

**READ THIS FIRST** if anything breaks, crashes, or fails to install.

---

## The Core Trick: Two Nodes, One Phone

This device has TWO Node.js installations:

| | Glibc Node (THE ONE WE USE) | Termux Native Node (DO NOT USE FOR OPENCLAW) |
|---|---|---|
| Path | `~/.openclaw-android/node/bin/node` | `/data/data/com.termux/files/usr/bin/node` |
| Version | v22 | v25 |
| `process.platform` | `linux` | `android` |
| npm installs | Work normally | EBADPLATFORM errors |
| Why it works | Uses glibc (standard Linux C library) via `ld-linux-aarch64.so.1` | Uses Termux's bionic/musl |

**OpenClaw MUST run on the glibc node.** This is set via PATH priority in `~/.bashrc` line 195:
```bash
export PATH="$HOME/.openclaw-android/node/bin:$HOME/.local/bin:$PATH"
```

This only loads for **interactive shells** (tmux, terminal). Claude Code's non-interactive shell will see the Termux node — that's fine, it doesn't affect OpenClaw.

---

## The Compat Shim: `~/.openclaw-android/patches/glibc-compat.js`

Loaded automatically via `--require` by the node wrapper script. Patches:

1. **`process.execPath`** — Points to the wrapper instead of `ld.so`
2. **`os.cpus()`** — Returns fake CPU when SELinux blocks `/proc/stat`
3. **`os.networkInterfaces()`** — Try/catch wrapper for EACCES
4. **`child_process.exec/execSync`** — Redirects shell to Termux's `/data/data/.../usr/bin/sh`
5. **`child_process.spawn/spawnSync`** — Same shell redirect (critical for MCP server launching)

---

## Environment Variables (in `~/.bashrc`)

```bash
export npm_config_os=linux    # Prevents EBADPLATFORM during npm install
export OA_GLIBC=1             # Flag indicating glibc mode
export CONTAINER=1            # Some tools check this
export OPENCLAW_NO_RESPAWN=1  # Prevents restart loops
```

---

## What Works vs. What Doesn't on Android

### WILL WORK (go for it):
- Pure JavaScript npm packages (any of them)
- Python MCP servers (via Termux python or proot uv/uvx)
- Cloud API clients (OpenAI, Anthropic, Pinecone, Firebase, etc.)
- Native compiled binaries (like tasker-mcp aarch64)
- MCP servers via stdio protocol
- npm packages with pre-built linux-arm64 binaries
- LanceDB, SQLite, and most database drivers

### MIGHT WORK (try it, but may need manual dep fixing):
- Packages with C++ native addons (gyp builds) — may need deps manually copied
- Image processing (sharp) — needs pre-built binaries
- WASM packages — case by case
- Anything that downloads platform-specific binaries at install time

### WILL NOT WORK (don't waste time):
- Docker / containers / systemd services
- GUI applications (no display server)
- Kernel modules / eBPF
- Anything requiring root / elevated privileges
- Packages that compile against specific Linux kernel headers
- Automated browser login (headless chromium can't do Google OAuth interactively)

---

## Common Fixes

### "EBADPLATFORM" during npm install
Already handled by `npm_config_os=linux`. If it still happens, run:
```bash
npm install --os=linux <package>
```

### "Bad interpreter" / shebang errors
Run: `termux-fix-shebang <script_path>`

### MCP server "Connection closed"
Check that the command path is absolute and the binary/script exists. Test manually:
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | <command> <args>
```

### Native module crashes (MODULE_NOT_FOUND for .node files)
The glibc node loads native modules via its own `ld.so`. If a native module was compiled for Termux's toolchain, it may need its dependencies manually copied into the package directory. Gemini did this for LanceDB (flatbuffers, reflect-metadata, apache-arrow).

### NotebookLM auth expired
1. Open Kiwi browser → cookie extension → export .google.com cookies as JSON to `~/cookies.txt`
2. Run `nlm-refresh` (alias in .bashrc)

---

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│  Samsung Galaxy S25 Ultra (Android 15)  │
│  Kernel: Linux 6.6.77                   │
├─────────────────────────────────────────┤
│  Termux (native, no root)               │
│  ├── Termux Node v25 (platform=android) │ ← Claude Code uses this (fine)
│  ├── Glibc Node v22 (platform=linux)    │ ← OpenClaw uses this (critical)
│  │   ├── ld-linux-aarch64.so.1          │
│  │   ├── node.real (glibc-linked)       │
│  │   ├── node (wrapper script)          │
│  │   └── glibc-compat.js (shims)        │
│  ├── proot-distro (Debian)              │ ← jcodemunch runs here
│  └── Python 3.13 (uv tools)            │ ← notebooklm-mcp runs here
├─────────────────────────────────────────┤
│  OpenClaw Gateway (ws://127.0.0.1:18789)│
│  ├── memory-lancedb (OpenAI embeddings) │
│  ├── mcporter (MCP bridge)              │
│  └── 7 MCP servers (all healthy)        │
└─────────────────────────────────────────┘
```

---

**Last updated:** 2026-03-13
**Authors:** Claude (Opus 4.6) + Gemini (3.1 Flash), coordinated via `~/agent-comms/`
