#!/data/data/com.termux/files/usr/bin/sh
echo "--- Android Connectivity Test ---"
echo "1. Testing Vibration..."
termux-vibrate -d 500
echo "2. Testing Toast..."
termux-toast -t "Connectivity Test Active"
echo "3. Testing Battery..."
termux-battery-status
echo "4. Testing Tasker Port..."
curl -s 127.0.0.1:1821 && echo "Tasker: OK" || echo "Tasker: FAILED"
echo "--------------------------------"
