import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SiSolana } from "react-icons/si";
import { CheckCircle2 } from "lucide-react";

interface ConnectWalletProps {
  onConnect: () => void;
  connected: boolean;
}

export default function ConnectWallet({ onConnect, connected }: ConnectWalletProps) {
  const { toast } = useToast();

  const connectWallet = async () => {
    try {
      // Check if Phantom is installed
      const { solana } = window;

      if (!solana || !solana.isPhantom) {
        toast({
          variant: "destructive",
          title: "Phantom Wallet Not Found",
          description: "Please install Phantom wallet from phantom.app first",
        });
        // Open Phantom wallet installation page
        window.open("https://phantom.app/", "_blank");
        return;
      }

      // Try to connect
      try {
        await window.solana.connect();
        onConnect();

        toast({
          title: "Wallet Connected",
          description: "Successfully connected to Phantom wallet.",
        });
      } catch (error) {
        console.error("Connection error:", error);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Please unlock your Phantom wallet and try again.",
        });
      }
    } catch (error) {
      console.error("Wallet error:", error);
      toast({
        variant: "destructive",
        title: "Wallet Error",
        description: "There was an error connecting to your wallet. Please make sure Phantom is installed and try again.",
      });
    }
  };

  if (connected) {
    return (
      <div className="text-center">
        <Button
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
          size="lg"
          disabled
        >
          <CheckCircle2 className="mr-2 h-5 w-5" />
          Wallet Connected
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <Button
        onClick={connectWallet}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
        size="lg"
      >
        <SiSolana className="mr-2 h-5 w-5" />
        Connect Phantom Wallet
      </Button>
      <p className="mt-2 text-sm text-gray-600">
        Don't have Phantom wallet? <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Install it here</a>
      </p>
    </div>
  );
}