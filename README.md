# OmniAgent: The Bespoke Mobile Intelligence

OmniAgent is a personalized, autonomous AI agent built to live in Termux and control an Android device via Tasker and Model Context Protocol (MCP).

## Architecture
- **Voice Interface:** Whisper API (transcription) + Tasker Say (synthesis).
- **Reasoning Engine:** Gemini 3 Flash API (primary) and local models (LLM).
- **Control Layer:** Tasker MCP (handles physical hardware, SMS, and app launching).
- **Knowledge Layer:** jCodeMunch (indexes local code and documentation).

## Primary Goal
To transform a high-performance Android device (Galaxy S25 Ultra) into a truly autonomous personal assistant that understands Sam's specific work life (concrete plants, callouts) and personal preferences (privacy, organization).

---
*Status: In Research & Planning Phase*
