import _React, { useState } from 'react';
import MyAlert from '../components/CustomAlert.jsx';
import * as Config from 'config/index.jsx';
import SpinnerOverlay from '../components/SpinnerOverlay.jsx';
import { sendPrompt } from 'controller/draft.js';
import AIDraftForm from '../components/draft/AIDraftForm.jsx';

export default function DraftBuilder({ handleClick, onDraftQueued, initialPrompt = '' }) {
    const [prompt, setPrompt] = useState(initialPrompt);
    const [isLoading, setLoading] = useState(false)
    const [requestInProgress, setRequestInProgress] = useState(false);
    const [alert, setAlert] = useState(undefined);

    const handleSubmit = async (e) => {
        if (requestInProgress) return;
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
            {alert && <MyAlert {...alert} onClose={() => setAlert(null)} />}
            <AIDraftForm
                prompt={prompt}
                onPromptChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                onSubmit={handleSubmit}
                onBack={() => handleClick(Config.DASHBOARD, undefined)()}
                isLoading={isLoading}
            />
        </div>
    );
}
