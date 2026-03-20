import { useState, useEffect } from "react";
import EventForm from "./views/EventForm.jsx";
import * as Config from '../../config/index.jsx';
import Dashboard from "./views/Dashboard.jsx";
import Login from "./views/Login.jsx";
import AgentDraft from "./views/AgentDraft.jsx";
import { handleTokenCheck } from "../../utils/auth.js";
import { fetchEvents } from "../../controller/events.js";
import { checkAuth } from "../../controller/auth.js";

export default function AdminPageHandler() {
  // eslint-disable-next-line no-unused-vars
  const[isAuthenticated, setAuthenticated] = useState(false)
  const[action, setAction] = useState(null);
  const[selectedEvent, setSelectedEvent] = useState(undefined);
  // Load from sessionStorage so dashboard renders instantly on remount
  const cached = sessionStorage.getItem('admin_events');
  const[events, setEvents] = useState(cached ? JSON.parse(cached) : []);

  const handleClick = (action, selectedEvent) => () => {
    setAction(action);
    setSelectedEvent(selectedEvent || undefined);
  };

  // On Mount
  useEffect(() => {
  const token = handleTokenCheck();

  if (!token) {
    setAuthenticated(false)
    setAction(Config.LOGIN)
    return
  }

  // Authorization Check
  checkAuth()
      .then(data => {
        if (!data.authenticated) localStorage.removeItem(Config.AUTH_TOKEN);
        setAuthenticated(data.authenticated);
        if (data.authenticated) {
          fetchEvents(true).then(fresh => {
            setEvents(fresh);
            sessionStorage.setItem('admin_events', JSON.stringify(fresh));
          }).catch(() => setEvents([]));
        }
        setAction(data.authenticated ? Config.DASHBOARD : Config.LOGIN);
      }).catch(() => setAction(Config.LOGIN));
  }, []);

   if (action === null) return null;

   switch(action) {
         case Config.ADD:
            return (<EventForm isEdit={false} handleClick={handleClick} event={selectedEvent} setEvents={setEvents} />);
         case Config.EDIT:
            return (<EventForm isEdit={true} handleClick={handleClick} event={selectedEvent} setEvents={setEvents} />);
         case Config.DASHBOARD:
            return (<Dashboard handleClick={handleClick} events={events} setEvents={setEvents} />);
         case Config.LOGIN:
            return (<Login />);
         case Config.AI:
            return (<AgentDraft handleClick={handleClick} />);
         default:
            return (<Login />);
   }
  }
