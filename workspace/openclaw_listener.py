#!/usr/bin/env python3
"""
OpenClaw Listener Daemon
Listens on a TCP port and inserts incoming text as a user message
into the specified OpenClaw session.
"""

import socket
import subprocess
import threading
import sys

# Configuration
HOST = '127.0.0.1'
PORT = 9999
SESSION_ID = "d220da48-923c-4e21-a2d9-b808ab216f4c"  # openclaw-tui gateway-client

def insert_message(text: str) -> None:
    """Insert text as a user message into the OpenClaw session."""
    if not text.strip():
        return
    cmd = ['openclaw', 'agent', '--session-id', SESSION_ID, '--message', text.strip()]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        if result.returncode != 0:
            print(f"Error inserting message: {result.stderr}")
        else:
            print(f"Inserted: {text[:50]}...")
    except Exception as e:
        print(f"Exception: {e}")

def handle_client(conn: socket.socket, addr: tuple) -> None:
    """Handle a single client connection."""
    try:
        data = conn.recv(4096).decode('utf-8')
        if data:
            insert_message(data)
    except Exception as e:
        print(f"Client error: {e}")
    finally:
        conn.close()

def main():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        sock.bind((HOST, PORT))
        sock.listen(5)
        print(f"OpenClaw listener running on {HOST}:{PORT}")
        print(f"Inserting into session {SESSION_ID}")
        print("Send text to this port to have it appear in the chat.")
        while True:
            conn, addr = sock.accept()
            thread = threading.Thread(target=handle_client, args=(conn, addr))
            thread.start()
    except KeyboardInterrupt:
        print("\nShutting down.")
    finally:
        sock.close()

if __name__ == '__main__':
    main()