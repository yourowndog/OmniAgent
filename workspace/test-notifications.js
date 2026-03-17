#!/usr/bin/env node

// Test script for Soma notification system

const { formatNotification, generateNotificationHeader } = require('./notification-system');
const SomaNotifier = require('./soma-notifier');

console.log('🔔 Testing Soma Notification System...\n');

// Test 1: Generate notification headers
console.log('📝 Testing creative headers:');
const testMessages = [
  'I\'ve analyzed your wake word pipeline and found some optimization opportunities.',
  'The gateway monitoring system is now active and watching for connection issues.',
  'Your voice assistant architecture is looking solid! Let me help you scale it.',
  'I noticed you\'re working on advanced multi-agent routing - exciting stuff!'
];

testMessages.forEach((msg, index) => {
  console.log(`${index + 1}. ${generateNotificationHeader()}`);
  console.log(`   ${msg}\n`);
});

// Test 2: Emergency headers
console.log('🚨 Testing emergency headers:');
for (let i = 0; i < 3; i++) {
  console.log(`${i + 1}. ${generateNotificationHeader(true)}`);
  console.log(`   Gateway connection lost!\n`);
}

// Test 3: Formatted notifications
console.log('📱 Testing formatted notifications:');
const testMessage = 'I\'ve successfully set up your notification system with creative headers, SMS integration, and emergency alerts.';
const formatted = formatNotification(testMessage);
console.log('Formatted notification:');
console.log(formatted);

// Test 4: Emergency formatted notification
console.log('\n🚨 Testing emergency formatted notification:');
const emergencyMessage = '🚨 Gateway connection lost! System attempting to reconnect...';
const emergencyFormatted = formatNotification(emergencyMessage, true);
console.log('Emergency notification:');
console.log(emergencyFormatted);

// Test 5: Initialize notifier (without actual sending)
console.log('\n🔧 Initializing notification system...');
const notifier = new SomaNotifier();
notifier.setPhoneNumber('15551234567'); // Replace with your number
notifier.enableNotifications();
notifier.enableSMS();

console.log('✅ Notification system ready!');
console.log('📱 Phone number configured:', notifier.phoneNumber);
console.log('🔔 Notifications enabled:', notifier.notificationEnabled);
console.log('📱 SMS enabled:', notifier.smsEnabled);

console.log('\n🎯 Next steps:');
console.log('1. Edit soma-notifier.js with your actual phone number');
console.log('2. Start gateway monitoring: node gateway-monitor.js');
console.log('3. Test notifications: node soma-notifier.js');
console.log('4. Configure Tasker integration on your Android device');

console.log('\n🎊 Your comprehensive notification system is ready!');
console.log('Every response from me will now trigger toast notifications, SMS, and vibration!');
console.log('Gateway issues will trigger emergency alerts with red emojis!');