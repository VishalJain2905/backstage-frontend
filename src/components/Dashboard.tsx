import image_c38fe21dfd6a374404a0ce74c819355ff0126c33 from 'figma:asset/c38fe21dfd6a374404a0ce74c819355ff0126c33.png';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { 
  MessageSquare, 
  Bot, 
  Settings, 
  LogOut, 
  Coins, 
  ClipboardList, 
  Search,
  Plus
} from "lucide-react";

interface DashboardProps {
  onLogout: () => void;
  onOpenTool: (tool: string) => void;
}

const tools = [
  {
    id: 'ai-chat',
    title: 'AI Chat',
    description: 'Intelligent conversation assistant',
    icon: MessageSquare,
    available: true,
    color: '#50A2FF'
  },
  {
    id: 'ai-humanizer',
    title: 'AI Humanizer',
    description: 'Make AI text sound more natural',
    icon: Bot,
    available: true,
    color: '#06DF73'
  },
  {
    id: 'crypto-tools',
    title: 'Crypto Tools',
    description: 'Coming soon',
    icon: Coins,
    available: false,
    color: '#FFB800'
  },
  {
    id: 'productivity',
    title: 'Productivity Suite',
    description: 'Coming soon',
    icon: ClipboardList,
    available: false,
    color: '#9B59B6'
  },
  {
    id: 'research',
    title: 'Research Assistant',
    description: 'Coming soon',
    icon: Search,
    available: false,
    color: '#E74C3C'
  },
  {
    id: 'placeholder',
    title: 'New Tool',
    description: 'More tools coming soon',
    icon: Plus,
    available: false,
    color: '#34495E'
  }
];

export function Dashboard({ onLogout, onOpenTool }: DashboardProps) {
  return (
    <div className="min-h-screen bg-[rgba(0,0,0,1)] text-white">
      {/* Top Navigation */}
      <header className="border-b border-white/10 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="flex items-center gap-3 text-xl font-medium font-[Geist] text-white text-[20px]">
            <img 
              src={image_c38fe21dfd6a374404a0ce74c819355ff0126c33} 
              alt="Backstage Logo" 
              className="w-8 h-8"
            />
            Backstage
          </h1>
          
          <div className="flex items-center gap-5">
            <Avatar className="h-10 w-10 border border-transparent hover:border-[#8B8B8B] transition-all duration-200 cursor-pointer">
              <AvatarFallback className="bg-[#0169CC] text-white">HS</AvatarFallback>
            </Avatar>
            
            <Button 
              variant="ghost" 
              className="h-10 w-10 rounded-lg !text-white bg-white/10 hover:bg-[#474747] active:!text-white focus:!text-white [&>*]:!text-white transition-all duration-200 text-[14px] no-underline"
            >
              <Settings className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className="h-10 w-10 rounded-lg !text-white bg-white/10 hover:bg-[#474747] active:!text-white focus:!text-white [&>*]:!text-white [&>*]:active:!text-white transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-medium mb-2 text-white">Your Tools</h2>
          <p className="text-gray-300">
            Access your AI-powered productivity tools
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card 
                key={tool.id}
                className={`p-6 backdrop-blur-md border transition-all duration-300 ${
                  tool.id === 'ai-chat' || tool.id === 'ai-humanizer' 
                    ? 'bg-white/8 border-[#575757] shadow-xl shadow-white/5' 
                    : 'bg-white/5 border-white/15'
                } ${
                  tool.available 
                    ? 'hover:bg-white/10 cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-white/5' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => tool.available && onOpenTool(tool.id)}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className={`p-3 rounded-lg ${
                      tool.available 
                        ? 'bg-[#252525]' 
                        : 'bg-white/20 text-gray-400'
                    }`}
                    style={tool.available ? { color: tool.color } : undefined}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium mb-2 text-white">{tool.title}</h3>
                    <p className="text-sm text-gray-300">
                      {tool.id === 'ai-chat' ? 'Smart AI assistant for real-time conversations, brainstorming, and quick answers' : tool.id === 'ai-humanizer' ? 'Refine AI text into natural, human-like writing with adaptable tone and style' : tool.id === 'crypto-tools' ? 'Advanced analytics and track crypto assets' : tool.id === 'productivity' ? 'Organize tasks and boost workflow efficiency' : tool.id === 'research' ? 'Get AI-powered research insights quickly' : tool.id === 'placeholder' ? 'Stay tuned for upcoming AI-powered features' : tool.description}
                    </p>
                    
                    {!tool.available && (
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-white/10 text-xs text-gray-400">
                          Coming Soon
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}