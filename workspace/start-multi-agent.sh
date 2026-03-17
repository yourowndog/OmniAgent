#!/bin/bash

# Multi-Agent Brainstorming Quick Start
# This script sets up the environment and gets you started immediately

echo "🚀 Multi-Agent Brainstorming Environment - Quick Start"
echo "=================================================="

# Navigate to workspace
cd /home/sam/.openclaw/workspace

echo "🔧 Setting up environment..."
node multi-agent.js

echo ""
echo "🚀 Starting SSH server..."
node multi-agent.js start-ssh

echo ""
echo "🖥️  Starting tmux session..."
chmod +x multi-agent/start-tmux.sh
bash multi-agent/start-tmux.sh

echo ""
echo "🎉 Multi-Agent Environment Ready!"
echo ""
echo "📋 What you're seeing:"
echo "• Left pane: Main Soma agent (your current session)"
echo "• Right pane: Brainstorm partner agent (SSH session)"
echo "• Bottom: Status and controls"
echo ""
echo "🔍 How to use:"
echo "1. Type in left pane to talk to Soma"
echo "2. Watch both agents converse"
echo "3. Type in right pane to join the conversation"
echo "4. Shared workspace: multi-agent/shared/"
echo "5. Conversation log: multi-agent/shared/conversation-log.md"
echo ""
echo "💡 Tips:"
echo "• Use Ctrl+B then Arrow keys to panes"
echo "• Ctrl+B then D to detach"
echo "• Ctrl+B then C to create new pane"
echo "• Both agents can read/write shared files"
echo ""