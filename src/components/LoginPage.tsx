import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Mail, Lock, Eye, EyeOff, X } from "lucide-react";

interface LoginPageProps {
  onBack: () => void;
  onLogin: () => void;
  onRequestAccess: () => void;
  onShowWalletPrompt?: () => void;
}

export function LoginPage({ onBack, onLogin, onRequestAccess, onShowWalletPrompt }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    try {
      const result = await login(email.trim(), password);
      
      // Login successful
      onLogin();
      
      // Show wallet connection prompt if needed
      if (result.needsWalletConnection && onShowWalletPrompt) {
        setTimeout(() => {
          onShowWalletPrompt();
        }, 1000); // Delay to let dashboard load first
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message.includes('credentials') || error.message.includes('Invalid')) {
        setEmailError("Invalid email or password");
        setPasswordError("Invalid email or password");
      } else {
        setEmailError(error.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 relative">
      <Card className="max-w-md w-full p-8 bg-white/5 backdrop-blur-md border border-[#999999] relative">
        {/* Mobile/Tablet Close Button - Inside Card */}
        <Button
          onClick={onBack}
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-transparent border-transparent hover:bg-white/20 hover:backdrop-blur-md hover:border-white/20 transition-all duration-300"
          size="icon"
        >
          <X className="h-4 w-4 text-white" />
        </Button>
        
        {/* Header */}
        <div className="flex items-center mb-8 pr-12 lg:pr-0">

          <h2 className="text-2xl font-medium text-white">Sign In to your account</h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
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
                  emailError ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
            </div>
            {emailError && (
              <div className="animate-in slide-in-from-top-2 duration-200">
                <p className="text-[rgba(255,100,103,1)] text-sm mt-1">
                  {emailError}
                </p>
              </div>
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
                placeholder="Enter your password"
                className={`pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40 ${
                  passwordError ? "border-red-500 focus:border-red-500" : ""
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
            {passwordError && (
              <div className="animate-in slide-in-from-top-2 duration-200">
                <p className="text-[rgba(255,100,103,1)] text-sm mt-1">
                  {passwordError}
                </p>
              </div>
            )}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
                className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-black"
              />
              <Label 
                htmlFor="remember-me" 
                className="text-sm text-gray-300 cursor-pointer"
              >
                Remember me
              </Label>
            </div>
            <button 
              type="button" 
              className="text-sm text-gray-300 hover:text-white transition-colors underline"
              onClick={() => {
                // Handle forgot password - could navigate to a forgot password screen
                console.log('Forgot password clicked');
              }}
            >
              Forgot password?
            </button>
          </div>

          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full py-6 bg-white text-black border border-transparent hover:bg-transparent hover:text-white hover:border-white rounded-[100px] transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </Card>

      {/* Request Access - Outside Card */}
      <div className="max-w-md w-full text-center mt-6 px-8">
        <div className="flex items-center mb-6">
          <div className="flex-1 h-px bg-white/20"></div>
          <p className="text-sm text-gray-300 mx-6 whitespace-nowrap">
            Don't have access yet?
          </p>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>
        <Button 
          onClick={onRequestAccess} 
          className="w-full py-6 bg-white text-black border border-transparent hover:bg-transparent hover:text-white hover:border-white rounded-[100px] transition-all duration-300"
        >
          Request Access
        </Button>
      </div>
    </div>
  );
}