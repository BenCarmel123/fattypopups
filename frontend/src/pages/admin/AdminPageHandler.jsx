import { useState } from "react";
import { LoginForm, EventForm } from "./Forms.jsx";
import { ADD, EDIT, LOGIN } from "../../components/strings.jsx";
import Dashboard from "./Dashboard.jsx";

export default function AdminPageHandler(){
  const[action, setAction] = useState(LOGIN);
  const handleClick = (action) => () => {
    setAction(action);
  };
   switch(action) {
         case ADD:
            return (<EventForm isEdit={false} handleClick={handleClick} />);
         case EDIT:
            return (<EventForm isEdit={true} handleClick={handleClick} />);
         case LOGIN:
            return (<Dashboard handleClick={handleClick} />);
         default:
            return (<LoginForm handleClick={handleClick} />);
      }  
}

