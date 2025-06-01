import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Bot, User, Clock, Search, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { cn } from '../lib/utils';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const AIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello! I'm your AI assistant. I can help you explore your past activities and find insights from your life entries. Try asking me questions like:

• "When did I start working on Project X?"
• "Show me my mood patterns from last month"
• "What were my main activities in March?"
• "When was I most productive recently?"

What would you like to know about your entries?`,
      timestamp: new Date().toISOString()
    }
  ]);

  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "When did I last have a client presentation?",
    "What projects did I work on this month?",
    "Show me my mood patterns over time",
    "What were my most productive days?",
    "When did I mention feeling stressed?",
    "What meetings have I had recently?"
  ];

  // Click outside to close chat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (question: string) => {
    // Simple response generation based on keywords
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('client presentation') || lowerQuestion.includes('presentation')) {
      return `Based on your entries, you had a client presentation on May 25, 2024. This was part of a productive day where you also had a team standup meeting. You noted feeling motivated about the upcoming project launch afterward.`;
    }
    
    if (lowerQuestion.includes('mood') || lowerQuestion.includes('feeling')) {
      return `Looking at your mood patterns, you've been trending toward "productive" emotions recently. On May 25th, you recorded feeling productive and motivated. I can see a positive correlation between your productive moods and days with client interactions.`;
    }
    
    if (lowerQuestion.includes('project') || lowerQuestion.includes('work')) {
      return `Your recent project activity includes working on a project proposal that you completed on May 25, 2024. You also mentioned reviewing code changes. Your notes indicate strong motivation for an upcoming project launch.`;
    }
    
    if (lowerQuestion.includes('stress') || lowerQuestion.includes('tired')) {
      return `I haven't found many entries where you mentioned feeling stressed or tired recently. Your latest entries show mostly productive and positive moods. This suggests you've been managing your workload well.`;
    }
    
    return `I've searched through your entries and found some relevant information. Based on your question about "${question}", I can see patterns in your activities and moods. For more specific insights, you might want to ask about particular dates, projects, or feelings you'd like me to analyze.`;
  };

  const handleSuggestedQuestion = (question: string) => {
    setCurrentMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={chatContainerRef}>
      {/* Chat toggle button */}
      <Button
        onClick={toggleChat}
        className={cn(
          "rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300",
          !isOpen ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-white text-indigo-600 border border-indigo-200"
        )}
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </Button>

      {/* Floating chat container */}
      <div 
        className={cn(
          "absolute bottom-16 right-0 transform transition-all duration-300 ease-in-out origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none",
          isExpanded ? "w-[550px]" : "w-[350px]"
        )}
      >
        <Card className="overflow-hidden shadow-xl border-gray-200 rounded-2xl">
          {/* Chat header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-4 text-white flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="w-5 h-5 mr-2" />
              <h2 className="font-semibold">AI Assistant</h2>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={toggleExpand} 
                className="text-white/80 hover:text-white transition"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Chat body */}
          <div className={cn("flex flex-col", isExpanded ? "h-[500px]" : "h-[400px]")}>
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-indigo-100 ml-2' : 'bg-gray-100 mr-2'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-3.5 h-3.5 text-indigo-600" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-gray-600" />
                      )}
                    </div>
                    <div className={`rounded-xl p-3 ${
                      message.type === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <div className={`text-xs mt-1 flex items-center ${
                        message.type === 'user' ? 'text-indigo-200' : 'text-gray-500'
                      }`}>
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex max-w-[85%]">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-gray-100 mr-2">
                      <Bot className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 text-gray-900 rounded-xl p-3">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested questions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <Search className="w-3 h-3 mr-1" />
                  <span>Suggested Questions</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 flex-wrap">
                  {suggestedQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="text-left px-3 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 rounded-full transition-colors whitespace-nowrap"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="border-t border-gray-200 p-3">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask me anything..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3"
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AIChat;
