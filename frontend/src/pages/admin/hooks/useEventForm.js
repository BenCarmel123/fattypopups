import { useRef, useState } from "react";
import * as Config from 'config/index.jsx';
import validateEvent from "../utils/validation.js";
import { parseFormData } from "../utils/form.js";
import { submitEvent } from "controller/events.js";

export function useEventForm({ event, isEdit, handleClick, setEvents }) {
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
      const successTitle = handleSavedEvent(savedEvent);
      setAlert({ status: Config.STATUS_SUCCESS, title: successTitle });
      setTimeout(() => handleClick(Config.DASHBOARD)(), 750);
    } catch (err) {
      setLoading(false);
      setAlert({ status: Config.STATUS_ERROR, description: err.message });
    }
  }

  return { alert, setAlert, isLoading, isDraftRef, handleEvent };
}
