# Soma Notification System - Setup Guide

## Overview
This system provides comprehensive notifications from Soma to your Android device, including toast notifications, SMS messages, device vibration, and emergency alerts.

## Features

### 📱 Response Notifications (Every Response)
- **Toast notification** with creative "Soma [verb]" headers
- **Device vibration** (short pattern)
- **SMS message** with actual response content
- **Random creative verbs**: pontificates, muses, ruminates, meditates, opines, etc.

### 🚨 Emergency Alerts (Gateway Down)
- **Red emergency emoji** in notifications
- **Distinctive verb**: screams, shouts, alarms, warns, alerts
- **Long vibration pattern** (3 pulses)
- **SMS with emergency prefix**

### 🔍 Gateway Monitoring
- **Automatic health checks** every 30 seconds
- **Recovery notifications** when gateway comes back online
- **Emergency alerts** when gateway goes down

## Quick Setup

### Step 1: Configure Phone Number
Edit `soma-notifier.js` and set your phone number:
```javascript
constructor() {
  this.phoneNumber = '15551234567'; // YOUR PHONE NUMBER
}
```

### Step 2: Start Gateway Monitor
```bash
node gateway-monitor.js
```

### Step 3: Test Notification System
```bash
node soma-notifier.js
```

## Usage Examples

### Normal Response Notification
When I respond to you, this system automatically:
1. Shows toast: "Soma pontinates: [message]"
2. Vibrates device briefly
3. Sends SMS with my actual message

### Emergency Alert (Gateway Down)
When gateway connection is lost:
1. Shows toast: "🚨 Soma screams: Gateway connection lost!"
2. Vibration pattern: 1 sec, 0.5 sec, 1 sec, 0.5 sec
3. SMS: "🚨 Soma: Gateway connection lost!"

## Integration Points

### Tasker MCP Server
The system integrates with Tasker through the MCP server for:
- Android toast notifications
- SMS sending
- Device vibration control

### Termux API (Alternative)
If Tasker integration fails, fallback to Termux API commands:
```bash
termux-notification --title "Soma" --content "Message"
termux-vibrate -d 300
```

## File Structure
```
├── notification-system.js      # Core notification logic
├── tasker-integration.md        # Tasker setup guide
├── gateway-monitor.js          # Gateway health monitoring
├── soma-notifier.js            # Main notification client
└── setup-guide.md             # This file
```

## Configuration Options

### Enable/Disable Features
```javascript
const notifier = new SomaNotifier();

// Enable/disable individual features
notifier.enableNotifications();
notifier.disableSMS();
notifier.setPhoneNumber('15551234567');
```

### Adjust Timing
```javascript
// Change monitoring interval (default: 30 seconds)
notifier.monitorGateway(60000); // 1 minute

// Change vibration patterns
await notifier.triggerVibration('500,300,500', 2);
```

## Troubleshooting

### Common Issues
1. **Tasker integration not working**: Check Tasker HTTP plugin is enabled
2. **SMS not sending**: Verify phone number format
3. **No notifications**: Check notification permissions on Android
4. **Gateway monitoring false positives**: Check firewall settings

### Debug Mode
Enable verbose logging:
```javascript
notifier.debugMode = true;
```

## Security Notes
- Phone numbers are stored locally
- SMS content is validated
- Rate limiting prevents notification spam
- Emergency alerts have distinctive patterns

## Next Steps
1. Set up your phone number
2. Test the notification system
3. Configure Tasker integration
4. Start gateway monitoring

The system will now keep you connected to Soma everywhere on your device!