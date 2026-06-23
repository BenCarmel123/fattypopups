import * as Config from 'config/index.jsx';
import SpinnerOverlay from "../components/SpinnerOverlay.jsx";
import MyAlert from "../components/CustomAlert.jsx";
import FormBody from "../components/form/structure/FormBody.jsx";
import { useEventForm } from "../hooks/useEventForm.js";

export default function EventForm({ event, isEdit, handleClick, setEvents }) {
    const { alert, setAlert, isLoading, isDraftRef, handleEvent } = useEventForm({ event, isEdit, handleClick, setEvents });

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
