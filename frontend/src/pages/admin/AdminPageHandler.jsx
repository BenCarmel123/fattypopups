import { useState } from "react";
import LoginForm, { EventForm } from "./Forms.jsx";
import { ADD, EDIT, LOGIN, DASHBOARD } from "../../components/config/strings.jsx";
import Dashboard from "./Dashboard.jsx";

export default function AdminPageHandler( ) {
  const[action, setAction] = useState(LOGIN);
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
            return (<LoginForm handleClick={handleClick} />);
         default:
            return (<LoginForm handleClick={handleClick} />);
      }  
}

