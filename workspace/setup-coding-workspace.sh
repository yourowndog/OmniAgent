#!/bin/bash

# Simple Tmux Setup for Coding Agent
# Type these commands exactly as they appear

echo "🚀 Setting up your coding agent workspace..."
echo "============================================"

# Create new tmux session
tmux new-session -d -s coding-workspace -c /home/sam/.openclaw/workspace

# Split window horizontally
tmux split-window -h -t coding-workspace

# Left pane - Coding agent
tmux send-keys -t coding-workspace:0.0 'echo "🤖 Coding Agent Workspace"' Enter
tmux send-keys -t coding-workspace:0.0 'echo "Ready for your coding agent!"' Enter
tmux send-keys -t coding-workspace:0.0 'echo ""' Enter
tmux send-keys -t coding-workspace:0.0 'echo "Available models:"' Enter
tmux send-keys -t coding-workspace:0.0 'echo "1. Claude - Architecture & Design"' Enter
tmux send-keys -t coding-workspace:0.0 'echo "2. Gemini - Research & Analysis"' Enter
tmux send-keys -t coding-workspace:0.0 'echo "3. Codex - Implementation & Debugging"' Enter
tmux send-keys -t coding-workspace:0.0 'echo "4. Multi-Agent - Full Stack"' Enter
tmux send-keys -t coding-workspace:0.0 'echo ""' Enter
tmux send-keys -t coding-workspace:0.0 'echo "Type your choice (1-4): "' Enter

# Right pane - Model picker
tmux send-keys -t coding-workspace:0.1 'echo "🎯 Model Picker"' Enter
tmux send-keys -t coding-workspace:0.1 'echo ""' Enter
tmux send-keys -t coding-workspace:0.1 'echo "Choose your coding agent:"' Enter
tmux send-keys -t coding-workspace:0.1 'echo "1. Claude - Architecture & Design"' Enter
tmux send-keys -t coding-workspace:0.1 'echo "2. Gemini - Research & Analysis"' Enter
tmux send-keys -t coding-workspace:0.1 'echo "3. Codex - Implementation & Debugging"' Enter
tmux send-keys -t coding-workspace:0.1 'echo "4. Multi-Agent - Full Stack"' Enter
tmux send-keys -t coding-workspace:0.1 'echo ""' Enter
tmux send-keys -t coding-workspace:0.1 'echo "Type your choice (1-4): "' Enter

echo ""
echo "✅ Tmux workspace created!"
echo ""
echo "🔗 To use it:"
echo "   tmux attach -t coding-workspace"
echo ""
echo "🎯 What you'll see:"
echo "   Left: Coding agent ready for commands"
echo "   Right: Model picker to choose specialist"
echo ""
echo "💡 Navigation:"
echo "   Ctrl+B → : Switch to right pane"
echo "   Ctrl+B ← : Switch to left pane"
echo "   Ctrl+B D : Exit safely"
echo ""
echo "🚀 Ready when you are!"