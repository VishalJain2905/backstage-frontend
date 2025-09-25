import image_c38fe21dfd6a374404a0ce74c819355ff0126c33 from 'figma:asset/c38fe21dfd6a374404a0ce74c819355ff0126c33.png';
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { HeroBackground } from "./HeroBackground";
import { CTAButton } from "./CTAButton";
import { SimpleButton } from "./SimpleButton";
import { AnimatedLoginButton } from "./AnimatedLoginButton";
import { AnimatedConnectWalletButton } from "./AnimatedConnectWalletButton";
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  Music, 
  MessageSquare, 
  Bot, 
  Shield, 
  Puzzle,
  Menu,
  X
} from "lucide-react";

interface LandingPageProps {
  onLogin: () => void;
  onDirectToDashboard: () => void;
  onRequestAccess: () => void;
  onWalletConnect: () => void;
}

export function LandingPage({ onLogin, onDirectToDashboard, onRequestAccess, onWalletConnect }: LandingPageProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="py-4 px-6 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="flex items-center gap-3 text-xl font-medium font-[Geist] text-white text-[20px]">
            <img 
              src={image_c38fe21dfd6a374404a0ce74c819355ff0126c33} 
              alt="Backstage Logo" 
              className="w-8 h-8"
            />
            Backstage
          </h1>
          
          {/* Center Arrow Button - Temporary for Design */}

          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <AnimatedConnectWalletButton 
              onClick={onWalletConnect}
            />
            
            <AnimatedLoginButton 
              onClick={onLogin}
            />
          </div>
          
          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-50">
            <div className="px-6 py-4 space-y-4 bg-black/20 backdrop-blur-[40px] border border-white/10 rounded-b-xl">
              <div className="w-full">
                <AnimatedConnectWalletButton 
                  onClick={() => {
                    onWalletConnect();
                    setIsMobileMenuOpen(false);
                  }}
                />
              </div>
              
              <div className="w-full">
                <AnimatedLoginButton 
                  onClick={() => {
                    onLogin();
                    setIsMobileMenuOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <HeroBackground />
        <div className="relative z-10 max-w-4xl mx-auto">

          
          <div className="relative z-10">
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl font-semibold mb-8 bg-gradient-to-b from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight"
              style={{
                textShadow: '0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(255,255,255,0.1)',
                filter: 'drop-shadow(0 4px 20px rgba(255,255,255,0.2))'
              }}
            >
              AI-Powered<br />Productivity Platform
            </h1>
            
            <p 
              className="text-lg md:text-xl text-gray-300 mb-16 max-w-2xl mx-auto font-normal leading-relaxed"
              style={{
                textShadow: '0 0 20px rgba(255,255,255,0.2)',
                filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.8))'
              }}
            >
              Unlock your potential with cutting-edge AI tools designed for creators, entrepreneurs, and innovators.
            </p>
            
            <div className="relative flex justify-center">
              <CTAButton 
                onClick={onRequestAccess}
                variant="glassmorphism"
              >
                Get Access
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Heading */}
          <h2 className="text-3xl font-medium text-center mb-8 text-white">About Backstage</h2>
          
          {/* About Text */}
          <div className="text-left mb-12">
            <p className="text-[rgba(181,181,181,1)] leading-relaxed text-lg max-w-3xl mx-auto text-[12px] text-center">
              Backstage is your personal AI assistant hub, bringing together the most powerful tools 
              for content creation, automation, and productivity. Built for the modern creator who 
              demands efficiency without sacrificing quality.
            </p>
          </div>
          
          {/* Highlight Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Bot className="h-6 w-6 text-blue-400" />
                <span className="text-2xl font-semibold text-white">2+</span>
              </div>
              <p className="text-gray-300 font-medium">Powerful AI Tools</p>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Shield className="h-6 w-6 text-green-400" />
                <span className="text-2xl font-semibold text-white">100%</span>
              </div>
              <p className="text-gray-300 font-medium">Secure Access</p>
            </Card>
          </div>
          
          {/* Visual Icon Row */}

          
          {/* Separator */}
          <div className="flex justify-center">
            <Separator className="w-32 bg-white/20" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-medium text-center mb-8 text-[26px]">Intelligent Features</h2>
          
          {/* Section Description */}
          <div className="text-center mb-16">
            <p className="text-[rgba(181,181,181,1)] leading-relaxed max-w-2xl mx-auto text-[12px]">
              Discover a suite of AI-powered tools designed to amplify your creativity and streamline your workflow. Each feature is engineered with precision to deliver exceptional results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5 rounded-[12px] bg-[rgba(255,255,255,0.05)]">
              <div className="flex flex-col items-center md:items-start lg:items-start text-center md:text-left lg:text-left">
                <MessageSquare className="h-12 w-12 mb-6 text-blue-400" />
                <h3 className="text-xl font-medium mb-4 text-white">AI Chat</h3>
                <p className="text-[rgba(181,181,181,1)] text-[12px]">
                  Intelligent conversations powered by advanced AI models for research, brainstorming, and problem-solving.
                </p>
              </div>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5">
              <div className="flex flex-col items-center md:items-start lg:items-start text-center md:text-left lg:text-left">
                <Bot className="h-12 w-12 mb-6 text-green-400" />
                <h3 className="text-xl font-medium mb-4 text-white">AI Humanizer</h3>
                <p className="text-[rgba(181,181,181,1)] font-normal text-[12px]">
                  Transform AI-generated content into natural, human-like text with customizable tone and style.
                </p>
              </div>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5">
              <div className="flex flex-col items-center md:items-start lg:items-start text-center md:text-left lg:text-left">
                <Puzzle className="h-12 w-12 mb-6 text-purple-400" />
                <h3 className="text-xl font-medium mb-4 text-white">Modular Tools</h3>
                <p className="text-[rgba(181,181,181,1)] text-[12px]">
                  Expandable toolkit with crypto analytics, productivity suites, and research assistants coming soon.
                </p>
              </div>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5">
              <div className="flex flex-col items-center md:items-start lg:items-start text-center md:text-left lg:text-left">
                <Shield className="h-12 w-12 mb-6 text-orange-400" />
                <h3 className="text-xl font-medium mb-4 text-white">Secure Access</h3>
                <p className="text-[rgba(181,181,181,1)] text-[12px]">
                  Admin-approved access control ensures your workspace remains private and secure.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5 cursor-pointer">
              <Instagram className="h-8 w-8 mx-auto mb-3 text-pink-400" />
              <p className="text-white font-medium text-[12px]">Instagram</p>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5 cursor-pointer">
              <Twitter className="h-8 w-8 mx-auto mb-3 text-blue-400" />
              <p className="text-white font-medium text-[12px]">Twitter</p>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5 cursor-pointer">
              <Youtube className="h-8 w-8 mx-auto mb-3 text-red-400" />
              <p className="text-white font-medium text-[12px]">YouTube</p>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5 cursor-pointer">
              <Music className="h-8 w-8 mx-auto mb-3 text-green-400" />
              <p className="text-white font-medium text-[12px]">TikTok</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white text-sm mb-4">© 2025 Backstage. All rights reserved.</p>
          <div className="space-x-6">
            <button className="text-[rgba(181,181,181,1)] hover:text-white active:text-white transition-colors text-sm no-underline">
              Terms of use
            </button>
            <button className="text-[rgba(181,181,181,1)] hover:text-white active:text-white transition-colors text-sm no-underline">
              Privacy
            </button>

          </div>
        </div>
      </footer>
    </div>
  );
}