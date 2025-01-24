import { Connection, PublicKey } from '@solana/web3.js';
import * as splToken from '@solana/spl-token';

// Global type declarations
declare global {
  interface Window {
    solana?: any;
  }
}

export interface TokenDetails {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  description?: string;
  imageUrl?: string;
}

export async function createToken(
  connection: Connection,
  payer: PublicKey,
  details: TokenDetails
): Promise<string> {
  try {
    // Create mint account
    const mint = await splToken.createMint(
      connection,
      window.solana,
      payer,
      payer,
      details.decimals
    );

    // Get token account
    const tokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
      connection,
      window.solana,
      mint,
      payer
    );

    // Calculate and mint initial supply
    const amount = Math.floor(details.totalSupply * (10 ** details.decimals));
    await splToken.mintTo(
      connection,
      window.solana,
      mint,
      tokenAccount.address,
      payer,
      amount
    );

    return mint.toString();
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
}