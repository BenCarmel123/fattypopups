import React, { useState } from 'react';
import { Textarea } from "@chakra-ui/react";
import { POST, ENTER, UNKNOWN_ERROR, PROMPT_PLACEHOLDER } from "../../components/config/strings.jsx";
import { SubmitPromptButton } from '../../components/Buttons.jsx';

const SERVER_URL = process.env.REACT_APP_SERVER_URL

export const sendPrompt = async (prompt) => {
  const res = await fetch(`${SERVER_URL}/agent/draft`, {
    method: POST,
    headers: { "Content-Type": "text/plain" },
    body: prompt
  });

  const draft = await res.json();

  if (!res.ok) {
    throw new Error(draft.error || UNKNOWN_ERROR);
  }

  console.log(draft);

};

export default function PromptDraft({ isLoading = false, placeholder = PROMPT_PLACEHOLDER }) {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            sendPrompt(prompt)
            setPrompt('');
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
        <form onSubmit={handleSubmit} className="min-h-screen flex items-center justify-center px-4">
                <div className="relative flex items-end gap-2 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 w-full max-w-xl md:max-w-3xl lg:max-w-4xl">
                <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={isLoading}
                        className="min-h-[64px] md:min-h-[100px] max-h-[400px] resize-none bg-transparent pr-12 py-4 px-4 text-base md:text-lg placeholder:text-slate-400"
                    rows={1}
                />
                <SubmitPromptButton prompt={prompt} isLoading={isLoading}> </SubmitPromptButton>
            </div>
        </form>
        </div>
    );
}