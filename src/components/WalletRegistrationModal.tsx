import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "./ui/dialog";
import { Mail, Lock, User, Eye, EyeOff, X } from "lucide-react";

interface WalletRegistrationModalProps {
  isOpen: boolean;
  walletAddress: string;
  onClose: () => void;
  onComplete: (data: { email: string; username: string; password: string }) => Promise<void>;
}

export function WalletRegistrationModal({ 
  isOpen, 
  walletAddress, 
  onClose, 
  onComplete 
}: WalletRegistrationModalProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onComplete({
        email: email.trim(),
        username: username.trim(),
        password,
      });
    } catch (error: any) {
      setErrors({ general: error.message || "Registration failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full max-w-[calc(100%-2rem)] bg-black/90 backdrop-blur-xl border border-[#999999] rounded-2xl p-0 shadow-2xl shadow-black/50 max-h-[90vh] overflow-y-auto">
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
                Complete Your Registration
              </DialogTitle>
              <DialogDescription className="text-white/70 text-sm font-['Poppins']">
                Your wallet is connected! Please provide your account details to complete registration.
              </DialogDescription>
              
              {/* Wallet Address Display */}
              <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-white/50 mb-1">Connected Wallet</p>
                <p className="text-white text-sm font-mono">{formatWalletAddress(walletAddress)}</p>
              </div>
            </DialogHeader>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{errors.general}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40 ${
                      errors.email ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className={`pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40 ${
                      errors.username ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.username && (
                  <p className="text-red-400 text-sm">{errors.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className={`pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40 ${
                      errors.password ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className={`pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40 ${
                      errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
                )}
              </div>

              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full py-6 bg-white text-black border border-transparent hover:bg-transparent hover:text-white hover:border-white rounded-[100px] transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? "Creating Account..." : "Complete Registration"}
              </Button>
            </form>

            {/* Footer Info */}
            <div className="text-center border-t border-white/10 pt-6 mt-8">
              <p className="text-white/50 leading-relaxed font-['Poppins'] text-[11px]">
                By completing registration, you agree to our Terms of Service and Privacy Policy.
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
