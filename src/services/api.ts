const API_BASE_URL = 'http://localhost:3001/api';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Conversation {
  _id: string;
  title: string;
  messages: Message[];
  lastActivity: Date;
  archived: boolean;
}

interface SendMessageResponse {
  conversationId: string;
  userMessage: Message;
  aiMessage: Message;
  conversation: {
    id: string;
    title: string;
    lastActivity: Date;
  };
}

interface HumanizeResponse {
  originalText: string;
  humanizedText: string;
  tone: string;
  processedAt: Date;
  historyId: string;
}

class ApiService {
  private async fetchWithErrorHandling(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Chat API methods
  async sendMessage(message: string, conversationId?: string): Promise<SendMessageResponse> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/chat/send-message`, {
      method: 'POST',
      body: JSON.stringify({ message, conversationId }),
    });
  }

  async getConversations(): Promise<Conversation[]> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/chat/conversations`);
  }

  async getConversation(id: string): Promise<Conversation> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/chat/conversations/${id}`);
  }

  async createConversation(title: string, messages: Message[] = []): Promise<Conversation> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/chat/conversations`, {
      method: 'POST',
      body: JSON.stringify({ title, messages }),
    });
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/chat/conversations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteConversation(id: string): Promise<{ message: string }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/chat/conversations/${id}`, {
      method: 'DELETE',
    });
  }

  async archiveConversation(id: string): Promise<Conversation> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/chat/conversations/${id}/archive`, {
      method: 'PUT',
    });
  }

  // Humanizer API methods
  async humanizeText(text: string, tone: string): Promise<HumanizeResponse> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/humanizer/humanize`, {
      method: 'POST',
      body: JSON.stringify({ text, tone }),
    });
  }

  async getHumanizerHistory(limit: number = 50): Promise<any[]> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/humanizer/history?limit=${limit}`);
  }

  async deleteHumanizerHistoryItem(id: string): Promise<{ message: string }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/humanizer/history/${id}`, {
      method: 'DELETE',
    });
  }

  async clearHumanizerHistory(): Promise<{ message: string }> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/humanizer/history`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export type { Message, Conversation, SendMessageResponse, HumanizeResponse };
