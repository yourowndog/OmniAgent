#!/bin/bash

# Soma Multi-Session Manager
# Creates different Soma instances with different models

echo "🎭 Soma Multi-Session Manager"
echo "==============================="

# Create new tmux session for Stayfun 3.5 Soma
tmux new-session -d -s soma-stayfun -c /home/sam/.openclaw/workspace

# Split window for the new session
tmux split-window -h -t soma-stayfun

# Left pane - Stayfun 3.5 Soma
tmux send-keys -t soma-stayfun:0.0 'echo "🎭 Soma (Stayfun 3.5)"' Enter
tmux send-keys -t soma-stayfun:0.0 'echo "Ready for creative tasks!"' Enter
tmux send-keys -t soma-stayfun:0.0 'echo ""' Enter
tmux send-keys -t soma-stayfun:0.0 'echo "Model: Stayfun 3.5"' Enter
tmux send-keys -t soma-stayfun:0.0 'echo "Specialty: Creative, less technical"' Enter
tmux send-keys -t soma-stayfun:0.0 'echo ""' Enter
tmux send-keys -t soma-stayfun:0.0 'echo "Type your message to Soma (Stayfun): "' Enter

# Right pane - Instructions
tmux send-keys -t soma-stayfun:0.1 'echo "📋 Instructions"' Enter
tmux send-keys -t soma-stayfun:0.1 'echo ""' Enter
tmux send-keys -t soma-stayfun:0.1 'echo "This is your Stayfun 3.5 Soma session"' Enter
tmux send-keys -t soma-stayfun:0.1 'echo ""' Enter
tmux send-keys -t soma-stayfun:0.1 'echo "Navigation:"' Enter
tmux send-keys -t soma-stayfun:0.1 'echo "Ctrl+B → : Switch to chat pane"' Enter
tmux send-keys -t soma-stayfun:0.1 'echo "Ctrl+B ← : Switch to instructions"' Enter
tmux send-keys -t soma-stayfun:0.1 'echo "Ctrl+B D : Exit safely"' Enter
tmux send-keys -t soma-stayfun:0.1 'echo ""' Enter
tmux send-keys -t soma-stayfun:0.1 'echo "🎯 To start chatting:"' Enter
tmux send-keys -t soma-stayfun:0.1 'echo "1. Ctrl+B → to go to chat"' Enter
tmux send-keys -t soma-stayfun:0.1 'echo "2. Type your message"' Enter
tmux send-keys -t soma-stayfun:0.1 'echo "3. Press Enter to send"' Enter

echo ""
echo "✅ Stayfun 3.5 Soma session created!"
echo ""
echo "🔗 To access:"
echo "   tmux attach -t soma-stayfun"
echo ""
echo "🎯 You now have:"
echo "   • Current session: Soma (GLM 4.5 Air) - this chat"
echo "   • New session: Soma (Stayfun 3.5) - in tmux"
echo ""
echo "💡 Switch between them without closing either!"