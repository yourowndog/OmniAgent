import os
import subprocess
import pvporcupine
from pvrecorder import PvRecorder

# Sam: Get your free AccessKey at https://console.picovoice.ai/
ACCESS_KEY = "PASTE_YOUR_ACCESS_KEY_HERE"
WAKE_WORD = "bumblebee" # Built-in keywords: porcupine, bumblebee, dragonfly, etc.

# OpenClaw Whisper Script Path
WHISPER_SCRIPT = "/data/data/com.termux/files/usr/lib/node_modules/openclaw/skills/openai-whisper-api/scripts/transcribe.sh"

def main():
    porcupine = pvporcupine.create(access_key=ACCESS_KEY, keywords=[WAKE_WORD])
    recorder = PvRecorder(device_index=-1, frame_length=porcupine.frame_length)
    recorder.start()

    print(f"Listening for '{WAKE_WORD}'...")

    try:
        while True:
            pcm = recorder.read()
            keyword_index = porcupine.process(pcm)

            if keyword_index >= 0:
                print("Wake word detected! Recording command...")
                # 1. Buzz the phone so Sam knows we're listening
                subprocess.run(["termux-vibrate", "-d", "200"])
                
                # 2. Record 5 seconds of audio
                subprocess.run(["termux-microphone-record", "-d", "5", "-f", "/tmp/cmd.wav"])
                
                # 3. Transcribe with Whisper
                print("Transcribing...")
                result = subprocess.run([WHISPER_SCRIPT, "/tmp/cmd.wav"], capture_output=True, text=True)
                transcript_file = "/tmp/cmd.wav.txt"
                
                if os.path.exists(transcript_file):
                    with open(transcript_file, "r") as f:
                        command = f.read().strip()
                        print(f"Command: {command}")
                        
                        # 4. Send to OpenClaw
                        subprocess.run(["openclaw", "message", "send", "--message", command])
                
                print(f"Done. Listening for '{WAKE_WORD}' again...")

    except KeyboardInterrupt:
        recorder.stop()
    finally:
        porcupine.delete()
        recorder.delete()

if __name__ == "__main__":
    main()
