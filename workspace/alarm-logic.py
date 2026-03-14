import json
import subprocess
import re
from datetime import datetime, timedelta

def get_callout_time():
    # 1. Get the latest SMS
    result = subprocess.run(["termux-sms-list", "-l", "20"], capture_output=True, text=True)
    messages = json.loads(result.stdout)
    
    # 2. Look for "callout" or "start time"
    for msg in messages:
        body = msg['body'].lower()
        if "callout" in body or "start time" in body:
            # Simple regex to find time (e.g., 05:00, 5am, 17:30)
            time_match = re.search(r'(\d{1,2}[:.]?\d{2})\s*(am|pm)?', body)
            if time_match:
                return time_match.group(0), msg['received']
    return None, None

def set_alarms(start_time_str):
    # This is a placeholder for the logic to parse the string and set 3 alarms
    # (T-120, T-135, T-150)
    print(f"Logic: Setting alarms for {start_time_str}")
    # termux-alarm-set -h <hour> -m <minute>
    pass

if __name__ == "__main__":
    time_str, received = get_callout_time()
    if time_str:
        print(f"Found callout time: {time_str} (Received: {received})")
    else:
        print("No callout time found in recent messages.")
