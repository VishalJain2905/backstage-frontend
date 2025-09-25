import React, { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "./ui/dialog";
import { Wallet, X, Shield, Zap } from "lucide-react";

interface ConnectWalletPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectWallet: () => void;
  onSkip: () => void;
}

export function ConnectWalletPromptModal({ 
  isOpen, 
  onClose, 
  onConnectWallet,
  onSkip 
}: ConnectWalletPromptModalProps) {
  const [isHovered, setIsHovered] = useState(false);

  const benefits = [
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Add an extra layer of security with blockchain authentication"
    },
    {
      icon: Zap,
      title: "Quick Access",
      description: "Sign in instantly with your wallet without passwords"
    },
    {
      icon: Wallet,
      title: "Web3 Ready",
      description: "Access future blockchain features and integrations"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full max-w-[calc(100%-2rem)] bg-black/90 backdrop-blur-xl border border-[#999999] rounded-2xl p-0 shadow-2xl shadow-black/50 max-h-[90vh] overflow-y-auto">
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
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-white/10">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <DialogTitle className="text-white mb-2 text-xl font-semibold font-['Syne']">
                Connect Your Wallet
              </DialogTitle>
              <DialogDescription className="text-white/70 text-sm font-['Poppins']">
                Enhance your account security and unlock Web3 features by connecting your cryptocurrency wallet.
              </DialogDescription>
            </DialogHeader>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm mb-1">{benefit.title}</h3>
                      <p className="text-white/60 text-xs leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={onConnectWallet}
                className="w-full py-6 bg-white text-black border border-transparent hover:bg-transparent hover:text-white hover:border-white rounded-[100px] transition-all duration-300 font-medium"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet Now
              </Button>
              
              <Button 
                onClick={onSkip}
                variant="ghost"
                className="w-full py-6 text-white/70 hover:text-white hover:bg-white/5 rounded-[100px] transition-all duration-300"
              >
                Skip for Now
              </Button>
            </div>

            {/* Footer Info */}
            <div className="text-center border-t border-white/10 pt-6 mt-8">
              <p className="text-white/50 leading-relaxed font-['Poppins'] text-[11px]">
                You can always connect your wallet later from your account settings.<br />
                Your wallet address is used only for secure authentication.
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
