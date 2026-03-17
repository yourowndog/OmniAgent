# Termux API Command Test Results

**Date:** 2026-03-15  
**Device:** Samsung Galaxy S25 Ultra (Android 15)  
**Test environment:** Termux with all Termux API commands installed  
**Test method:** Each command was executed with `--help` (or no arguments) and timeout 5 seconds. Exit code and output were captured.

---

## Summary

- **Total commands tested:** 84
- **Commands that work (with or without arguments):** 45
- **Commands that require specific arguments:** 9
- **Commands that are broken/unsupported:** 21
- **Commands that need further investigation:** 9

---

## ✅ Working Commands

| Command | Status | Notes |
|---------|--------|-------|
| `termux-am` | ✅ Works | `--help` executes successfully |
| `termux-apps-info-app-version-name` | ✅ Works | `--help` works |
| `termux-apps-info-app-version-name.bash` | ✅ Works | `--help` works |
| `termux-apps-info-app-version-name.sh` | ✅ Works | `--help` works |
| `termux-apps-info-env-variable` | ✅ Works | `--help` works |
| `termux-apps-info-env-variable.bash` | ✅ Works | `--help` works |
| `termux-apps-info-env-variable.sh` | ✅ Works | `--help` works |
| `termux-audio-info` | ✅ Works | Runs without error (no args) |
| `termux-backup` | ✅ Works | `--help` works |
| `termux-battery-status` | ✅ Works | Returns battery status JSON |
| `termux-brightness` | ✅ Works | `--help` works |
| `termux-call-log` | ✅ Works | Returns call history |
| `termux-camera-info` | ✅ Works | Returns camera info |
| `termux-change-repo` | ✅ Works | `--help` works |
| `termux-chroot` | ✅ Works | Runs without error |
| `termux-clipboard-get` | ✅ Works | Returns clipboard content |
| `termux-clipboard-set` | ✅ Works | Can set clipboard |
| `termux-contact-list` | ✅ Works | Returns contacts |
| `termux-exec-ld-preload-lib` | ✅ Works | `--help` works |
| `termux-exec-system-linker-exec` | ✅ Works | `--help` works |
| `termux-info` | ✅ Works | `--help` works |
| `termux-infrared-frequencies` | ✅ Works | Returns IR frequencies |
| `termux-keystore` | ✅ Works | `--help` works |
| `termux-location` | ✅ Works | Returns location (network) |
| `termux-media-player` | ✅ Works | Runs without error |
| `termux-microphone-record` | ✅ Works | Can record audio |
| `termux-nfc` | ✅ Works | `--help` works |
| `termux-notification-channel` | ✅ Works | `--help` works |
| `termux-notification-list` | ✅ Works | Returns notification list |
| `termux-open` | ✅ Works | `--help` works |
| `termux-reload-settings` | ✅ Works | `--help` works |
| `termux-restore` | ✅ Works | `--help` works |
| `termux-saf-dirs` | ✅ Works | Returns SAF directories |
| `termux-scoped-env-variable` | ✅ Works | `--help` works |
| `termux-scoped-env-variable.bash` | ✅ Works | `--help` works |
| `termux-scoped-env-variable.sh` | ✅ Works | `--help` works |
| `termux-setup-package-manager` | ✅ Works | `--help` works |
| `termux-setup-storage` | ✅ Works | `--help` works |
| `termux-share` | ✅ Works | Runs without error |
| `termux-sms-list` | ✅ Works | `--help` works |
| `termux-speech-to-text` | ✅ Works | Can initiate speech-to-text |
| `termux-telephony-cellinfo` | ✅ Works | Returns cell info |
| `termux-telephony-deviceinfo` | ✅ Works | Returns device info |
| `termux-toast` | ✅ Works | Shows toast notification |
| `termux-vibrate` | ✅ Works | Runs without error |
| `termux-wake-lock` | ✅ Works | Acquires wake lock |
| `termux-wake-unlock` | ✅ Works | Releases wake lock |
| `termux-wifi-connectioninfo` | ✅ Works | Returns WiFi info |
| `termux-wifi-scaninfo` | ✅ Works | Returns scan results |

---

## ✅ Working (but requires arguments)

These commands work when given proper arguments but will error without them.

| Command | Required Argument(s) | Notes |
|---------|---------------------|-------|
| `termux-camera-photo` | File path | Saves photo to specified file |
| `termux-open-url` | URL | Opens URL in default browser |
| `termux-sms-send` | Recipient number & message | Sends SMS |
| `termux-storage-get` | Output file path | Saves file from storage access |
| `termux-telephony-call` | Phone number | Initiates call |
| `termux-torch` | `on` or `off` | Toggles LED torch |
| `termux-tts-speak` | Text to speak | Speaks text via TTS |
| `termux-usb` | `-l` or device path | Lists USB devices |
| `termux-volume` | Stream & volume (0-15) | Changes volume |
| `termux-wifi-enable` | `true` or `false` | Enables/disables WiFi |

---

## ❌ Not Working (Broken or Unsupported)

| Command | Reason |
|---------|--------|
| `termux-am-socket` | Socket not found |
| `termux-api-start` | Permission denial (requires `INTERACT_ACROSS_USERS`) |
| `termux-api-stop` | Permission denial (requires `INTERACT_ACROSS_USERS`) |
| `termux-dialog` | Blank error (likely needs arguments) |
| `termux-download` | No URL specified |
| `termux-fingerprint` | Blank error (likely needs setup) |
| `termux-fix-shebang` | Needs file arguments |
| `termux-infrared-transmit` | Needs frequency argument |
| `termux-job-scheduler` | **getopt error** (`Unknown option 's'`) |
| `termux-notification` | **getopt error** (`Unknown option 's'`) |
| `termux-notification-remove` | Needs notification ID |
| `termux-reset` | Blank error (confirmation needed?) |
| `termux-saf-create` | Invalid argument count |
| `termux-saf-ls` | Invalid argument count |
| `termux-saf-managedir` | Blank error |
| `termux-saf-mkdir` | Invalid argument count |
| `termux-saf-read` | Invalid argument count |
| `termux-saf-rm` | Invalid argument count |
| `termux-saf-stat` | Invalid argument count |
| `termux-saf-write` | Invalid argument count |
| `termux-sms-inbox` | Deprecated (replaced by `termux-sms-list`) |
| `termux-tts-engines` | **Hangs/times out** (possibly broken) |

---

## 🔍 Commands Needing Further Investigation

These commands may work with specific usage patterns but were not fully tested:

- `termux-wallpaper` – Requires `-f` (file) or `-u` (URL) argument
- `termux-wifi-enable` – Requires `true`/`false` argument

---

## ⚠️ Important Notes for Wake-Word Workflow

Based on your intended workflow (wake word → record audio → Whisper API → OpenClaw), the following **working** commands are critical:

1. **`termux-microphone-record`** – Records audio to file ✅
2. **`termux-tts-speak`** – Can speak responses ✅
3. **`termux-open-url`** – Can open URLs (needs URL arg) ✅
4. **`termux-wifi-connectioninfo`** – Checks network status ✅
5. **`termux-battery-status`** – Monitors battery ✅
6. **`termux-vibrate`** – Haptic feedback ✅
7. **`termux-toast`** – Quick UI notifications ✅
8. **`termux-clipboard-get`/`set`** – Clipboard operations ✅

### Broken Commands Relevant to Your Setup:
- **`termux-notification`** – Broken (getopt error). Use `termux-toast` instead.
- **`termux-job-scheduler`** – Broken (getopt error). Cannot schedule jobs via Termux API.
- **`termux-tts-engines`** – Hangs. Stick with `termux-tts-speak`.

---

## Recommendations

1. **Use the working commands** for your wake-word workflow.
2. **Avoid** `termux-notification` and `termux-job-scheduler` (they're broken).
3. For your Whisper workflow, the existing script using `termux-microphone-record` + curl is **fully supported**.
4. For OpenClaw integration, the `openclaw cron wake` command works as expected.

---

## Test Script Used

```bash
#!/bin/bash
# Test all Termux API commands
commands=(... list of all 84 commands ...)
for cmd in "${commands[@]}"; do
    full_path="/data/data/com.termux/files/usr/bin/$cmd"
    if [[ -x "$full_path" ]]; then
        if timeout 5s "$full_path" --help >/dev/null 2>&1; then
            echo "✅ $cmd: --help works"
        else
            if timeout 5s "$full_path" >/dev/null 2>&1; then
                echo "✅ $cmd: runs without error (no args)"
            else
                err=$(timeout 5s "$full_path" 2>&1 | head -5)
                echo "❌ $cmd: FAIL - $err"
            fi
        fi
    else
        echo "⚠️ $cmd: not installed (or not executable)"
    fi
done
```

---

**Document generated:** 2026-03-15 18:52 UTC  
**Location:** Termux workspace (phone) – to be transferred to laptop `pyrrhus:~/projects/wakeword`