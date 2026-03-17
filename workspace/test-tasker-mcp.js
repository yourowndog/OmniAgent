#!/usr/bin/env node

// Direct Test of Tasker MCP Integration
// Tests LM-Tasker MCP server functionality

const { spawn } = require('child_process');

async function testTaskerMCP() {
  console.log('🔧 Testing Tasker MCP Integration...\n');
  
  // Test 1: Check if server can start
  console.log('1. Testing LM-Tasker MCP server startup...');
  try {
    const server = spawn('npx', ['-y', '@qubeio/lm-tasker-mcp']);
    
    // Give it a moment to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    if (!server.killed) {
      console.log('✅ LM-Tasker MCP server started successfully');
      server.kill();
    } else {
      console.log('❌ LM-Tasker MCP server failed to start');
    }
    
  } catch (error) {
    console.log('❌ Error starting LM-Tasker MCP server:', error.message);
  }
  
  // Test 2: Check available tools
  console.log('\n2. Testing available tools...');
  try {
    const toolsProcess = spawn('npx', ['-y', '@qubeio/lm-tasker-mcp', 'tools', 'list']);
    
    let output = '';
    toolsProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    toolsProcess.stderr.on('data', (data) => {
      console.log('STDERR:', data.toString());
    });
    
    await new Promise((resolve, reject) => {
      toolsProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Tools list retrieved successfully');
          console.log('Output:', output);
        } else {
          console.log('❌ Failed to get tools list (code:', code, ')');
        }
        resolve();
      });
      
      toolsProcess.on('error', (error) => {
        console.log('❌ Error getting tools:', error.message);
        resolve();
      });
    });
    
  } catch (error) {
    console.log('❌ Error getting tools:', error.message);
  }
  
  // Test 3: Test specific Tasker functions
  console.log('\n3. Testing specific Tasker functions...');
  const testFunctions = [
    'send_notification',
    'send_sms',
    'vibrate',
    'get_variable',
    'set_variable'
  ];
  
  for (const func of testFunctions) {
    console.log(`   Testing ${func}...`);
    try {
      const funcProcess = spawn('npx', ['-y', '@qubeio/lm-tasker-mcp', 'call', func]);
      
      await new Promise((resolve, reject) => {
        funcProcess.on('close', (code) => {
          if (code === 0) {
            console.log(`   ✅ ${func} available`);
          } else {
            console.log(`   ❌ ${func} failed (code: ${code})`);
          }
          resolve();
        });
      });
      
    } catch (error) {
      console.log(`   ❌ Error testing ${func}:`, error.message);
    }
  }
  
  console.log('\n🎯 Tasker MCP Integration Test Complete!');
  console.log('Based on these results, we can:');
  console.log('- Use the LM-Tasker MCP server for notifications');
  console.log('- Implement SMS functionality through Tasker');
  console.log('- Control device vibration and other features');
}

testTaskerMCP().catch(console.error);