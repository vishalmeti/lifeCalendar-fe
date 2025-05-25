
import { useState } from 'react';
import { Send, MessageCircle, Bot, User, Clock, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';

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

  const suggestedQuestions = [
    "When did I last have a client presentation?",
    "What projects did I work on this month?",
    "Show me my mood patterns over time",
    "What were my most productive days?",
    "When did I mention feeling stressed?",
    "What meetings have I had recently?"
  ];

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Assistant</h1>
        <p className="text-gray-600">Ask questions about your past activities and get AI-powered insights</p>
      </div>

      {/* Suggested Questions */}
      <Card className="mb-6 border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center">
            <Search className="w-4 h-4 mr-2" />
            Suggested Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-left p-3 text-sm bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <div className="bg-white rounded-lg border border-gray-200 h-96 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-indigo-100 ml-2' : 'bg-gray-100 mr-2'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <div className={`text-xs mt-2 flex items-center ${
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
              <div className="flex max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 mr-2">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-gray-100 text-gray-900 rounded-lg p-3">
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

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Ask me about your past activities..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
