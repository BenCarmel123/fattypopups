import * as Config from 'config/index.jsx';
import validateEvent from "../utils/validation.js";
import { extractEventData, submitFormData } from "../utils/form.js";
import { useRef, useState } from "react";
import SpinnerOverlay from "components/SpinnerOverlay.jsx";
import FormAlert from "../components/form/FormAlert.jsx";
import FormBody from "../components/form/structure/FormBody.jsx";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function EventForm({ event, isEdit, handleClick, setEvents } ) {
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
            setAlert({ status: Config.STATUS_ERROR, description: validation.error });
            return;
        }

        // Determine URL and method
        const url = isEdit ? `${SERVER_URL}/api/events/${event.id}` : `${SERVER_URL}/api/events`;
        const method = isEdit ? Config.PUT : Config.POST;

        try {
            setLoading(true);
            const savedEvent = await submitFormData(url, method, eventData);
            setLoading(false);
            // Update state and sessionStorage cache so the dashboard reflects the change instantly
            if (isEdit) {
              setEvents(prev => {
                const updated = prev.map(ev => ev.id === savedEvent.id ? savedEvent : ev);
                sessionStorage.setItem('admin_events', JSON.stringify(updated));
                return updated;
              });
            } else {
              setEvents(prev => {
                const updated = [...prev, savedEvent];
                sessionStorage.setItem('admin_events', JSON.stringify(updated));
                return updated;
              });
            }

            // Determine success message based on draft status and edit mode
            let successTitle;
            if (isEdit) {
                successTitle = eventData.is_draft ? "Draft Updated" : "Event Updated";
            } else {
                successTitle = eventData.is_draft ? "Draft Created" : "Event Created";
            }

            setAlert({
                status: Config.STATUS_SUCCESS,
                title: successTitle,
            });

            setTimeout(() => {
                handleClick(Config.DASHBOARD)();
            }, 750);
        }
        catch (err) {
            setLoading(false);
            setAlert({
                status: Config.STATUS_ERROR,
                description: err.message,
            });
        }
    }

    return (
        <div className={Config.CENTER} style={{ position: Config.RELATIVE, display: Config.FLEX, alignItems: Config.CENTER, justifyContent: Config.CENTER, minHeight: '100vh', paddingTop: '3rem' }}>
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
