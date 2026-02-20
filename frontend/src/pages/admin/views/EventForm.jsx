import { DASHBOARD, CENTER, FLEX, RELATIVE, PUT, POST, STATUS_ERROR, STATUS_SUCCESS } from "config/index.jsx";
import validateEvent from "../utils/validation.js";
import { extractEventData, submitFormData } from "../utils/form.js";
import { useRef, useState } from "react";
import SpinnerOverlay from "components/SpinnerOverlay.jsx";
import FormAlert from "../components/form/FormAlert.jsx";
import FormBody from "../components/form/structure/FormBody.jsx";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function EventForm({ event, isEdit, handleClick } ) {
    const [alert, setAlert] = useState(undefined);
    const [isLoading, setLoading] = useState(false);
    const isDraftRef = useRef(false);

    async function handleEvent(e) {
        e.preventDefault(); 
        const form = e.target;
        
        // Extract form data
        const eventData = extractEventData(form);
        eventData.is_draft = isDraftRef.current;

        // Validate (drafts only need title, full events need everything)
        const validation = validateEvent(eventData, isEdit, eventData.is_draft);
        if (!validation.valid) {
            setAlert({ status: STATUS_ERROR, description: validation.error });
            return;
        }

        // Determine URL and method
        const url = isEdit ? `${SERVER_URL}/api/events/${event.id}` : `${SERVER_URL}/api/events`;
        const method = isEdit ? PUT : POST;

        try {
            setLoading(true);
            await submitFormData(url, method, eventData);
            setLoading(false);

            // Determine success message based on draft status and edit mode
            let successTitle;
            if (isEdit) {
                successTitle = eventData.is_draft ? "Draft Updated" : "Event Updated";
            } else {
                successTitle = eventData.is_draft ? "Draft Created" : "Event Created";
            }

            setAlert({
                status: STATUS_SUCCESS,
                title: successTitle,
            });

            setTimeout(() => {
                handleClick(DASHBOARD)();
            }, 750);
        } 
        catch (err) {
            setLoading(false);
            setAlert({
                status: STATUS_ERROR,
                description: err.message,
            });
        } 
    }

    return (
        <div className={CENTER} style={{ position: RELATIVE, display: FLEX, alignItems: CENTER, justifyContent: CENTER, minHeight: '100vh', paddingTop: '3rem' }}>
            <SpinnerOverlay isLoading={isLoading} />
            <FormAlert alert={alert} onClose={() => setAlert(null)} />
            <FormBody
                event={event} 
                isEdit={isEdit}
                onSubmit={handleEvent} 
                handleClick={handleClick}
                isDraftRef={isDraftRef}
            />
        </div>
    );
}
