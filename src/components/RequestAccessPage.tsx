import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { AnimatedSuccessButton } from "./AnimatedSuccessButton";
import { ArrowLeft, Check, Lock, Eye, EyeOff, X, User, Mail, Building, MessageSquare } from "lucide-react";
import { useState } from "react";

interface RequestAccessPageProps {
  onBack: () => void;
}

export function RequestAccessPage({ onBack }: RequestAccessPageProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In a real app, this would submit to a backend
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 relative">
        <Card className="max-w-md w-full p-8 text-center bg-white/5 backdrop-blur-md border border-white/10 relative">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <AnimatedSuccessButton onComplete={() => {}} />
            </div>
            <h2 className="text-white text-2xl font-medium mb-3">Request Submitted!</h2>
            <p className="text-gray-300">
              We've received your access request. You'll hear from us within 24 hours.
            </p>
          </div>
          
          <Button 
            onClick={onBack} 
            variant="outline" 
            className="w-full border-white/20 text-black hover:bg-transparent hover:text-white hover:border-white transition-all duration-300"
          >
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 relative">
      <Card className="max-w-md w-full p-8 bg-white/5 backdrop-blur-md border border-[#999999] relative">
        {/* Cross Button - Inside Card */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 rounded-[20px]"
        >
          <X className="h-4 w-4" />
        </Button>
        
        {/* Header */}
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-medium text-white">Sign up with your account</h2>
        </div>

        <div className="mb-6">
          <p className="text-gray-300">
            Fill out this form to request access to Backstage. We'll review your application and get back to you soon.
          </p>
        </div>

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                required
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Set Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                required
                className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-white">Company/Organization</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="company"
                type="text"
                placeholder="Enter your company name"
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-white">Why do you need access?</Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="reason"
                placeholder="Tell us about your use case..."
                rows={4}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40 resize-none"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full py-6 bg-white text-black hover:bg-transparent hover:text-white hover:border-white border border-transparent transition-all duration-300 rounded-[100px]"
          >
            Submit Request
          </Button>
        </form>
      </Card>
    </div>
  );
}