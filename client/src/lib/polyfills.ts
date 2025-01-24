import { Buffer } from 'buffer';

// Add Buffer to window object
window.Buffer = Buffer;

// Extend Window interface
declare global {
  interface Window {
    Buffer: typeof Buffer;
    solana?: any;
  }
}
