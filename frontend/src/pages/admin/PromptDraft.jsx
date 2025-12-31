import React, { useState } from 'react';
import { Textarea } from "@chakra-ui/react";
import { POST, ENTER, UNKNOWN_ERROR, PROMPT_PLACEHOLDER, EDIT, DASHBOARD } from "../../components/config/strings.jsx";
import { SubmitPromptButton, BackToDashboard } from '../../components/Buttons.jsx';
import SpinnerOverlay from '../../components/SpinnerOverlay.jsx';

const SERVER_URL = process.env.REACT_APP_SERVER_URL
const ONTOPO_URL = process.env.REACT_APP_ONTOPO_URL

export const sendPrompt = async (prompt) => {
  const _startTime = Date.now(); // TIME start

  const res = await fetch(`${SERVER_URL}/agent/draft`, {
    method: POST,
    headers: { "Content-Type": "text/plain" },
    body: prompt
  });

  const event = await res.json();

  console.log("[TIME]", Date.now() - _startTime, "ms"); // TIME end

  if (!res.ok) {
    throw new Error(event.error || UNKNOWN_ERROR);
  }

  console.log(event);
  return event;
};

export default function PromptDraft({ placeholder = PROMPT_PLACEHOLDER, handleClick }) {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) 
        {  
            return;
        }
         
        try {
            setLoading(true)
            window.open(`${ONTOPO_URL}`, '_blank');
            const { event } = await sendPrompt(prompt);
            setPrompt('');
            // Switch to ADD mode and pass the generated draft
            handleClick(EDIT, event)();
            }
        catch (err) {
            console.error('Draft generation error:', err);
        }
        finally{
            setLoading(false)
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === ENTER && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };
    
    return (
        <div>
        <SpinnerOverlay isLoading={isLoading} />
        <form onSubmit={handleSubmit} className="min-h-screen flex items-center justify-center">
            <div className="relative flex items-end gap-2 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 w-full max-w-xl md:max-w-3xl lg:max-w-4xl">
            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                <BackToDashboard handleClick={handleClick(DASHBOARD, undefined)} />
            </div>
            <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={isLoading}
                borderWidth={"thick"}
                borderRadius={"1rem"}
                className="min-h-[64px] md:min-h-[100px] max-h-[400px] resize-none bg-transparent pl-1rem pr-12 py-4 px-4 text-base md:text-lg placeholder:text-slate-400"
                rows={1}
            />
            <SubmitPromptButton prompt={prompt} isLoading={isLoading} />
            </div>
        </form>
        </div>
        );
}