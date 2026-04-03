import React, { useState } from 'react';
import FormAlert from '../components/form/FormAlert.jsx';
import { Textarea } from "@chakra-ui/react";
import FileUpload, { ContextFileUpload } from '../../../components/FileUpload.jsx';
import * as Config from 'config/index.jsx';
import { SubmitPromptButton, BackButton } from 'components/Buttons.jsx';
import SpinnerOverlay from 'components/SpinnerOverlay.jsx';
import { sendPrompt } from '../../../controller/draft.js';

export default function DraftBuilder({ placeholder = Config.PROMPT_PLACEHOLDER, handleClick, onDraftQueued }) {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setLoading] = useState(false)
    const [requestInProgress, setRequestInProgress] = useState(false);
    const [alert, setAlert] = useState(undefined);

    const handleSubmit = async (e) => {
        if (requestInProgress) return; // Prevent duplicate
        setRequestInProgress(true);
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        try {
            setLoading(true)

            const posterImage = e.target.poster?.files[0] || null;
            const contextImage = e.target.context_image?.files[0] || null;
            const parameters = {'prompt': prompt, 'poster': posterImage, 'context_image': contextImage}

            const adminInput = new FormData();
            for (const [key, value] of Object.entries(parameters)) if (value) adminInput.append(key, value);

            await sendPrompt(adminInput);

            setPrompt('');
            await onDraftQueued();

            // Switch to ADD mode and pass the generated draft
            }

        catch (err) {
            setAlert({ status: Config.STATUS_ERROR, description: err.message.split('\n')[0] });
        }

        finally {
            setRequestInProgress(false);
            setLoading(false)
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === Config.ENTER && !e.shiftKey) {
            e.preventDefault();
            e.target.closest('form').requestSubmit();
        }
    };

    return (
        <div>
        <SpinnerOverlay isLoading={isLoading} />
        <FormAlert alert={alert} onClose={() => setAlert(null)} />
        <form onSubmit={handleSubmit} className="min-h-screen flex flex-col items-center justify-center gap-4">
            <div className="w-full max-w-xl md:max-w-3xl lg:max-w-4xl pl-6">
                <BackButton variant="default" onBack={() => handleClick(Config.DASHBOARD, undefined)()} />
            </div>
            <div className="relative flex items-end gap-2 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 w-full max-w-xl md:max-w-3xl lg:max-w-4xl">
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
            <div className="flex flex-col md:flex-row gap-4 scale-[90%] md:scale-100 origin-center">
                <FileUpload />
                <ContextFileUpload />
            </div>
        </form>
        </div>
        );
}
