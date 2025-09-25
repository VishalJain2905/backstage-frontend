import React, { useState } from "react";
import { walletService } from "../services/walletService";
import { authApiService } from "../services/authApi";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription,
  DialogHeader 
} from "./ui/dialog";
import { Card } from "./ui/card";
import { X, Wallet } from "lucide-react";

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface WalletConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletId: string) => void;
  onWalletConnected?: (walletAddress: string) => void;
  onRegistrationNeeded?: (walletAddress: string) => void;
}

const walletOptions: WalletOption[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    description: "Connect using MetaMask browser extension"
  },
  {
    id: "phantom",
    name: "Phantom",
    icon: "👻",
    description: "Connect using Phantom wallet"
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "🔗",
    description: "Connect using WalletConnect protocol"
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "💙",
    description: "Connect using Coinbase Wallet"
  }
];

export function WalletConnectionModal({ 
  isOpen, 
  onClose, 
  onConnect,
  onWalletConnected,
  onRegistrationNeeded
}: WalletConnectionModalProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { walletLogin, connectWallet, isAuthenticated } = useAuth();

  const handleWalletSelect = async (walletId: string) => {
    setIsConnecting(true);
    setError(null);

    try {
      // Connect to wallet
      const walletInfo = await walletService.connectWallet(walletId);
      
      // Get nonce for signature
      const { nonce } = await authApiService.getNonce();
      
      // Generate message and get signature
      const message = walletService.generateLoginMessage(walletInfo.address, nonce);
      const signature = await walletService.signWalletMessage(walletId, message);

      if (isAuthenticated) {
        // User is logged in with email, connect wallet to existing account
        await connectWallet(signature.address, signature.signature, signature.message);
        onWalletConnected?.(signature.address);
      } else {
        // User is not logged in, try wallet login
        const result = await walletLogin(signature.address, signature.signature, signature.message);
        
        if (result.needsRegistration) {
          onRegistrationNeeded?.(result.walletAddress || signature.address);
        } else {
          onWalletConnected?.(signature.address);
        }
      }

      onConnect(walletId);
      onClose();
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full max-w-[calc(100%-2rem)] bg-black/90 backdrop-blur-xl border border-[#999999] rounded-2xl p-0 shadow-2xl shadow-black/50 max-h-[90vh] overflow-hidden">
        <div className="relative">
          {/* Close Button */}
          <Button
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-transparent border-transparent hover:bg-white/10 hover:backdrop-blur-md transition-all duration-300 z-10 p-0"
            size="icon"
          >
            <X className="h-4 w-4 text-white" />
          </Button>

          {/* Content */}
          <div className="p-8 pt-12">
            {/* Header */}
            <DialogHeader className="text-center mb-8">
              <DialogTitle className="text-white mb-2 text-xl font-semibold font-['Syne']">
                Connect Your Wallet
              </DialogTitle>
              <DialogDescription className="text-white/70 text-sm font-['Poppins']">
                Choose your preferred wallet to continue.
              </DialogDescription>
            </DialogHeader>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Wallet Options */}
            <div className="space-y-3 mb-8">
              {walletOptions.map((wallet) => (
                <Card
                  key={wallet.id}
                  onClick={() => !isConnecting && handleWalletSelect(wallet.id)}
                  className={`p-4 bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-white/10 rounded-xl ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl w-12 h-12 flex items-center justify-center bg-white/5 rounded-full group-hover:bg-white/10 transition-all duration-300 border border-white/10 group-hover:border-white/20">
                      {wallet.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-white font-medium font-['Syne'] text-base">{wallet.name}</h3>
                      <p className="text-white/60 text-sm font-['Poppins']">{wallet.description}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {isConnecting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <div className="h-2 w-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Main Connect Button */}
            <div className="mb-6">

            </div>

            {/* Footer Info */}
            <div className="text-center border-t border-white/10 pt-6">
              <p className="text-white/50 leading-relaxed font-['Poppins'] text-[11px]">
                Your wallet address is used only for secure authentication.<br />
                Private keys are never stored.
              </p>
            </div>
          </div>

          {/* Decorative Glassmorphic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-2xl pointer-events-none"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}