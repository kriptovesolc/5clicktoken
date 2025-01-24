import { Card, CardContent } from "@/components/ui/card";
import TokenForm from "@/components/token-form";
import ConnectWallet from "@/components/connect-wallet";
import { useState } from "react";

export default function Home() {
  const [connected, setConnected] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Create Solana SPL Token
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Create your token on Solana blockchain with just a few clicks
          </p>

          <Card className="mb-8">
            <CardContent className="p-6">
              <ConnectWallet onConnect={() => setConnected(true)} connected={connected} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <TokenForm connected={connected} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}