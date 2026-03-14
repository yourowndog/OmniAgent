import json
import re
import subprocess
import sys
from datetime import datetime, timedelta

def get_recent_sms():
    try:
        # Fetch last 50 messages to ensure we get the full group thread
        print("Soma: Attempting to fetch SMS via termux-api (this may be slow)...")
        result = subprocess.run(['termux-sms-list', '-l', '50'], capture_output=True, text=True, timeout=30)
        return json.loads(result.stdout)
    except Exception as e:
        print(f"Error fetching SMS: {e}")
        return []

def parse_callout(manual_text=None):
    if manual_text:
        return manual_text.lower()

    messages = get_recent_sms()
    
    # Sort messages by date descending (most recent first)
    messages.sort(key=lambda x: x.get('date', ''), reverse=True)

    for msg in messages:
        body = msg.get('body', '').lower()
        if "all drivers" in body:
            return body

    print("No valid callout found in recent messages.")
    return None

def extract_time(body):
    # Step 1: Handle the "Sam" vs "All Drivers" logic
    # Example: "all drivers 3:00 am ... Sam 2:30 am"
    
    # Use regex to find all time patterns: e.g., "3:00 am", "12:30pm", "8 am"
    time_pattern = r'(\d{1,2}(?::\d{2})?\s*(?:am|pm))'
    
    # Find the specific "all drivers" block
    all_drivers_match = re.search(r'all drivers\s*has changed for.*?' + time_pattern + r'|all drivers\s*' + time_pattern, body)
    
    if all_drivers_match:
        # The time will be in one of the capturing groups
        return all_drivers_match.group(1) or all_drivers_match.group(2)
    return None

def set_alarms(time_str):
    # Clean up time string for parsing
    time_str = time_str.strip().lower()
    
    # Handle formats like "8 am" vs "8:00 am"
    if ":" not in time_str:
        time_str = re.sub(r'(\d+)\s*(am|pm)', r'\1:00 \2', time_str)
    
    try:
        # Parse the extracted time
        callout_time = datetime.strptime(time_str, "%I:%M %p")
        
        # Since we don't have the date in the time string, assume it's for the next available cycle
        now = datetime.now()
        callout_datetime = now.replace(hour=callout_time.hour, minute=callout_time.minute, second=0, microsecond=0)
        
        # If the time has already passed today, assume it's for tomorrow
        if callout_datetime < now:
            callout_datetime += timedelta(days=1)
            
        # Alarm offsets in minutes
        offsets = [120, 135, 150]
        
        print(f"Targeting work start at: {callout_datetime.strftime('%Y-%m-%d %I:%M %p')}")
        
        for offset in offsets:
            alarm_time = callout_datetime - timedelta(minutes=offset)
            time_val = alarm_time.strftime("%H:%M")
            label = f"Soma: Work Callout -{offset}m"
            print(f"Soma Action: Set alarm for {time_val} ({label})")

    except Exception as e:
        print(f"Error calculating alarms: {e}")

if __name__ == "__main__":
    # If text is passed as an argument, use that instead of scanning SMS
    input_text = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else None
    
    body_to_parse = parse_callout(input_text)
    if body_to_parse:
        time_found = extract_time(body_to_parse)
        if time_found:
            print(f"Found callout time: {time_found}")
            set_alarms(time_found)
