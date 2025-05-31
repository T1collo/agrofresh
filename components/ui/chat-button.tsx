'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from 'lucide-react'

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-green-600 text-white rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">Farm Grow Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-green-700 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-gray-100 rounded-lg p-3 max-w-[80%] mb-4">
              <p className="text-sm text-gray-700">
                👋 Hello! I'm your Farm Grow assistant. How can I help you today?
              </p>
            </div>
            {/* Messages will be added here when we integrate the AI */}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled
              />
              <Button
                className="bg-green-600 hover:bg-green-700"
                disabled
              >
                Send
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              AI Assistant coming soon!
            </p>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-lg flex items-center justify-center"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </Button>
    </div>
  )
} 