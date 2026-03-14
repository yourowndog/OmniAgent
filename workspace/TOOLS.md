# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

---

## !!! DO NOT TOUCH THESE THINGS !!!

1. **DO NOT enable `memory-lancedb`** — it is broken on Android (Rust `renameat2` Permission Denied).
2. **DO NOT switch embeddings to OpenAI** — we use Gemini `gemini-embedding-001` (free).
3. **DO NOT change the memory slot** without Sam's approval. Current: `openclaw-mem0`. Fallback: `memory-core`.
4. **Changing memory plugins triggers a gateway restart** — this is normal, not a crash.

_Last updated: 2026-03-13 after agent crashed the gateway by reverting all three._

---

## CRITICAL: Your Body Runs on Android (Read This First)

You live on a **Samsung Galaxy S25 Ultra** running native Termux on Android 15. This matters
because software thinks you're on a Linux computer, but you're not. Here's the deal:

### The Disguise (Two Nodes)
Your Node.js engine is a **glibc-wrapped Node v22** that tells software "I'm Linux."
This is intentional — without it, most npm packages and plugins refuse to install.

- **Your node:** `~/.openclaw-android/node/bin/node` (reports `platform=linux`)
- **The other node:** `/data/data/com.termux/files/usr/bin/node` (reports `platform=android`)
- **You use the first one.** The disguise. Always.
- **Compat shim:** `~/.openclaw-android/patches/glibc-compat.js` patches spawn, exec, os.cpus, etc.
- **`npm_config_os=linux`** is set in `.bashrc` to prevent install failures.

### What You Can Install/Use (and What You Can't)

**GO FOR IT:**
- Pure JavaScript npm packages (anything)
- Cloud APIs (OpenAI, Pinecone, Firebase, etc.)
- MCP servers via stdio
- Python tools (via Termux python or proot)
- Pre-built linux-arm64 binaries

**TRY IT (may need manual dep fixing):**
- C++ native addons (gyp builds)
- Image processing (sharp)
- Database drivers with native code (LanceDB, better-sqlite3)
- WASM packages

**DON'T WASTE TIME:**
- Docker / containers / systemd
- GUI applications
- Kernel modules / root-required tools
- Anything needing specific Linux kernel headers

### If Something Crashes
1. Check if it's a native module issue (MODULE_NOT_FOUND for .node files)
2. Check the gateway logs: `tail $PREFIX/tmp/openclaw-*/openclaw-*.log`
3. Full troubleshooting guide: `~/projects/OmniAgent/CRITICAL-ANDROID-COMPAT.md`

---

## Memory System
- **Plugin:** `openclaw-mem0` (Mem0 cloud API — installed and working as of 2026-03-13)
  - Mode: platform, user: sam, autoRecall: true, autoCapture: true
  - Cloud-based — no native code, no Android compat issues
- **Embedding:** Gemini `gemini-embedding-001` (free, configured in `agents.defaults.memorySearch`)
- **LanceDB is BROKEN on Android** — do NOT re-enable. Rust `renameat2` Permission Denied.
- **memory-core** is the fallback if Mem0 ever has issues.

## MCP Servers (via mcporter)
- `tasker` — 23 tools, device control (SMS, alarms, apps)
- `notebooklm-mcp` — 32 tools, Google NotebookLM access
- `github-mcp-server` — 26 tools
- `firebase-mcp-server` — 16 tools
- `pinecone-mcp-server` — 9 tools, vector database
- `sequential-thinking` — 1 tool, chain-of-thought reasoning
- `brave-search` — 2 tools, web search
- `jcodemunch` — code indexing (runs via proot, may show offline in mcporter)

## NotebookLM Auth
Cookies expire every 2-4 weeks. To refresh:
1. Sam exports cookies from Kiwi browser to `~/cookies.txt`
2. Run: `nlm-refresh` (alias in .bashrc)

## Agent Collaboration
- Claude and Gemini collaborate via `~/agent-comms/`
- Write letters as `dear-claude.md` or `dear-gemini.md`

---

Add whatever helps you do your job. This is your cheat sheet.
