"use client"
import React, { useState } from 'react';
import { Bot, Send, User } from 'lucide-react';

export function CopilotWidget() {
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([
    { role: 'bot', text: 'PolarOne Assistant active. Monitoring 3 ships and 3 stations.' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg, context: "command-center" })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'bot', text: 'Connection error to Copilot backend.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-primary text-primary-foreground p-3 flex items-center space-x-2 shrink-0">
        <Bot size={18} />
        <span className="font-semibold text-sm">AI Copilot</span>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50 text-sm">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-end space-x-1 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
              <div className={`p-1.5 rounded-full ${msg.role === 'user' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                {msg.role === 'user' ? <User size={14}/> : <Bot size={14}/>}
              </div>
              <div className={`px-3 py-2 rounded-lg max-w-[200px] break-words ${
                msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white border border-gray-200 rounded-bl-none text-gray-800'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500 text-xs">
            <Bot size={14} className="animate-pulse" />
            <span>Thinking...</span>
          </div>
        )}
      </div>

      <div className="p-3 border-t bg-white shrink-0">
        <div className="flex items-center space-x-2 relative">
          <input
            type="text"
            className="w-full text-sm border rounded-full pl-3 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Ask about ETA or assets..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-1 p-1.5 text-primary hover:bg-blue-50 rounded-full disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
