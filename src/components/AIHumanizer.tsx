import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft, Copy, Bot, Check } from "lucide-react";
import { apiService } from "../services/api";

interface AIHumanizerProps {
  onBack: () => void;
}

export function AIHumanizer({ onBack }: AIHumanizerProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedTone, setSelectedTone] = useState('casual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleHumanize = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await apiService.humanizeText(inputText, selectedTone);
      setOutputText(response.humanizedText);
    } catch (error) {
      console.error('Failed to humanize text:', error);
      setError('Failed to humanize text. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    
    try {
      await navigator.clipboard.writeText(outputText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/10 p-4 bg-[#212121] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:text-white hover:bg-white/10 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-white text-[16px]">AI Humanizer</h1>
            <p className="text-[rgba(255,255,255,0.5)] mt-1 text-[12px]">Transform AI-generated content into natural, human-like text</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8 relative">
        <div className="mb-8">
        </div>

        {/* Style Selection */}
        <div className="mb-8">
          <label className="text-white mb-4 block">Writing Style</label>
          <Select value={selectedTone} onValueChange={setSelectedTone}>
            <SelectTrigger className="w-60 bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white/5 backdrop-blur-xl border border-white/10">
              <SelectItem value="casual" className="text-white hover:bg-white/10">Casual</SelectItem>
              <SelectItem value="professional" className="text-white hover:bg-white/10">Professional</SelectItem>
              <SelectItem value="friendly" className="text-white hover:bg-white/10">Friendly</SelectItem>
              <SelectItem value="formal" className="text-white hover:bg-white/10">Formal</SelectItem>
              <SelectItem value="conversational" className="text-white hover:bg-white/10">Conversational</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <Card className="p-4 bg-red-500/10 text-red-400 border-red-500/20">
              <p className="text-sm">{error}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setError(null)}
                className="mt-2 text-red-400 hover:text-red-300"
              >
                Dismiss
              </Button>
            </Card>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Column */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div className="mb-6">
              <h3 className="mb-3 text-white">AI-Generated Text</h3>
              <p className="text-[rgba(255,255,255,0.5)]">
                Paste your AI-generated content here for humanization
              </p>
            </div>
            
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your AI-generated text here..."
              className="min-h-[350px] bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-white/50 resize-none hover:bg-white/10 focus:bg-white/10 transition-colors"
            />
            
            <div className="mt-6 flex justify-between items-center">
              <span className="text-white/60">
                {inputText.length} characters
              </span>
              <Button 
                onClick={handleHumanize}
                disabled={!inputText.trim() || isProcessing}
                className="min-w-[120px] bg-white text-black hover:bg-gray-200 transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Humanize'}
              </Button>
            </div>
          </div>

          {/* Output Column */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div className="mb-6">
              <h3 className="mb-3 text-white">Humanized Text</h3>
              <p className="text-[rgba(255,255,255,0.5)]">
                Your natural, human-like content appears here
              </p>
            </div>
            
            <Textarea
              value={outputText}
              readOnly
              placeholder="Humanized text will appear here..."
              className="min-h-[350px] bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-white/50 resize-none"
            />
            
            <div className="mt-6 flex justify-between items-center">
              <span className="text-white/60">
                {outputText.length} characters
              </span>
              <Button 
                onClick={handleCopy}
                disabled={!outputText}
                variant="outline"
                className="min-w-[120px] border-white/20 text-white bg-white/10"
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h4 className="mb-4 text-white">Tips for Best Results</h4>
          <ul className="text-gray-400 space-y-2">
            <li>• Choose the appropriate tone for your target audience</li>
            <li>• Longer texts generally produce better humanization results</li>
            <li>• Review and edit the output to match your specific voice and style</li>
            <li>• Use different writing styles for different types of content</li>
          </ul>
        </div>
      </div>
    </div>
  );
}