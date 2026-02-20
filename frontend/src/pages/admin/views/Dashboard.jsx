import { Checkbox, Table } from "@chakra-ui/react"
import { useState } from "react"
import * as Config from 'config/index.jsx'
import MyAlert from "components/CustomAlert.jsx";
import AdminActions from "../components/AdminActions.jsx";
import { AdminActionButton, BackButton } from "components/Buttons.jsx";
import { deleteEvents } from "utils/database/api.js";

const Dashboard = ({ handleClick, events, setEvents }) => {
  const [selection, setSelection] = useState([])
  const [alert, setAlert] = useState(undefined);

  // Delete selected events
  const handleDeleteEvents = () => {
    deleteEvents(selection)
      .then(data => {
        // Update state and sessionStorage cache so the list stays accurate on remount
        setEvents(prev => {
          const updated = prev.filter(ev => !data.deleted.includes(ev.title));
          sessionStorage.setItem('admin_events', JSON.stringify(updated));
          return updated;
        });
        setSelection([]);
      })
      .catch(err => console.log("[ERROR] Error deleting events:", err));
  };

  // Edit selected event (only if one selected)
  const handleEditEvents = () => {
    if (selection.length !== 1) {
        setAlert({ status: Config.STATUS_ERROR, description: "Please select exactly one event to edit." });
      return
    }
    const eventToEdit = events.find(event => event.title === selection[0]);
    handleClick(Config.EDIT, eventToEdit)();
  }

  const eventRows = events.map((event) => 
    (
    <Table.Row
      key={event.title}
      data-selected={selection.includes(event.title) ? "" : undefined}
    >
      <Table.Cell>
      <Checkbox.Root variant={Config.SUBTLE} colorPalette={event.is_draft ? 'red' : 'blue'}
        checked={selection.includes(event.title)}
        onCheckedChange=
        {({ checked }) => 
          {
          setSelection(prev => checked === true ? 
            [...prev, event.title] : prev.filter(title => title !== event.title));
          }
        }> 
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </Table.Cell>
      <Table.Cell>{event.title}</Table.Cell>
    </Table.Row>
    )  );
  
  return (
    <div style={{ display: Config.FLEX, flexDirection: 'column', alignItems: 'stretch', maxWidth: '1200px', minWidth: '400px', margin: '0 auto', padding: '2rem', borderRadius: '2rem' }}>
      <BackButton homepage />
      {alert && <MyAlert {...alert} onClose={() => setAlert(null)} />}
      <Table.Root size={Config.LARGE} marginTop="2rem">
        <Table.Header>
          <Table.Row style={{ backgroundColor: Config.BACKGROUND_COLOR, fontSize: '1.25rem', height: '3.5rem' }}>
            <Table.ColumnHeader w="6" />
            <Table.ColumnHeader>
            <AdminActionButton onClick={ handleClick(Config.AI, undefined) } text="Draft"></AdminActionButton>
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>{eventRows}</Table.Body>
      </Table.Root>
      <AdminActions handleClick={handleClick} handleEditEvents={handleEditEvents} handleDeleteEvents={handleDeleteEvents} />
    </div>
  )
}

export default Dashboard