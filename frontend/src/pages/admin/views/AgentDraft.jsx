import React, { useState } from 'react';
import { Textarea } from "@chakra-ui/react";
import { transformDraftToFormData } from '../utils/form.js';
import FileUpload, { ContextFileUpload } from '../../../components/FileUpload.jsx';
import * as Config from 'config/index.jsx';
import { SubmitPromptButton, BackToDashboard } from 'components/Buttons.jsx';
import SpinnerOverlay from 'components/SpinnerOverlay.jsx';

const SERVER_URL = process.env.REACT_APP_SERVER_URL

export const sendPrompt = async (prompt, file, contextFile) => {
  const _startTime = Date.now(); // TIME start

  const formData = new FormData();
  formData.append('prompt', prompt);
  if (file) formData.append('poster', file);
  if (contextFile) formData.append('context_image', contextFile);

  const res = await fetch(`${SERVER_URL}/agent/draft`, {
    method: Config.POST,
    body: formData,
    headers: { [Config.CONTENT_TYPE]: Config.TEXT_PLAIN },
  });

  const event = await res.json();

  console.log("[TIME]", Date.now() - _startTime, "ms"); // TIME end

  if (!res.ok) {
    throw new Error(event.error || Config.UNKNOWN_ERROR);
  }

  return event;
};

export default function AgentDraft({ placeholder = Config.PROMPT_PLACEHOLDER, handleClick }) {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setLoading] = useState(false)
    const [requestInProgress, setRequestInProgress] = useState(false);

    const handleSubmit = async (e) => {
        if (requestInProgress) return; // Prevent duplicate
        setRequestInProgress(true);
        e.preventDefault();
        if (!prompt.trim() || isLoading)
        {
            return;
        }

        try {
            setLoading(true)
            const file = e.target.poster?.files[0] || null;
            const contextFile = e.target.context_image?.files[0] || null;
            const response = await sendPrompt(prompt, file, contextFile);
            console.log('[DEBUG] Full response:', response);
            const { event } = response;
            console.log('[DEBUG] Raw event from backend:', event);
            setPrompt('');
            // Transform draft data to form-compatible format
            console.log('[DEBUG] About to transform...');
            const transformedEvent = transformDraftToFormData(event);
            console.log('[DEBUG] Transformed event:', transformedEvent);
            transformedEvent.file = file;
            handleClick(Config.ADD, transformedEvent)();
            // Switch to ADD mode and pass the generated draft
            }
        catch (err) {
            console.error('[ERROR] Draft generation error:', err);
        }
        finally {
            setRequestInProgress(false);
            setLoading(false)
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === Config.ENTER && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div>
        <SpinnerOverlay isLoading={isLoading} />
        <form onSubmit={handleSubmit} className="min-h-screen flex flex-col items-center justify-center gap-4">
            <div style={{ display: 'flex', gap: '1.5rem' }}>
                <FileUpload />
                <ContextFileUpload />
            </div>
            <div className="relative flex items-end gap-2 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 w-full max-w-xl md:max-w-3xl lg:max-w-4xl">
            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                <BackToDashboard handleClick={handleClick(Config.DASHBOARD, undefined)} />
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