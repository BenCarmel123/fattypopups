import { useState, useEffect } from "react";
import EventForm from "./EventForm.jsx";
import { ADD, EDIT, LOGIN, DASHBOARD, AI, AUTH_TOKEN } from "../../config/index.jsx";
import Dashboard from "./Dashboard.jsx";
import Login from "./Login.jsx";
import PromptDraft from "./PromptDraft.jsx";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function AdminPageHandler() {
  // Component State
  // eslint-disable-next-line no-unused-vars
  const[isAuthenticated, setAuthenticated] = useState(false)
  const[action, setAction] = useState(LOGIN);
  const[selectedEvent, setSelectedEvent] = useState(undefined);

  const handleClick = (action, selectedEvent) => () => {
    setAction(action);
    setSelectedEvent(selectedEvent || undefined); 
  };

  // On Mount
  useEffect(() => {
  // Check if token in URL
  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get("token");

 // Backend Sent Token
  if (tokenFromUrl) {
    console.log("[AUTH] Token from URL:", tokenFromUrl);
      localStorage.setItem(AUTH_TOKEN, tokenFromUrl);
    window.history.replaceState({}, "", window.location.pathname);
  }

   // Verify Token
   console.log("[AUTH] Token in storage:", localStorage.getItem(AUTH_TOKEN));
   const token = localStorage.getItem(AUTH_TOKEN);

  // No Token
  if (!token) {
    setAuthenticated(false)
    setAction(LOGIN)
    return
  }

  console.log("[AUTH] pending token to /auth/check");

  // Authorization Check
  fetch(`${SERVER_URL}/auth/check`, { headers: { Authorization: `Bearer ${token}`,},})
      .then(res => res.json()).then(data => {
               if (!data.authenticated) localStorage.removeItem(AUTH_TOKEN);
        setAuthenticated(data.authenticated);
        setAction(data.authenticated ? DASHBOARD : LOGIN);});
  }, []);

   switch(action) {
         case ADD:
            return (<EventForm isEdit={false} handleClick={handleClick} event={selectedEvent} />);
         case EDIT:
            return (<EventForm isEdit={true} handleClick={handleClick} event={selectedEvent} />);
         case DASHBOARD:
            return (<Dashboard handleClick={handleClick} />);
         case LOGIN:
            return (<Login />);
         case AI: 
            return (<PromptDraft handleClick={handleClick} />);
         default:
            return (<Login />);
   }
  }
      
      

