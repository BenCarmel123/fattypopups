import { useState, useEffect } from "react";
import EventForm from "./EventForm.jsx";
import { ADD, EDIT, LOGIN, DASHBOARD } from "../../components/config/strings.jsx";
import Dashboard from "./Dashboard.jsx";
import Login from "./Login.jsx";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function AdminPageHandler() {
  const[isAuthenticated, setAuthenticated] = useState(false)
  const[action, setAction] = useState(LOGIN);
  const[selectedEvent, setSelectedEvent] = useState(undefined);

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get("token");

  console.log("[DEBUG] Token from URL:", tokenFromUrl);

  if (tokenFromUrl) {
    localStorage.setItem("auth_token", tokenFromUrl);
    window.history.replaceState({}, "", window.location.pathname);
  }

  console.log("[DEBUG] Token in storage:", localStorage.getItem("auth_token"));

  const token = localStorage.getItem("auth_token");
  if (!token) return;
  console.log("[DEBUG] pending token to /auth/check");
  fetch(`${SERVER_URL}/auth/check`, { headers: { Authorization: `Bearer ${token}`,},})
      .then(res => res.json()).then(data => {
        setAuthenticated(data.authenticated);
        setAction(data.authenticated ? DASHBOARD : LOGIN);});
  }, []);

  const handleClick = (action, selectedEvent) => () => {
    setAction(action);
    setSelectedEvent(selectedEvent || undefined); };

   switch(action) {
         case ADD:
            return (<EventForm isEdit={false} handleClick={handleClick} event={selectedEvent} />);
         case EDIT:
            return (<EventForm isEdit={true} handleClick={handleClick} event={selectedEvent} />);
         case DASHBOARD:
            return (<Dashboard handleClick={handleClick} />);
         case LOGIN:
            return (<Login />);
      }  
}

