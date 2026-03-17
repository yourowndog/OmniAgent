# Tasker Integration for Soma Notifications

## Overview
This integration uses the Tasker MCP server to send notifications and SMS from Soma to your Android device.

## Available Functions

### 1. Toast Notifications
```javascript
// Send toast notification to Android device
taskerSendNotification({
  title: "Soma Notification",
  text: formattedMessage,
  priority: "high",
  timeout: 5000
});
```

### 2. SMS Messages
```javascript
// Send SMS with Soma's response
taskerSendSMS({
  number: "your-phone-number",
  message: somaResponse,
  priority: "normal"
});
```

### 3. Device Vibration
```javascript
// Trigger device vibration
taskerVibrate({
  pattern: "500,300,500", // short, short, long
  repeat: 1
});
```

### 4. Gateway Monitoring
```javascript
// Monitor gateway health
taskerMonitorGateway({
  checkInterval: 60000, // check every minute
  onDown: sendEmergencyAlert,
  onUp: sendRecoveryNotification
});
```

## Setup Instructions

### Step 1: Configure Tasker Profile
1. Create a new Tasker profile: "Soma Notifications"
2. Add trigger: Event → HTTP → URL Received
3. Set URL pattern: `soma://notification/*`

### Step 2: Create Notification Task
1. Task: "Show Soma Toast"
2. Actions:
   - Notification → Custom Notification
   - Flash → On
   - Vibration → On
   - Sound → Default

### Step 3: Create SMS Task
1. Task: "Send Soma SMS"
2. Actions:
   - SMS Send → Format number and message

### Step 4: Gateway Monitoring Profile
1. Profile: "Gateway Health"
2. Trigger: Event → System → Boot Complete
3. Task: "Check Gateway Status" (runs periodically)

## Usage Examples

### Normal Response Notification
```javascript
const { formatNotification } = require('./notification-system');

const message = "I've analyzed your wake word pipeline and found some optimization opportunities.";
const formatted = formatNotification(message);

// Send to Tasker
taskerSendNotification({
  title: "Soma Response",
  text: formatted,
  priority: "high"
});

// Trigger vibration
taskerVibrate({ pattern: "300,200" });

// Send SMS
taskerSendSMS({
  number: "your-number",
  message: message
});
```

### Gateway Down Alert
```javascript
const emergencyMessage = "🚨 Soma: Gateway connection lost!";
const formatted = formatNotification(emergencyMessage, true);

taskerSendNotification({
  title: "🚨 EMERGENCY",
  text: formatted,
  priority: "max",
  timeout: 10000
});

taskerVibrate({ pattern: "1000,500,1000,500", repeat: 3 });
taskerSendSMS({
  number: "your-number",
  message: emergencyMessage
});
```

## Error Handling

- If Tasker integration fails, log to file
- Fallback to desktop notifications if available
- Implement retry logic for SMS delivery
- Monitor notification success/failure

## Security Notes

- Store phone numbers securely
- Validate SMS content
- Rate limit notifications to prevent spam
- Allow user to disable notifications temporarily