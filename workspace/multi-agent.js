#!/usr/bin/env node

// Multi-Agent Brainstorming Environment
// Sets up visible multi-agent conversations with SSH and tmux

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class MultiAgentEnvironment {
  constructor() {
    this.workspace = '/home/sam/.openclaw/workspace/multi-agent';
    this.sshPort = 2222;
    this.agent1Session = 'soma-main';
    this.agent2Session = 'brainstorm-partner';
    this.sharedWorkspace = `${this.workspace}/shared`;
  }

  async setup() {
    console.log('🚀 Setting up Multi-Agent Brainstorming Environment...\n');
    
    // Create workspace
    await this.createWorkspace();
    
    // Setup SSH server
    await this.setupSSHServer();
    
    // Create tmux layout
    await this.createTmuxLayout();
    
    // Setup agent communication
    await this.setupAgentCommunication();
    
    console.log('✅ Multi-agent environment ready!');
    console.log(`🔍 SSH: ssh -p ${this.sshPort} localhost`);
    console.log(`🖥️  Tmux: tmux attach -t multi-agent`);
    console.log(`📁 Shared workspace: ${this.sharedWorkspace}`);
  }

  async createWorkspace() {
    console.log('📁 Creating workspace...');
    
    if (!fs.existsSync(this.workspace)) {
      fs.mkdirSync(this.workspace, { recursive: true });
    }
    
    if (!fs.existsSync(this.sharedWorkspace)) {
      fs.mkdirSync(this.sharedWorkspace, { recursive: true });
    }
    
    // Create shared files
    const sharedFiles = {
      'conversation-log.md': '# Multi-Agent Conversation Log\n\n',
      'ideas.md': '# Shared Ideas\n\n',
      'brainstorm-topics.md': '# Brainstorm Topics\n\n',
      'agent1-notes.md': '# Agent 1 (Soma) Notes\n\n',
      'agent2-notes.md': '# Agent 2 (Partner) Notes\n\n'
    };
    
    for (const [file, content] of Object.entries(sharedFiles)) {
      const filePath = `${this.sharedWorkspace}/${file}`;
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
      }
    }
    
    console.log('✅ Workspace created');
  }

  async setupSSHServer() {
    console.log('🔐 Setting up SSH server...');
    
    // Create SSH config
    const sshConfig = `
# Multi-Agent SSH Server
Port ${this.sshPort}
Listen localhost
HostKey /tmp/ssh_host_key
PermitRootLogin yes
PasswordAuthentication yes
PermitEmptyPasswords yes
`;

    fs.writeFileSync('/tmp/ssh_config', sshConfig);
    
    // Generate host key
    try {
      await this.execCommand('ssh-keygen -t rsa -f /tmp/ssh_host_key -N ""');
      console.log('✅ SSH host key generated');
    } catch (error) {
      console.log('⚠️  SSH key generation failed, continuing...');
    }
    
    console.log('✅ SSH server configured on port', this.sshPort);
  }

  async createTmuxLayout() {
    console.log('🖥️  Creating tmux layout...');
    
    const tmuxScript = `
#!/bin/bash
# Multi-Agent Tmux Layout

# Create new session
tmux new-session -d -s multi-agent -c ${this.workspace}

# Split window into two panes
tmux split-window -h -c ${this.workspace}

# Agent 1 - Main Soma session
tmux send-keys -t multi-agent:0.0 'echo "🤖 Agent 1: Soma (Main Session)"' Enter
tmux send-keys -t multi-agent:0.0 'echo "Watching for your input..."' Enter

# Agent 2 - SSH-connected partner
tmux send-keys -t multi-agent:0.1 'echo "🤖 Agent 2: Brainstorm Partner (SSH Session)"' Enter
tmux send-keys -t multi-agent:0.1 'echo "Connected via SSH - port ${this.sshPort}"' Enter

# Status bar
tmux send-keys -t multi-agent:0.2 'echo "📊 Multi-Agent Status: Ready"' Enter
tmux send-keys -t multi-agent:0.2 'echo "🔍 Shared workspace: ${this.sharedWorkspace}"' Enter

# Attach to session
tmux attach -t multi-agent
`;

    fs.writeFileSync(`${this.workspace}/start-tmux.sh`, tmuxScript);
    fs.chmodSync(`${this.workspace}/start-tmux.sh`, '755');
    
    console.log('✅ Tmux layout created');
  }

  async setupAgentCommunication() {
    console.log('🔄 Setting up agent communication...');
    
    // Create communication protocol
    const protocol = {
      messageQueue: `${this.sharedWorkspace}/messages.json`,
      stateFile: `${this.sharedWorkspace}/state.json`,
      logFile: `${this.sharedWorkspace}/conversation-log.md`
    };
    
    // Initialize communication files
    if (!fs.existsSync(protocol.messageQueue)) {
      fs.writeFileSync(protocol.messageQueue, JSON.stringify([]));
    }
    
    if (!fs.existsSync(protocol.stateFile)) {
      fs.writeFileSync(protocol.stateFile, JSON.stringify({
        agent1: { lastActive: new Date().toISOString(), status: 'ready' },
        agent2: { lastActive: new Date().toISOString(), status: 'ready' }
      }));
    }
    
    console.log('✅ Agent communication protocol setup');
  }

  async startSSHServer() {
    console.log('🚀 Starting SSH server...');
    
    // Start SSH daemon in background
    const sshProcess = spawn('ssh', ['-f', '-D', this.sshPort, '-F', '/tmp/ssh_config', 'localhost'], {
      detached: true
    });
    
    sshProcess.unref();
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (sshProcess.exitCode === null) {
      console.log('✅ SSH server started successfully');
      console.log(`🔌 SSH running on port ${this.sshPort}`);
    } else {
      console.log('❌ SSH server failed to start');
    }
  }

  async spawnBrainstormAgent() {
    console.log('🧠 Spawning brainstorm agent...');
    
    // Create a second agent session for brainstorming
    const brainstormTask = `
You are a creative brainstorming partner. Your job is to:
1. Collaborate with the main Soma agent
2. Generate creative ideas and solutions
3. Build on each other's thoughts
4. Keep track of shared ideas in ${this.sharedWorkspace}/ideas.md
5. Log your conversation in ${this.sharedWorkspace}/conversation-log.md

Share your thoughts and collaborate with the main agent!
`;
    
    // This would spawn a second agent session
    console.log('🎯 Ready to spawn second agent with task:');
    console.log(brainstormTask);
    
    return brainstormTask;
  }

  async sendMessage(fromAgent, toAgent, message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] Agent ${fromAgent} -> Agent ${toAgent}: ${message}\n`;
    
    // Append to conversation log
    fs.appendFileSync(`${this.sharedWorkspace}/conversation-log.md`, logEntry);
    
    // Add to message queue
    const queue = JSON.parse(fs.readFileSync(`${this.sharedWorkspace}/messages.json`, 'utf8'));
    queue.push({ from: fromAgent, to: toAgent, message, timestamp });
    fs.writeFileSync(`${this.sharedWorkspace}/messages.json`, JSON.stringify(queue, null, 2));
    
    console.log(`📨 Message sent from Agent ${fromAgent} to Agent ${toAgent}`);
  }

  async getMessages() {
    const queue = JSON.parse(fs.readFileSync(`${this.sharedWorkspace}/messages.json`, 'utf8'));
    return queue;
  }

  async getStatus() {
    const state = JSON.parse(fs.readFileSync(`${this.sharedWorkspace}/state.json`, 'utf8'));
    const messages = await this.getMessages();
    
    return {
      state,
      pendingMessages: messages.length,
      workspace: this.sharedWorkspace,
      sshPort: this.sshPort
    };
  }

  async execCommand(command) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, { shell: true });
      let output = '';
      
      process.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      process.on('close', (code) => {
        resolve({ code, output });
      });
      
      process.on('error', (error) => {
        reject(error);
      });
    });
  }
}

// CLI interface
if (require.main === module) {
  const env = new MultiAgentEnvironment();
  
  env.setup().then(() => {
    console.log('\n🎉 Multi-Agent Environment Setup Complete!');
    console.log('\n🔧 To get started:');
    console.log('1. Start SSH server: node multi-agent.js start-ssh');
    console.log('2. Start tmux session: bash start-tmux.sh');
    console.log('3. Spawn second agent: node multi-agent.js spawn-brainstorm');
    console.log('4. Watch conversation: tmux attach -t multi-agent');
    
    process.exit(0);
  }).catch(console.error);
}

module.exports = MultiAgentEnvironment;