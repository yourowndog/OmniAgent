#!/usr/bin/env node

// Soma Notification Client
// Integrated notification system for responses and alerts

const { formatNotification } = require('./notification-system');

class SomaNotifier {
  constructor() {
    this.phoneNumber = 'your-phone-number'; // TODO: Set this
    this.notificationEnabled = true;
    this.smsEnabled = true;
    this.emergencyOnly = false;
  }

  async sendResponseNotification(message) {
    if (!this.notificationEnabled && !this.smsEnabled) return;
    
    console.log('🔔 Sending Soma response notification...');
    
    // Generate creative notification header
    const formattedMessage = formatNotification(message);
    
    try {
      // Send toast notification
      if (this.notificationEnabled) {
        await this.sendTaskerNotification({
          title: 'Soma Response',
          text: formattedMessage,
          priority: 'high'
        });
        
        // Trigger vibration
        await this.triggerVibration('300,200');
      }
      
      // Send SMS
      if (this.smsEnabled) {
        await this.sendSMS({
          number: this.phoneNumber,
          message: message
        });
      }
      
      console.log('✅ Notification sent successfully');
      
    } catch (error) {
      console.error('❌ Failed to send notification:', error);
    }
  }

  async sendEmergencyAlert(message, errorDetails = '') {
    console.log('🚨 EMERGENCY ALERT TRIGGERED');
    
    const fullMessage = `${message}${errorDetails ? `\n\nDetails: ${errorDetails}` : ''}`;
    const formattedMessage = formatNotification(fullMessage, true);
    
    try {
      // Send emergency notification
      await this.sendTaskerNotification({
        title: '🚨 Soma Emergency',
        text: formattedMessage,
        priority: 'max',
        timeout: 10000
      });
      
      // Emergency vibration pattern
      await this.triggerVibration('1000,500,1000,500', 3);
      
      // Emergency SMS
      await this.sendSMS({
        number: this.phoneNumber,
        message: `🚨 ${fullMessage}`
      });
      
      console.log('🚨 Emergency alert sent successfully');
      
    } catch (error) {
      console.error('❌ Failed to send emergency alert:', error);
    }
  }

  async sendTaskerNotification(options) {
    try {
      // This would integrate with Tasker MCP server
      console.log(`[Tasker] Notification: ${options.title}`);
      console.log(`[Tasker] Content: ${options.text}`);
      
      // TODO: Implement actual Tasker MCP integration
      // const response = await tasker.mcp.sendNotification(options);
      // return response;
      
    } catch (error) {
      console.error('Tasker notification failed:', error);
      throw error;
    }
  }

  async sendSMS(options) {
    try {
      console.log(`[SMS] To: ${options.number}`);
      console.log(`[SMS] Message: ${options.message}`);
      
      // TODO: Implement actual SMS integration via Tasker or Termux
      // const response = await tasker.mcp.sendSMS(options);
      // return response;
      
    } catch (error) {
      console.error('SMS send failed:', error);
      throw error;
    }
  }

  async triggerVibration(pattern, repeat = 1) {
    try {
      console.log(`[Vibration] Pattern: ${pattern}, Repeat: ${repeat}`);
      
      // TODO: Implement actual vibration via Tasker or Termux
      // await tasker.mcp.vibrate({ pattern, repeat });
      
    } catch (error) {
      console.error('Vibration failed:', error);
    }
  }

  // Gateway monitoring integration
  async monitorGateway(intervalMs = 30000) {
    console.log('🔍 Starting gateway monitoring...');
    
    const checkGateway = async () => {
      try {
        const response = await fetch('http://localhost:3000/status', {
          method: 'GET',
          timeout: 5000
        });
        
        if (!response.ok) {
          throw new Error(`Gateway responded with ${response.status}`);
        }
        
        console.log('✅ Gateway is healthy');
        
      } catch (error) {
        console.error('❌ Gateway check failed:', error.message);
        await this.sendEmergencyAlert(
          'Gateway connection lost!',
          error.message
        );
      }
    };
    
    // Initial check
    await checkGateway();
    
    // Set up periodic checks
    this.gatewayInterval = setInterval(checkGateway, intervalMs);
  }

  stopMonitoring() {
    if (this.gatewayInterval) {
      clearInterval(this.gatewayInterval);
      console.log('🛑 Gateway monitoring stopped');
    }
  }

  // Configuration methods
  setPhoneNumber(number) {
    this.phoneNumber = number;
    console.log(`📱 SMS notifications will go to: ${number}`);
  }

  enableNotifications() {
    this.notificationEnabled = true;
    console.log('🔔 Notifications enabled');
  }

  disableNotifications() {
    this.notificationEnabled = false;
    console.log('🔔 Notifications disabled');
  }

  enableSMS() {
    this.smsEnabled = true;
    console.log('📱 SMS notifications enabled');
  }

  disableSMS() {
    this.smsEnabled = false;
    console.log('📱 SMS notifications disabled');
  }
}

// Export for use in other scripts
module.exports = SomaNotifier;

// CLI usage
if (require.main === module) {
  const notifier = new SomaNotifier();
  
  // Example usage
  notifier.monitorGateway();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down notification system...');
    notifier.stopMonitoring();
    process.exit(0);
  });
}