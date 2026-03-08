# OmniAgent: Mobile Autonomy Goals

This document tracks the mission to build a fully autonomous, voice-driven mobile agent for Sam. It replaces standard dumb assistants with a bespoke, context-aware engine.

## 🚀 Phase 1: The MVP (High Priority / Clear Path)

The initial goal is a reliable background service triggered by a wake word, using **Gemini 3 Flash API** for reasoning and **Whisper API** for high-fidelity voice-to-text.

- [ ] **Alarms via Callout Logic:**
    - **Trigger:** "Hey Omni, set my alarms."
    - **Logic:** Scan most recent messages/notifications for "callout" times.
    - **Action:** Set three alarms: (T-120min), (T-135min), (T-150min).
    - **Verification:** System notification confirm.
- [ ] **Dynamic Navigation:**
    - **Trigger:** "Take me to the Bonham/Commerce plant."
    - **Action:** Open Google Maps with high-priority routing to the specific saved favorite location.
- [ ] **Notification Management (The Clean Slate):**
    - **Trigger:** "What are my unread notifications?"
    - **Action:** Read summary; handle specific senders differently (e.g., delete/unsubscribe spam).
- [ ] **Voice-to-SMS Loop:**
    - **Trigger:** "Read my texts" -> "Reply."
    - **Logic:** Transcribe response via Whisper, read back for confirmation, then send.

## 🛠️ Phase 2: System & Life Integration

- [ ] **The "Wife Workflow":**
    - **Trigger:** Automatic (30min delay on unreplied texts from wife).
    - **Action:** Send pre-configured "I love you but am busy" message.
    - **Feature:** Random sweet/romantic periodic texts.
- [ ] **Storage Janitor:**
    - **Action:** Identify and organize terminal screenshots in Termux; suggest deletions to free space.
- [ ] **Network Stealth:**
    - **Action:** Dynamically configure RethinkDNS to minimize telemetry based on current location/activity.

## 🎵 Phase 3: Media & Entertainment

- [ ] **Spotify Power Control:**
    - **Action:** Voice-trigger specific custom playlists and individual songs.
- [ ] **AI/Politics YouTube Daily:**
    - **Action:** Curate a daily "Must Watch" list from subscribed creators; trigger playback by category.
- [ ] **Audible Resumption:**
    - **Action:** One-touch/voice resume of the current audiobook exactly where left off.

## 🎛️ Phase 4: Hardware & Power User Tweaks

- [ ] **DPI Resolution Switching:**
    - **Action:** Toggle developer option DPI settings via voice for specific app usage (e.g., "Terminal Mode").
- [ ] **Location-Based Triggers:**
    - **Trigger:** Arriving at Bonham plant.
    - **Action:** Automatically launch ADP and Whiparound apps.

---
*Created by Gemini CLI & Sam - March 6, 2026*
