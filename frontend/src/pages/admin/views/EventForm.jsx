import { Card } from "@chakra-ui/react";
import { DASHBOARD, TRANSPARENT, FORM_BACKGROUND_COLOR, CENTER, FLEX, RELATIVE, MAX, NONE, XL, PUT, POST, STATUS_ERROR, STATUS_SUCCESS } from "../../../config/index.jsx";
import validateEvent from "../utils/validation.js";
import { extractEventDataFromForm, eventDataToFormData, shouldSkipValidation } from "../utils/formHelpers.js";
import { getTomorrowDate, submitFormData } from "../utils/formUtils.js";
import { useState } from "react";
import { BackToDashboard, SubmitFormButton } from "../../../components/Buttons.jsx";
import SpinnerOverlay from "../../../components/SpinnerOverlay.jsx";
import AlertOverlay from "../components/form/AlertOverlay.jsx";
import EventFormFields from "../components/form/EventFormFields.jsx";

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
            <AlertOverlay alert={alert} onClose={() => setAlert(null)} />
            <Card.Root backgroundColor={TRANSPARENT} marginBottom="4rem" maxW="800px" w={MAX} minW="300px" boxShadow={NONE} borderRadius={XL}>
                <form onSubmit={handleEvent} style={{ backgroundColor: FORM_BACKGROUND_COLOR, enctype: "multipart/form-data", borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    <Card.Body>
                        <EventFormFields event={event} tomorrowStr={tomorrowStr} />
                    </Card.Body>
                    <Card.Footer gap="1rem">
                        <SubmitFormButton text={isEdit ? "Update" : "Add"} />
                        <BackToDashboard handleClick={handleClick(DASHBOARD, undefined)}></BackToDashboard>
                    </Card.Footer>
                </form>
            </Card.Root>
        </div>
    );
}
