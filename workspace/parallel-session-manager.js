#!/usr/bin/env node

// Parallel Session Manager
// Helps manage multiple concurrent OpenClaw sessions

const { spawn } = require('child_process');

class ParallelSessionManager {
  constructor() {
    this.sessions = {
      'main': {
        key: 'agent:main:main',
        purpose: 'Multi-agent brainstorming and notification systems',
        status: 'active'
      },
      'ssh-setup': {
        key: 'agent:claude:acp:4640ae28-325c-477a-9f24-9ab623b0d0ab',
        purpose: 'SSH setup from phone to titan computer',
        status: 'active'
      }
    };
  }

  listSessions() {
    console.log('🔄 Active Parallel Sessions:\n');
    console.log('Session 1 - Main Conversation:');
    console.log(`  Key: ${this.sessions.main.key}`);
    console.log(`  Purpose: ${this.sessions.main.purpose}`);
    console.log(`  Status: ${this.sessions.main.status}\n`);
    
    console.log('Session 2 - SSH Setup:');
    console.log(`  Key: ${this.sessions['ssh-setup'].key}`);
    console.log(`  Purpose: ${this.sessions['ssh-setup'].purpose}`);
    console.log(`  Status: ${this.sessions['ssh-setup'].status}\n`);
  }

  async accessSSHSession() {
    console.log('🔧 Accessing SSH Setup Session...\n');
    console.log('You can now:');
    console.log('1. Use the session key for direct communication');
    console.log('2. Create a new terminal for SSH work');
    console.log('3. Continue in this session while SSH setup runs in background\n');
    
    console.log('💡 SSH Setup Task:');
    console.log('• Configure SSH from phone to titan computer');
    console.log('• Set up authentication and keys');
    console.log('• Establish tunnel for multi-agent communication');
    console.log('• Test connectivity between devices\n');
    
    console.log('📱 Phone → Titan SSH Configuration:');
    console.log('1. Generate SSH keys on titan');
    console.log('2. Transfer public key to phone');
    console.log('3. Configure SSH server on titan');
    console.log('4. Test connection from phone');
    console.log('5. Set up multi-agent communication tunnel');
  }

  async switchContext(target) {
    console.log(`🔄 Switching to ${target} context...\n`);
    
    switch(target) {
      case 'ssh':
        console.log('🔧 SSH Setup Context Active');
        console.log('Claude is ready to help with phone-to-titan SSH configuration');
        break;
      case 'main':
        console.log('🧠 Multi-Agent Context Active');
        console.log('Back to brainstorming and notification systems work');
        break;
      case 'both':
        console.log('🎯 Dual Context Mode');
        console.log('Working on both SSH setup and multi-agent systems');
        break;
      default:
        console.log('❌ Unknown context. Use: ssh, main, or both');
    }
  }

  async getQuickStart() {
    console.log('🚀 Quick Start Guide:\n');
    
    console.log('📱 SSH Setup Session:');
    console.log(`Session Key: ${this.sessions['ssh-setup'].key}`);
    console.log('Agent: Claude');
    console.log('Ready to help configure phone-to-titan SSH\n');
    
    console.log('🔧 To start SSH setup:');
    console.log('1. Use the session key above for direct communication');
    console.log('2. Or create: ssh -p 2222 localhost (if SSH server running)');
    console.log('3. Claude will guide you through the configuration\n');
    
    console.log('🎯 Multi-Agent Work:');
    console.log('This session remains active for your brainstorming');
    console.log('You can switch contexts as needed\n');
    
    console.log('💡 Pro Tip:');
    console.log('Use tmux to manage both sessions in separate panes!');
    console.log('tmux new-session -d -t parallel-sessions');
    console.log('tmux split-window -h');
    console.log('tmux attach -t parallel-sessions');
  }
}

// CLI interface
if (require.main === module) {
  const manager = new ParallelSessionManager();
  
  console.log('🎯 Parallel Session Manager - SSH Setup\n');
  
  manager.listSessions();
  manager.accessSSHSession();
  manager.getQuickStart();
  
  console.log('\n🎉 Sessions Ready for Parallel Work!');
  console.log('You can now work on SSH setup while keeping your multi-agent work active!');
}

module.exports = ParallelSessionManager;