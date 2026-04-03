import { useState, useEffect } from "react";
import EventForm from "./views/EventForm.jsx";
import * as Config from '../../config/index.jsx';
import Dashboard from "./views/Dashboard.jsx";
import Login from "./views/Login.jsx";
import DraftBuilder from "./views/DraftBuilder.jsx";
import { handleTokenCheck } from "../../utils/auth.js";
import { fetchEvents } from "../../controller/events.js";
import { checkAuth } from "../../controller/auth.js";

// AdminPageHandler is responsible for:
// 1. Authentication — checks token on mount and redirects to Login if invalid
// 2. View routing — controls which admin view is rendered (Dashboard, EventForm, DraftBuilder, Login)
// 3. Event state — owns the events list and passes it down to child views
// 4. Polling — re-fetches events every 10s while on the Dashboard to surface new drafts

export default function AdminPageHandler() {
  const[_isAuthenticated, setAuthenticated] = useState(false)
  const[action, setAction] = useState(null);
  const[selectedEvent, setSelectedEvent] = useState(undefined);
  
  // [3] Load from sessionStorage so dashboard renders instantly on remount
  const cached = sessionStorage.getItem('admin_events');
  const[events, setEvents] = useState(cached ? JSON.parse(cached) : []);

  const handleClick = (action, selectedEvent) => () => {
    setAction(action);
    setSelectedEvent(selectedEvent || undefined);
  };

  // [4] Poll for new drafts every 10s while on the Dashboard
  useEffect(() => {
    if (action !== Config.DASHBOARD) return;
    const interval = setInterval(() => {
      fetchEvents(true).then(fresh => {
        setEvents(fresh);
        sessionStorage.setItem('admin_events', JSON.stringify(fresh));
      }).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, [action]);

  // [1] + [2] On Mount — auth check and initial event fetch
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
            return (<DraftBuilder handleClick={handleClick} />);
         default:
            return (<Login />);
   }
  }
