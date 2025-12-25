import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button, Textarea } from "@chakra-ui/react";

export default function ChatInput({ onSend, isLoading = false, placeholder = "Message..." }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            onSend(message.trim());
            setMessage('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="relative flex items-end gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={isLoading}
                    className="min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pr-12 py-3 px-4 text-sm placeholder:text-slate-400"
                    rows={1}
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={!message.trim() || isLoading}
                    className="absolute right-2 bottom-2 h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 transition-all duration-200"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </Button>
            </div>
            <p className="text-xs text-center text-slate-400 mt-2">
                Press Enter to send, Shift + Enter for new line
            </p>
        </form>
    );
}