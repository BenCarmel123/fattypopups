import { useState, useEffect } from "react";
import EventForm from "./EventForm.jsx";
import LoginForm from "./LoginForm.jsx"
import { ADD, EDIT, LOGIN, DASHBOARD, MANUAL } from "../../components/config/strings.jsx";
import Dashboard from "./Dashboard.jsx";
import LoginOptions from "./LoginOptions.jsx";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function AdminPageHandler() {
  const[isAuthenticated, setAuthenticated] = useState(false)
  const[action, setAction] = useState(LOGIN);
  const[selectedEvent, setSelectedEvent] = useState(undefined);
  useEffect(() => {
    fetch(`${SERVER_URL}/api/me`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        console.log(SERVER_URL)
        setAuthenticated(data.authenticated);
        setAction(data.authenticated ? DASHBOARD : LOGIN);
      });
  }, []);
  const handleClick = (action, selectedEvent) => () => {
    setAction(action);
    setSelectedEvent(selectedEvent || undefined);
  };

   switch(action) {
         case ADD:
            return (<EventForm isEdit={false} handleClick={handleClick} event={selectedEvent} />);
         case EDIT:
            return (<EventForm isEdit={true} handleClick={handleClick} event={selectedEvent} />);
         case DASHBOARD:
            return (<Dashboard handleClick={handleClick} />);
         case LOGIN:
            return (<LoginOptions handleClick={handleClick}/>);
         case MANUAL:
            return (<LoginForm handleClick={handleClick} />);
      }  
}

