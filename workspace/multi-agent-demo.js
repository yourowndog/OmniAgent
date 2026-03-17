#!/usr/bin/env node

// Practical Multi-Agent Communication Demo
// Shows how two agents can communicate with visible feedback

const { spawn } = require('child_process');
const fs = require('fs');

class MultiAgentDemo {
  constructor() {
    this.sharedWorkspace = '/home/sam/.openclaw/workspace/multi-agent/shared';
    this.session1Key = 'agent:main:multi-agent-demo:1';
    this.session2Key = 'agent:brainstorm:multi-agent-demo:2';
  }

  async start() {
    console.log('🎬 Multi-Agent Communication Demo');
    console.log('===================================\n');
    
    // Setup shared workspace
    await this.setupWorkspace();
    
    // Start demonstration
    await this.runDemo();
  }

  async setupWorkspace() {
    console.log('📁 Setting up shared workspace...');
    
    const files = {
      'conversation-log.md': '# Multi-Agent Conversation Demo\n\n',
      'shared-ideas.md': '# Shared Ideas\n\n',
      'brainstorm-topics.md': '# Brainstorm Topics\n\n* Voice assistant architecture\n* Multi-agent orchestration\n* Android integration\n'
    };
    
    for (const [file, content] of Object.entries(files)) {
      const filePath = `${this.sharedWorkspace}/${file}`;
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
      }
    }
    
    console.log('✅ Workspace ready');
  }

  async runDemo() {
    console.log('🎭 Starting multi-agent demo...\n');
    
    // Demo 1: Simple conversation
    console.log('=== Demo 1: Simple Conversation ===');
    await this.simulateConversation();
    
    // Demo 2: Collaborative brainstorming
    console.log('\n=== Demo 2: Collaborative Brainstorming ===');
    await this.simulateBrainstorming();
    
    // Demo 3: User interaction
    console.log('\n=== Demo 3: User Interaction ===');
    await this.simulateUserInteraction();
    
    console.log('\n🎉 Demo complete!');
    console.log('📁 Check the shared workspace for conversation logs');
  }

  async simulateConversation() {
    const messages = [
      { from: 1, to: 2, message: "Hey there! I'm Soma, your personal assistant." },
      { from: 2, to: 1, message: "Hello! I'm your brainstorming partner. What are we working on today?" },
      { from: 1, to: 2, message: "I'm helping set up multi-agent systems for voice assistants." },
      { from: 2, to: 1, message: "That sounds fascinating! I have some ideas about orchestration..." }
    ];
    
    for (const msg of messages) {
      await this.logMessage(msg.from, msg.to, msg.message);
      console.log(`🤖 Agent ${msg.from}: ${msg.message}`);
      await this.delay(1000);
    }
  }

  async simulateBrainstorming() {
    console.log('\n🧠 Brainstorming session...');
    
    // Read current ideas
    const ideasFile = `${this.sharedWorkspace}/shared-ideas.md`;
    const currentIdeas = fs.readFileSync(ideasFile, 'utf8');
    
    // Agent 1 adds idea
    const idea1 = "\n## Voice Assistant Orchestration\n- Use ACP for model routing\n- Task decomposition specialists\n- Memory and context sharing\n";
    await this.updateSharedFile('shared-ideas.md', idea1);
    console.log('🤖 Agent 1 added: Voice Assistant Orchestration');
    
    await this.delay(1500);
    
    // Agent 2 builds on it
    const idea2 = "\n## Android Integration\n- Termux API for device control\n- Tasker automation hooks\n- SMS notification system\n";
    await this.updateSharedFile('shared-ideas.md', idea2);
    console.log('🤖 Agent 2 added: Android Integration');
    
    await this.delay(1500);
    
    // Both agents collaborate
    const collaboration = "\n## Combined Architecture\n```\nUser -> Soma -> Task Router -> Specialist Agents\n                                    ↓\n                               Android APIs\n                                    ↓\n                             Notification System\n```";
    await this.updateSharedFile('shared-ideas.md', collaboration);
    console.log('🤖 Both agents: Created combined architecture diagram');
  }

  async simulateUserInteraction() {
    console.log('\n👤 User interaction simulation...');
    
    // User message to both agents
    const userMessage = "How can we make the notification system more intelligent?";
    await this.logMessage('user', 1, userMessage);
    await this.logMessage('user', 2, userMessage);
    
    console.log(`👤 User: ${userMessage}`);
    
    // Agent responses
    await this.delay(1000);
    const agent1Response = "We could add sentiment analysis to prioritize notifications based on urgency and context.";
    await this.logMessage(1, 'user', agent1Response);
    console.log(`🤖 Agent 1: ${agent1Response}`);
    
    await this.delay(1000);
    const agent2Response = "We could also implement learning patterns from user response times to optimize notification timing.";
    await this.logMessage(2, 'user', agent2Response);
    console.log(`🤖 Agent 2: ${agent2Response}`);
  }

  async logMessage(from, to, message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] Agent ${from} -> Agent ${to}: ${message}\n`;
    
    // Append to conversation log
    fs.appendFileSync(`${this.sharedWorkspace}/conversation-log.md`, logEntry);
    
    // Also log to shared ideas if relevant
    if (message.includes('##') || message.includes('```')) {
      fs.appendFileSync(`${this.sharedWorkspace}/shared-ideas.md`, `\n${message}\n`);
    }
  }

  async updateSharedFile(filename, content) {
    const filePath = `${this.sharedWorkspace}/${filename}`;
    fs.appendFileSync(filePath, content);
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Practical methods for real agent communication
  async sendMessageToAgent(agentId, message) {
    console.log(`📨 Sending to Agent ${agentId}: ${message}`);
    
    // This would integrate with actual agent sessions
    // For now, we'll log it
    await this.logMessage('main', agentId, message);
  }

  async receiveFromAgent(agentId) {
    // This would receive messages from another agent
    console.log(`📨 Receiving from Agent ${agentId}`);
    return `Response from Agent ${agentId}`;
  }

  getStatus() {
    const logFile = `${this.sharedWorkspace}/conversation-log.md`;
    const ideasFile = `${this.sharedWorkspace}/shared-ideas.md`;
    
    return {
      conversationLog: fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : 'No log yet',
      sharedIdeas: fs.existsSync(ideasFile) ? fs.readFileSync(ideasFile, 'utf8') : 'No ideas yet',
      workspace: this.sharedWorkspace
    };
  }
}

// Run demo
if (require.main === module) {
  const demo = new MultiAgentDemo();
  demo.start().catch(console.error);
}

module.exports = MultiAgentDemo;