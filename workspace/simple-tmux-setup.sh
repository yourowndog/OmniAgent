#!/bin/bash

# Simple Tmux Setup for Claude Learning
# This creates a clear, easy-to-navigate workspace

echo "🎯 Setting up simple tmux workspace for Claude learning..."
echo "=================================================="

# Create a simple tmux session
tmux new-session -d -s claude-learning -c /home/sam/.openclaw/workspace

# Split into two panes
tmux split-window -h -t claude-learning

# Left pane - Instructions
tmux send-keys -t claude-learning:0.0 'echo "🤖 LEFT PANE: Instructions (You are here)"' Enter
tmux send-keys -t claude-learning:0.0 'echo ""' Enter
tmux send-keys -t claude-learning:0.0 'echo "📋 What to do:"' Enter
tmux send-keys -t claude-learning:0.0 'echo "1. Read the instructions in this pane"' Enter
tmux send-keys -t claude-learning:0.0 'echo "2. Switch to right pane with Ctrl+B →"' Enter
tmux send-keys -t claude-learning:0.0 'echo "3. Run the commands in right pane"' Enter
tmux send-keys -t claude-learning:0.0 'echo "4. Switch back with Ctrl+B ←"' Enter
tmux send-keys -t claude-learning:0.0 'echo "5. Ask me if you get stuck!"' Enter
tmux send-keys -t claude-learning:0.0 'echo ""' Enter
tmux send-keys -t claude-learning:0.0 'echo "🛑 To exit: Ctrl+B then D"' Enter

# Right pane - Commands to run
tmux send-keys -t claude-learning:0.1 'echo "🔧 RIGHT PANE: Commands (Execute here)"' Enter
tmux send-keys -t claude-learning:0.1 'echo ""' Enter
tmux send-keys -t claude-learning:0.1 'echo "🚀 First command to run:"' Enter
tmux send-keys -t claude-learning:0.1 'echo "npx claude-agent-acp auth login"' Enter
tmux send-keys -t claude-learning:0.1 'echo ""' Enter
tmux send-keys -t claude-learning:0.1 'echo "Then wait for browser to open"' Enter

echo "✅ Simple tmux workspace created!"
echo ""
echo "🔗 To use it:"
echo "   tmux attach -t claude-learning"
echo ""
echo "🎯 What you'll see:"
echo "   Left: Clear instructions (where you are now)"
echo "   Right: Commands to execute"
echo ""
echo "💡 Much simpler than before!"
echo "   Ctrl+B → : Switch to commands pane"
echo "   Ctrl+B ← : Switch back to instructions"
echo "   Ctrl+B D : Exit safely"