import { useState, useEffect } from "react";
import EventForm from "./views/EventForm.jsx";
import * as Config from '../../config/index.jsx';
import Dashboard from "./views/Dashboard.jsx";
import Login from "./views/Login.jsx";
import PromptDraft from "./views/PromptDraft.jsx";
import { handleTokenCheck } from "../../utils/auth.js";
import { fetchEvents } from "../../utils/database/api.js";


const SERVER_URL = process.env.REACT_APP_SERVER_URL;

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

  // No Token
  if (!token) {
    setAuthenticated(false)
    setAction(Config.LOGIN)
    return
  }

  console.log("[AUTH] pending token to /auth/check");

  // Authorization Check
  fetch(`${SERVER_URL}/auth/check`, { headers: { Authorization: `Bearer ${token}`,},})
      .then(res => res.json()).then(data => {
               if (!data.authenticated) localStorage.removeItem(Config.AUTH_TOKEN);
        setAuthenticated(data.authenticated);
        if (data.authenticated) {
          // Fetch fresh events from server, update state and sessionStorage cache
          fetchEvents(true).then(fresh => {
            setEvents(fresh);
            sessionStorage.setItem('admin_events', JSON.stringify(fresh));
          }).catch(() => setEvents([]));
        }
        setAction(data.authenticated ? Config.DASHBOARD : Config.LOGIN);});
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
            return (<PromptDraft handleClick={handleClick} />);
         default:
            return (<Login />);
   }
  }
      
      

