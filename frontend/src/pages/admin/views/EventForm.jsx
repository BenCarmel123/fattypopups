import { DASHBOARD, CENTER, FLEX, RELATIVE, PUT, POST, STATUS_ERROR, STATUS_SUCCESS } from "../../../config/index.jsx";
import validateEvent from "../utils/validation.js";
import { extractEventDataFromForm, eventDataToFormData, shouldSkipValidation } from "../utils/formHelpers.js";
import { getTomorrowDate, submitFormData } from "../utils/formUtils.js";
import { useState } from "react";
import SpinnerOverlay from "../../../components/SpinnerOverlay.jsx";
import FormAlert from "../components/form/Alert.jsx";
import FormCard from "../components/form/structure/Card.jsx";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function EventForm({ event, isEdit, handleClick } ) {
    const [alert, setAlert] = useState(undefined);
    const [isLoading, setLoading] = useState(false);
    
    const tomorrowStr = getTomorrowDate();

    async function handleEvent(e) {
        e.preventDefault(); 
        const form = e.target;
        
        // Extract form data
        const eventData = extractEventDataFromForm(form);

        // Validate if not both drafts
        if (!shouldSkipValidation(event, eventData)) {
            const validation = validateEvent(eventData, isEdit);
            if (!validation.valid) {
                setAlert({ status: STATUS_ERROR, description: validation.error });
                return; 
            }
        }

        // Convert to FormData for upload
        const formData = eventDataToFormData(eventData);

        // Determine URL and method
        const url = isEdit ? `${SERVER_URL}/api/events/${event.id}` : `${SERVER_URL}/api/events`;
        const method = isEdit ? PUT : POST;

        try {
            setLoading(true);
            await submitFormData(url, method, formData);
            setLoading(false);

            setAlert({
                status: STATUS_SUCCESS,
                title: isEdit ? "Event Updated" : "Event Created",
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
        <div className={CENTER} style={{ position: RELATIVE, display: FLEX, alignItems: CENTER, justifyContent: CENTER, minHeight: '100vh' }}>
            <SpinnerOverlay isLoading={isLoading} />
            <FormAlert alert={alert} onClose={() => setAlert(null)} />
            <FormCard 
                event={event} 
                isEdit={isEdit} 
                tomorrowStr={tomorrowStr} 
                onSubmit={handleEvent} 
                handleClick={handleClick}
            />
        </div>
    );
}
