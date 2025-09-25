import React, { useState } from "react";
import { Plus, Mic, AudioLines, ArrowUp } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function SearchBar({ onSearch, placeholder = "Ask anything", className = "", disabled = false }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !disabled) {
      onSearch(query.trim());
      setQuery("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="sticky bottom-0 relative flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-4 hover:bg-white/10 transition-colors">
        {/* Plus Icon */}
        <Plus className="h-5 w-5 text-white/70 mr-4 flex-shrink-0" />
        
        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={disabled ? "Please wait..." : placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent text-white placeholder:text-white/50 outline-none border-none disabled:opacity-50"
        />
        
        {/* Right Icons */}
        <div className="flex items-center gap-3 ml-4">

          
          <button
            type="button"
            disabled={disabled}
            className="p-3 bg-white rounded-full transition-colors text-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              // Always send message when button is clicked
              if (!disabled) {
                handleSubmit(e);
              }
            }}
          >
            {disabled ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
            ) : query.trim() ? (
              <ArrowUp className="h-5 w-5 text-black" />
            ) : (
              <AudioLines className="h-5 w-5 text-black" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}