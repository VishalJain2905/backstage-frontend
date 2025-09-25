import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { ArrowLeft, Send, MessageSquare, Paperclip, Menu, X, PanelLeft, Plus, Search, Pencil, MoreHorizontal, Share, Edit, Archive, Trash2 } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { apiService, type Message, type Conversation } from "../services/api";

interface AIChatProps {
  onBack: () => void;
}

interface MessageWithId extends Message {
  id: string;
}

export function AIChat({ onBack }: AIChatProps) {
  const [messages, setMessages] = useState<MessageWithId[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isMobileChatListOpen, setIsMobileChatListOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Handle file upload logic here
      console.log('Files selected:', files);
      // You can process the files here or add them to messages
    }
  };

  const handleSendMessage = async (query: string) => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: MessageWithId = {
      id: Date.now().toString(),
      text: query,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Send message to API
      const response = await apiService.sendMessage(query, currentConversationId || undefined);
      
      // Add AI response
      const aiMessage: MessageWithId = {
      id: (Date.now() + 1).toString(),
        text: response.aiMessage.text,
      sender: 'ai',
        timestamp: new Date(response.aiMessage.timestamp)
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update current conversation ID if it's a new conversation
      if (!currentConversationId) {
        setCurrentConversationId(response.conversationId);
      }

      // Refresh conversations list
      loadConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please try again.');
      
      // Remove the user message if API call failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Load conversations from API
  const loadConversations = async () => {
    try {
      const fetchedConversations = await apiService.getConversations();
      setConversations(fetchedConversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  // Load a specific conversation
  const loadConversation = async (conversationId: string) => {
    try {
      const conversation = await apiService.getConversation(conversationId);
      const messagesWithIds: MessageWithId[] = conversation.messages.map((msg, index) => ({
        ...msg,
        id: `${conversationId}-${index}`,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(messagesWithIds);
      setCurrentConversationId(conversationId);
    } catch (error) {
      console.error('Failed to load conversation:', error);
      setError('Failed to load conversation.');
    }
  };

  const handleNewChat = () => {
    // Reset messages to start a new conversation
    setMessages([
      {
        id: '1',
        text: 'Hello! I\'m your AI assistant. How can I help you today?',
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
    setCurrentConversationId(null);
    setError(null);
  };

  const handleArchiveConversation = async (conversationId: string) => {
    try {
      await apiService.archiveConversation(conversationId);
      loadConversations(); // Refresh the list
      if (currentConversationId === conversationId) {
        handleNewChat(); // Start new chat if archived conversation was active
      }
    } catch (error) {
      console.error('Failed to archive conversation:', error);
      setError('Failed to archive conversation.');
    }
    setOpenMenu(null);
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return;
    }
    
    try {
      await apiService.deleteConversation(conversationId);
      loadConversations(); // Refresh the list
      if (currentConversationId === conversationId) {
        handleNewChat(); // Start new chat if deleted conversation was active
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      setError('Failed to delete conversation.');
    }
    setOpenMenu(null);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenu(null);
    };

    if (openMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenu]);

  return (
    <div className="min-h-screen bg-[#212121] flex">
      {/* Mobile Chat List Overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ease-in-out ${isMobileChatListOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileChatListOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-80 bg-black/30 backdrop-blur-[24px] border-l border-white/20 shadow-lg rounded-[20px] bg-[rgba(0,0,0,0.8)] transition-transform duration-300 ease-in-out ${isMobileChatListOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 border-b border-white/20 w-80">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white">Conversations</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileChatListOpen(false)}
                className="!text-white hover:!text-white focus:!text-white active:!text-white hover:bg-white/10"
              >
                <X className="h-4 w-4 !text-white hover:!text-white focus:!text-white active:!text-white" />
              </Button>
            </div>
            
            {/* New Chat Button */}
            <Button 
              onClick={handleNewChat}
              className="w-full mb-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 justify-start gap-2"
              variant="outline"
            >
              <Pencil className="h-4 w-4" />
              New Chat
            </Button>
            
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
              />
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="p-4 w-80">
              {/* Chats Section */}
              <div>
                <h4 className="text-xs text-white/50 mb-3 px-2">Chats</h4>

                {filteredConversations.map((conversation) => (
                  <div key={conversation._id} className="relative group">
                  <div className="p-2 px-3 mb-1 cursor-pointer hover:bg-white/5 hover:border-white/20 transition-colors rounded-lg bg-[rgba(37,37,37,0)] border border-transparent flex items-center justify-between"
                         onClick={() => {
                           loadConversation(conversation._id);
                           setIsMobileChatListOpen(false);
                         }}>
                      <h4 className="text-sm text-white truncate">{conversation.title}</h4>
                    <button 
                      className="opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                          setOpenMenu(openMenu === `mobile-${conversation._id}` ? null : `mobile-${conversation._id}`);
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4 text-white/70" />
                    </button>
                  </div>
                    {openMenu === `mobile-${conversation._id}` && (
                    <div className="absolute right-2 top-12 z-50 bg-[#2a2a2a] border border-white/20 rounded-xl p-2 min-w-[160px] shadow-xl">
                      <div className="space-y-1">
                        <button className="w-full flex items-center gap-3 p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Share className="w-4 h-4" />
                          Share
                        </button>
                        <button className="w-full flex items-center gap-3 p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                          Rename
                        </button>
                        <div className="h-px bg-white/10 my-1"></div>
                          <button 
                            className="w-full flex items-center gap-3 p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
                            onClick={() => handleArchiveConversation(conversation._id)}
                          >
                          <Archive className="w-4 h-4" />
                          Archive
                        </button>
                          <button 
                            className="w-full flex items-center gap-3 p-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            onClick={() => handleDeleteConversation(conversation._id)}
                          >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                ))}

                {filteredConversations.length === 0 && (
                  <div className="text-center text-white/50 py-8">
                    <p>No conversations yet.</p>
                    <p className="text-sm">Start a new chat to begin!</p>
                  </div>
                )}

                <div className="relative group">
                  <div className="p-2 px-3 mb-1 cursor-pointer hover:bg-white/5 hover:border-white/20 transition-colors rounded-lg border border-transparent flex items-center justify-between"
                       onClick={() => setIsMobileChatListOpen(false)}>
                    <h4 className="text-sm text-white">Write a song</h4>
                    <button 
                      className="opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === 'mobile-song' ? null : 'mobile-song');
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4 text-white/70" />
                    </button>
                  </div>
                  {openMenu === 'mobile-song' && (
                    <div className="absolute right-2 top-12 z-50 bg-[#2a2a2a] border border-white/20 rounded-xl p-2 min-w-[160px] shadow-xl">
                      <div className="space-y-1">
                        <button className="w-full flex items-center gap-3 p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Share className="w-4 h-4" />
                          Share
                        </button>
                        <button className="w-full flex items-center gap-3 p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                          Rename
                        </button>
                        <div className="h-px bg-white/10 my-1"></div>
                        <button className="w-full flex items-center gap-3 p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Archive className="w-4 h-4" />
                          Archive
                        </button>
                        <button className="w-full flex items-center gap-3 p-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative group">
                  <div className="p-2 px-3 mb-1 cursor-pointer hover:bg-white/5 hover:border-white/20 transition-colors rounded-lg border border-transparent flex items-center justify-between"
                       onClick={() => setIsMobileChatListOpen(false)}>
                    <h4 className="text-sm text-white">Marketing Strategy</h4>
                    <button 
                      className="opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === 'mobile-marketing' ? null : 'mobile-marketing');
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4 text-white/70" />
                    </button>
                  </div>
                  {openMenu === 'mobile-marketing' && (
                    <div className="absolute right-2 top-12 z-50 bg-[#2a2a2a] border border-white/20 rounded-xl p-2 min-w-[160px] shadow-xl">
                      <div className="space-y-1">
                        <button className="w-full flex items-center gap-3 p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Share className="w-4 h-4" />
                          Share
                        </button>
                        <button className="w-full flex items-center gap-3 p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                          Rename
                        </button>
                        <div className="h-px bg-white/10 my-1"></div>
                        <button className="w-full flex items-center gap-3 p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Archive className="w-4 h-4" />
                          Archive
                        </button>
                        <button className="w-full flex items-center gap-3 p-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative group">
                  <div className="p-2 px-3 mb-1 cursor-pointer hover:bg-white/5 hover:border-white/20 transition-colors rounded-lg border border-transparent flex items-center justify-between"
                       onClick={() => setIsMobileChatListOpen(false)}>
                    <h4 className="text-sm text-white">Bug Analysis</h4>
                    <button 
                      className="opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === 'mobile-bug' ? null : 'mobile-bug');
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4 text-white/70" />
                    </button>
                  </div>
                  {openMenu === 'mobile-bug' && (
                    <div className="absolute right-2 top-12 z-50 bg-[#2a2a2a] border border-white/20 rounded-xl p-2 min-w-[160px] shadow-xl">
                      <div className="space-y-1">
                        <button className="w-full flex items-center gap-3 p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Share className="w-4 h-4" />
                          Share
                        </button>
                        <button className="w-full flex items-center gap-3 p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                          Rename
                        </button>
                        <div className="h-px bg-white/10 my-1"></div>
                        <button className="w-full flex items-center gap-3 p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Archive className="w-4 h-4" />
                          Archive
                        </button>
                        <button className="w-full flex items-center gap-3 p-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative group">
                  <div className="p-2 px-3 mb-1 cursor-pointer hover:bg-white/5 hover:border-white/20 transition-colors rounded-lg border border-transparent flex items-center justify-between"
                       onClick={() => setIsMobileChatListOpen(false)}>
                    <h4 className="text-sm text-white">Data Visualization</h4>
                    <button 
                      className="opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === 'mobile-data' ? null : 'mobile-data');
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4 text-white/70" />
                    </button>
                  </div>
                  {openMenu === 'mobile-data' && (
                    <div className="absolute right-2 top-12 z-50 bg-[#2a2a2a] border border-white/20 rounded-xl p-2 min-w-[160px] shadow-xl">
                      <div className="space-y-1">
                        <button className="w-full flex items-center gap-3 p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Share className="w-4 h-4" />
                          Share
                        </button>
                        <button className="w-full flex items-center gap-3 p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                          Rename
                        </button>
                        <div className="h-px bg-white/10 my-1"></div>
                        <button className="w-full flex items-center gap-3 p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Archive className="w-4 h-4" />
                          Archive
                        </button>
                        <button className="w-full flex items-center gap-3 p-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Sidebar - Conversation History */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-16'} border-r border-white/20 bg-[#181818] hidden lg:block transition-all duration-300 ease-in-out rounded-r-[20px]`}>
        {isSidebarOpen ? (
          // Full Sidebar
          <>
            <div className="p-4 border-b border-white/20 w-80">
              <div className="flex justify-between items-center mb-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:text-white hover:bg-[#474747]">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white hover:text-white hover:bg-[#474747]">
                  <PanelLeft className="h-4 w-4 scale-x-[-1]" />
                </Button>
              </div>
              
              {/* New Chat Button */}
              <Button 
                onClick={handleNewChat}
                className="w-full mb-4 bg-white hover:!bg-gray-300 text-black border border-white justify-start gap-2 transition-colors duration-200 ease-in-out"
                variant="outline"
              >
                <Pencil className="h-4 w-4" />
                New Chat
              </Button>
              
              {/* Search Input */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Chats"
                  className="pl-10 bg-white/10 hover:bg-white/20 text-white border border-white/20 placeholder:text-white/50 focus:bg-white/20 transition-none transform-none"
                />
              </div>
            </div>
            
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="p-4 w-80">
                {/* Chats Section */}
                <div>
                  <h4 className="text-xs text-white/50 mb-3 px-2">Chats</h4>

                  {filteredConversations.map((conversation) => (
                    <div key={conversation._id} className="relative group">
                      <div className="p-2 px-3 mb-1 cursor-pointer hover:bg-white/5 hover:border-white/20 transition-colors rounded-lg bg-[rgba(37,37,37,0)] border border-transparent flex items-center justify-between"
                           onClick={() => loadConversation(conversation._id)}>
                        <h4 className="text-sm text-white truncate">{conversation.title}</h4>
                      <button 
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                            setOpenMenu(openMenu === `desktop-${conversation._id}` ? null : `desktop-${conversation._id}`);
                        }}
                      >
                        <MoreHorizontal className="w-4 h-4 text-white/70" />
                      </button>
                    </div>
                      {openMenu === `desktop-${conversation._id}` && (
                      <div className="absolute right-2 top-12 z-50 bg-[#2a2a2a] border border-white/20 rounded-xl p-2 min-w-[160px] shadow-xl">
                        <div className="space-y-1">
                          <button className="w-full flex items-center gap-3 p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors">
                            <Share className="w-4 h-4" />
                            Share
                          </button>
                          <button className="w-full flex items-center gap-3 p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                            Rename
                          </button>
                          <div className="h-px bg-white/10 my-1"></div>
                      <button 
                              className="w-full flex items-center gap-3 p-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
                              onClick={() => handleArchiveConversation(conversation._id)}
                            >
                            <Archive className="w-4 h-4" />
                            Archive
                          </button>
                      <button 
                              className="w-full flex items-center gap-3 p-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              onClick={() => handleDeleteConversation(conversation._id)}
                            >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  ))}

                  {filteredConversations.length === 0 && (
                    <div className="text-center text-white/50 py-8">
                      <p>No conversations yet.</p>
                      <p className="text-sm">Start a new chat to begin!</p>
                      </div>
                    )}

                </div>
              </div>
            </ScrollArea>
          </>
        ) : (
          // Collapsed Sidebar
          <div className="flex flex-col items-center p-4 h-full">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white hover:text-white hover:bg-[#474747] mb-4">
              <PanelLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNewChat} className="text-white hover:text-white hover:bg-[#474747] mb-4" title="New Chat">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white hover:text-white hover:bg-[#474747]" title="Search Conversations">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-white/20 bg-[#212121] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:text-white hover:bg-[#474747] lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-white text-[16px]">Chat Assistant</h1>
              <p className="text-white/50 text-sm">Ask me anything</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileChatListOpen(true)}
            className="text-white hover:text-white hover:bg-[#474747] lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <Card className={`max-w-[80%] p-4 ${
                  message.sender === 'user' 
                    ? 'bg-white text-black border-gray-200' 
                    : 'bg-white/5 text-white border-white/10'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <div className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-gray-500' : 'text-white/50'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </Card>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <Card className="max-w-[80%] p-4 bg-white/5 text-white border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <p className="text-sm">AI is thinking...</p>
                  </div>
                </Card>
              </div>
            )}
            
            {error && (
              <div className="flex justify-center">
                <Card className="max-w-[80%] p-4 bg-red-500/10 text-red-400 border-red-500/20">
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
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-[#212121] p-4">
          <div className="max-w-4xl mx-auto">
            <SearchBar onSearch={handleSendMessage} placeholder="Type your message..." disabled={isLoading} />
            
            {/* File Upload Area */}

          </div>
        </div>
      </div>
    </div>
  );
}