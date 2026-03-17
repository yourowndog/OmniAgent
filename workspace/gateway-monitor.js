#!/usr/bin/env node

// Gateway Health Monitor
// Monitors OpenClaw gateway and sends emergency alerts when it goes down

const { exec } = require('child_process');
const { formatNotification } = require('./notification-system');

class GatewayMonitor {
  constructor() {
    this.gatewayUrl = 'http://localhost:3000'; // Adjust as needed
    this.checkInterval = 30000; // 30 seconds
    this.isRunning = false;
    this.lastStatus = 'unknown';
  }

  async checkGatewayStatus() {
    try {
      const response = await fetch(`${this.gatewayUrl}/status`, {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        if (this.lastStatus === 'down') {
          await this.sendRecoveryNotification();
        }
        this.lastStatus = 'up';
        return true;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      if (this.lastStatus === 'up') {
        await this.sendEmergencyAlert(error.message);
      }
      this.lastStatus = 'down';
      return false;
    }
  }

  async sendEmergencyAlert(errorDetails = '') {
    console.log('🚨 Gateway down! Sending emergency alert...');
    
    const message = `Gateway connection lost!${errorDetails ? `\nError: ${errorDetails}` : ''}`;
    const formattedMessage = formatNotification(message, true);
    
    // Send notification via Tasker
    await this.taskerSendNotification({
      title: '🚨 EMERGENCY',
      text: formattedMessage,
      priority: 'max',
      timeout: 10000
    });
    
    // Send SMS
    await this.taskerSendSMS({
      number: 'your-phone-number', // Replace with actual number
      message: `🚨 Soma: Gateway down! ${errorDetails}`
    });
    
    // Trigger emergency vibration pattern
    await this.taskerVibrate({
      pattern: '1000,500,1000,500',
      repeat: 3
    });
  }

  async sendRecoveryNotification() {
    console.log('✅ Gateway back online! Sending recovery notification...');
    
    const message = 'Gateway connection restored. All systems operational.';
    const formattedMessage = formatNotification(message);
    
    // Send recovery notification
    await this.taskerSendNotification({
      title: '✅ Gateway Restored',
      text: formattedMessage,
      priority: 'high'
    });
    
    // Send SMS
    await this.taskerSendSMS({
      number: 'your-phone-number', // Replace with actual number
      message: `✅ Soma: Gateway back online.`
    });
  }

  async taskerSendNotification(options) {
    try {
      // This would integrate with Tasker MCP server
      console.log(`[Tasker] Sending notification: ${options.title}`);
      console.log(`[Tasker] Text: ${options.text}`);
      
      // TODO: Implement actual Tasker MCP integration
      // await tasker.mcp.sendNotification(options);
      
    } catch (error) {
      console.error('Failed to send Tasker notification:', error);
    }
  }

  async taskerSendSMS(options) {
    try {
      console.log(`[SMS] Sending to ${options.number}: ${options.message}`);
      
      // TODO: Implement actual SMS integration via Tasker or Termux
      // await tasker.mcp.sendSMS(options);
      
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
  }

  async taskerVibrate(options) {
    try {
      console.log(`[Vibration] Pattern: ${options.pattern}`);
      
      // TODO: Implement actual vibration via Tasker or Termux
      // await tasker.mcp.vibrate(options);
      
    } catch (error) {
      console.error('Failed to trigger vibration:', error);
    }
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🔍 Gateway monitor started...');
    
    // Initial check
    this.checkGatewayStatus();
    
    // Set up periodic checks
    this.interval = setInterval(() => {
      this.checkGatewayStatus();
    }, this.checkInterval);
  }

  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    clearInterval(this.interval);
    console.log('🛑 Gateway monitor stopped.');
  }
}

// Start monitoring if this script is run directly
if (require.main === module) {
  const monitor = new GatewayMonitor();
  monitor.start();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down gateway monitor...');
    monitor.stop();
    process.exit(0);
  });
}

module.exports = GatewayMonitor;