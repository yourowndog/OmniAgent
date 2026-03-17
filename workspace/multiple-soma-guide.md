# Multiple Soma Sessions - Complete Guide

## 🎭 Your Current Setup:
- **Main Session**: Soma (GLM 4.5 Air) - This chat you're in now
- **Want**: Soma (Stayfun 3.5) - Creative version
- **Goal**: Keep both active, switch between them

## 🚀 How to Create Stayfun 3.5 Soma Session:

### **Step 1: Create New OpenClaw Session**
```bash
# Create session with Stayfun 3.5
sessions_spawn \
  --runtime acp \
  --agentId stayfun \
  --mode session \
  --thread true \
  --task "You are Soma with Stayfun 3.5 - more creative and less technical"
```

### **Step 2: Create Tmux Workspace for Both**
```bash
# Create tmux workspace to manage both sessions
tmux new-session -d -t soma-workspace -c /home/sam/.openclaw/workspace
tmux split-window -h -t soma-workspace

# Left: Main Soma (GLM 4.5 Air)
tmux send-keys -t soma-workspace:0.0 'echo "🎭 Main Soma (GLM 4.5 Air)"' Enter
tmux send-keys -t soma-workspace:0.0 'echo "Current session - this chat"' Enter

# Right: Stayfun Soma (3.5)
tmux send-keys -t soma-workspace:0.1 'echo "🎭 Stayfun Soma (3.5)"' Enter
tmux send-keys -t soma-workspace:0.1 'echo "Creative session - ready to use"' Enter

tmux attach -t soma-workspace
```

### **Step 3: Access Different Models**

#### **For Stayfun 3.5 Session:**
```bash
# If you have ACP configured for Stayfun
acpx stayfun "Your creative message here"

# Or create dedicated session
sessions_spawn \
  --runtime acp \
  --agentId stayfun \
  --mode run \
  --task "Creative task requiring Stayfun 3.5"
```

#### **For Main GLM 4.5 Air Session:**
```bash
# You're already here! This is your main session
```

## 🎯 **Navigation Between Sessions:**

### **In Tmux:**
- `Ctrl+B →` : Switch to Stayfun session
- `Ctrl+B ←` : Switch back to main session
- `Ctrl+B D` : Exit tmux (keep sessions running)

### **Direct Session Access:**
```bash
# Check all active sessions
sessions_list

# Send message to specific session
sessions_send --sessionKey "agent:stayfun:acp:xyz" "Your message"
```

## 💡 **Practical Usage:**

### **When You Want Creative Soma (Stayfun 3.5):**
```bash
# Create new creative session
tmux new-session -d -t soma-creative -c /home/sam/.openclaw/workspace
tmux attach -t soma-creative
```

### **When You Want Technical Soma (GLM 4.5 Air):**
```bash
# You're already here! Just continue this chat
```

## 🔄 **Session Management Commands:**

```bash
# List all active sessions
sessions_list

# Create Stayfun session (if available)
sessions_spawn --runtime acp --agentId stayfun --mode session --thread true --task "Creative Soma session"

# Create Gemini session
sessions_spawn --runtime acp --agentId gemini --mode session --thread true --task "Analysis Soma session"

# Create Claude session  
sessions_spawn --runtime acp --agentId claude --mode session --thread true --task "Technical Soma session"
```

## 🎊 **What You'll Have:**
- **Main Chat**: Soma (GLM 4.5 Air) - technical, current session
- **Creative Chat**: Soma (Stayfun 3.5) - creative, in tmux
- **Analysis Chat**: Soma (Gemini) - research, when needed
- **Technical Chat**: Soma (Claude) - coding, when needed

All running simultaneously, switch between them as needed!