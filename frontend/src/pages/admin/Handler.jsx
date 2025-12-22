import { useState } from "react";
import EventForm from "./EventForm.jsx";
import LoginForm from "./LoginForm.jsx"
import { ADD, EDIT, LOGIN, DASHBOARD, MANUAL } from "../../components/config/strings.jsx";
import Dashboard from "./Dashboard.jsx";
import LoginOptions from "./LoginOptions.jsx";
import { useLocation } from "react-router-dom";

export default function AdminPageHandler( ) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const authenticated = params.get("oauth") == "success"
  const initialState = authenticated ? DASHBOARD : LOGIN
  const[action, setAction] = useState(initialState);
  const[selectedEvent, setSelectedEvent] = useState(undefined);
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

