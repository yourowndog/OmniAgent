#!/bin/bash
# Test all Termux API commands

commands=(
"termux-am"
"termux-am-socket"
"termux-api-start"
"termux-api-stop"
"termux-apps-info-app-version-name"
"termux-apps-info-app-version-name.bash"
"termux-apps-info-app-version-name.sh"
"termux-apps-info-env-variable"
"termux-apps-info-env-variable.bash"
"termux-apps-info-env-variable.sh"
"termux-audio-info"
"termux-backup"
"termux-battery-status"
"termux-brightness"
"termux-call-log"
"termux-camera-info"
"termux-camera-photo"
"termux-change-repo"
"termux-chroot"
"termux-clipboard-get"
"termux-clipboard-set"
"termux-contact-list"
"termux-dialog"
"termux-download"
"termux-exec-ld-preload-lib"
"termux-exec-system-linker-exec"
"termux-fingerprint"
"termux-fix-shebang"
"termux-info"
"termux-infrared-frequencies"
"termux-infrared-transmit"
"termux-job-scheduler"
"termux-keystore"
"termux-location"
"termux-media-player"
"termux-media-scan"
"termux-microphone-record"
"termux-nfc"
"termux-notification"
"termux-notification-channel"
"termux-notification-list"
"termux-notification-remove"
"termux-open"
"termux-open-url"
"termux-reload-settings"
"termux-reset"
"termux-restore"
"termux-saf-create"
"termux-saf-dirs"
"termux-saf-ls"
"termux-saf-managedir"
"termux-saf-mkdir"
"termux-saf-read"
"termux-saf-rm"
"termux-saf-stat"
"termux-saf-write"
"termux-scoped-env-variable"
"termux-scoped-env-variable.bash"
"termux-scoped-env-variable.sh"
"termux-setup-package-manager"
"termux-setup-storage"
"termux-share"
"termux-sms-inbox"
"termux-sms-list"
"termux-sms-send"
"termux-speech-to-text"
"termux-storage-get"
"termux-telephony-call"
"termux-telephony-cellinfo"
"termux-telephony-deviceinfo"
"termux-toast"
"termux-torch"
"termux-tts-engines"
"termux-tts-speak"
"termux-usb"
"termux-vibrate"
"termux-volume"
"termux-wake-lock"
"termux-wake-unlock"
"termux-wallpaper"
"termux-wifi-connectioninfo"
"termux-wifi-enable"
"termux-wifi-scaninfo"
)

echo "Testing Termux API commands..."
echo "================================"

for cmd in "${commands[@]}"; do
    full_path="/data/data/com.termux/files/usr/bin/$cmd"
    if [[ -x "$full_path" ]]; then
        # Try --help first
        if timeout 5s "$full_path" --help >/dev/null 2>&1; then
            echo "✅ $cmd: --help works"
        else
            # Try without arguments (some commands don't support --help)
            if timeout 5s "$full_path" >/dev/null 2>&1; then
                echo "✅ $cmd: runs without error (no args)"
            else
                # Capture error output
                err=$(timeout 5s "$full_path" 2>&1 | head -5)
                echo "❌ $cmd: FAIL - $err"
            fi
        fi
    else
        echo "⚠️ $cmd: not installed (or not executable)"
    fi
done