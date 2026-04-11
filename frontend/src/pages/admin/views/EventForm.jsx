import * as Config from 'config/index.jsx';
import validateEvent from "../utils/validation.js";
import { parseFormData } from "../utils/form.js";
import { submitEvent } from "controller/events.js";
import { useRef, useState } from "react";
import SpinnerOverlay from "../components/SpinnerOverlay.jsx";
import MyAlert from "../components/CustomAlert.jsx";
import FormBody from "../components/form/structure/FormBody.jsx";


export default function EventForm({ event, isEdit, handleClick, setEvents } ) {
    const [alert, setAlert] = useState(undefined);
    const [isLoading, setLoading] = useState(false);
    const isDraftRef = useRef(false);

    function handleSavedEvent(savedEvent) {
        setEvents(prev => {
            const updated = isEdit
                ? prev.map(ev => ev.id === savedEvent.id ? savedEvent : ev)
                : [...prev, savedEvent];
            sessionStorage.setItem('admin_events', JSON.stringify(updated));
            return updated;
        });
        if (isEdit) return savedEvent.is_draft ? "Draft Updated" : "Event Updated";
        return savedEvent.is_draft ? "Draft Created" : "Event Created";
    }

    async function handleEvent(e) {
        e.preventDefault();
        const form = e.target;

        // Parse form data including draft status for validation and submission
        const formData = parseFormData(form, isDraftRef.current);

        const validationResult = validateEvent(formData, isEdit, isDraftRef.current);
            if (!validationResult.valid) {
                setAlert({ status: Config.STATUS_ERROR, description: validationResult.error });
                return;
            }

            try {
                setLoading(true);
                const savedEvent = await submitEvent(formData, isEdit ? event.id : null);
                setLoading(false);
                // Update state and sessionStorage cache so the dashboard reflects the change instantly
                const successTitle = handleSavedEvent(savedEvent);

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
            {alert && <MyAlert {...alert} onClose={() => setAlert(null)} />}
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
