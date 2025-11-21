import { Checkbox, Table, Button } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { ADD, EDIT, LARGE, FLEX, CENTER, SOLID, XL, BOLD, MEDIUM, MINIMAL_TRANSFORM, MINIMAL_TRANSITION } from "../../components/config/strings"
import MyAlert from "../../components/CustomAlert.jsx"; 
import { WHITE, CHECKBOX_COLOR, BACKGROUND_COLOR, ADMIN_PANEL_COLOR } from "../../components/config/colors";
import { BackButton } from "../../components/Buttons.jsx";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Dashboard = ({ handleClick }) => {
  const [selection, setSelection] = useState([])
  const [events, setEvents] = useState([])
  const [alert, setAlert] = useState(undefined);
  
  // Fetch events from the server
  useEffect(() => {
    fetch(`${SERVER_URL}/api/events`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Error fetching events:', err));
  }, [])

  // Delete selected events
  const handleDeleteEvents = () => {
    fetch(`${SERVER_URL}/api/events`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titles: selection }),
    })
    .then(res => {
      if (res.ok) {
        res.json().then(data => {
          setEvents(data.events);
          setSelection([]);
        });
      }
    })
    .catch(err => console.error('Error deleting events:', err));
  }

  // Edit selected event (only if one selected)
  const handleEditEvents = () => {
    if (selection.length !== 1) {
        setAlert({ status: "error", title: "Selection Error", description: "Please select exactly one event to edit." });
      return
    }
    const eventToEdit = events.find(event => event.title === selection[0]);
    handleClick(EDIT, eventToEdit)();
  }

  const eventRows = events.map((event) => (
    <Table.Row
      key={event.title}
      data-selected={selection.includes(event.title) ? "" : undefined}
    >
      <Table.Cell>
        <Checkbox.Root
          size={LARGE}
          mt="0.5"
          aria-label="Select row"
          borderColor={CHECKBOX_COLOR}
          borderWidth={2}
          _checked={{ borderColor: CHECKBOX_COLOR, bg: CHECKBOX_COLOR }}
          _focus={{ boxShadow: `0 0 0 2px ${CHECKBOX_COLOR}` }}
          style={{ boxShadow: `0 0 0 2px ${CHECKBOX_COLOR}`, borderRadius: '0.5rem' }}
          checked={selection.includes(event.title)}
          onCheckedChange={(checked) => {
          setSelection((prev) =>
            checked
              ? [...prev, event.title]
              : prev.filter((title) => title !== event.title),
          );
        }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </Table.Cell>
      <Table.Cell>{event.title}</Table.Cell>
    </Table.Row>
  ))

  return (
    <div style={{ display: FLEX, flexDirection: 'column', alignItems: 'stretch', maxWidth: '1200px', minWidth: '400px', margin: '0 auto', padding: '2rem', borderRadius: '2rem' }}>
      {alert && <MyAlert {...alert} onClose={() => setAlert(null)} />}
      <BackButton />
      <Table.Root size={LARGE} marginTop="2rem">
        <Table.Header>
          <Table.Row style={{ backgroundColor: BACKGROUND_COLOR, fontSize: '1.25rem', height: '3.5rem' }}>
            <Table.ColumnHeader w="6" />
            <Table.ColumnHeader></Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>{eventRows}</Table.Body>
      </Table.Root>
      <div style={{ display: FLEX, justifyContent: CENTER, gap: '1rem', marginTop: '1rem', color: WHITE, fontWeight: BOLD }}>
        <Button variant={SOLID} px={6} py={6} boxShadow={MEDIUM} borderRadius={XL} backgroundColor={ADMIN_PANEL_COLOR} _hover={{ transform: MINIMAL_TRANSFORM }} transition={MINIMAL_TRANSITION} onClick={ handleClick(ADD, undefined) }>Add</Button>
        <Button variant={SOLID} px={6} py={6} boxShadow={MEDIUM} borderRadius={XL} backgroundColor={ADMIN_PANEL_COLOR} _hover={{ transform: MINIMAL_TRANSFORM }} transition={MINIMAL_TRANSITION} onClick={ handleEditEvents }>Edit</Button>
        <Button variant={SOLID} px={6} py={6} boxShadow={MEDIUM} borderRadius={XL} backgroundColor={ADMIN_PANEL_COLOR} _hover={{ transform: MINIMAL_TRANSFORM }} transition={MINIMAL_TRANSITION} onClick={handleDeleteEvents}>Delete</Button>
      </div>
    </div>
  )
}

export default Dashboard