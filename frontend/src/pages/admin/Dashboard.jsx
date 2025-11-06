import { Checkbox, Table, Button } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { ADD, EDIT, LARGE, FLEX, CENTER, SOLID, OUTLINE, XL, BOLD } from "../../components/config/strings"
import MyAlert from "../../components/CustomAlert.jsx"; 
import { CHECKBOX_COLOR, SECONDARY_COLOR } from "../../components/config/colors";

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

  // Navigate back to homepage
  function backToFatty() {
    window.location.href = "/";
  }

  const rows = events.map((event) => (
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
      <Table.Cell>{event.description}</Table.Cell>
    </Table.Row>
  ))

  return (
    <div className="centered-content-global" style={{ display: FLEX, flexDirection: 'column', alignItems: 'stretch', maxWidth: '1200px', minWidth: '400px', margin: '0 auto', padding: '2rem', borderRadius: '2rem' }}>
      {alert && <MyAlert {...alert} onClose={() => setAlert(null)} />}
      <Table.Root interactive stickyHeader size={LARGE}>
        <Table.Header>
          <Table.Row style={{ backgroundColor: '#cce6ff', fontSize: '1.25rem', height: '3.5rem' }}>
            <Table.ColumnHeader w="6" />
            <Table.ColumnHeader>Event</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>{rows}</Table.Body>
      </Table.Root>
      <div style={{ display: FLEX, justifyContent: CENTER, gap: '2rem', marginTop: '2.5rem' }}>
        <Button colorScheme="blue" variant={SOLID} size={LARGE} fontWeight="bold" px={8} py={6} boxShadow="md" borderRadius={XL} _hover={{ bg: SECONDARY_COLOR, transform: 'scale(1.05)' }} transition="all 0.15s" onClick={ handleClick(ADD, undefined) }>Add</Button>
        <Button colorScheme="yellow" variant={SOLID} size={LARGE} fontWeight="bold" px={8} py={6} boxShadow="md" borderRadius={XL} _hover={{ bg: SECONDARY_COLOR, transform: 'scale(1.05)' }} transition="all 0.15s" onClick={ handleEditEvents }>Edit</Button>
        <Button colorScheme="red" variant={SOLID} size={LARGE} fontWeight="bold" px={8} py={6} boxShadow="md" borderRadius={XL} _hover={{ bg: SECONDARY_COLOR, transform: 'scale(1.05)' }} transition="all 0.15s" onClick={handleDeleteEvents}>Delete</Button>
        <Button colorScheme="gray" variant={OUTLINE} size={LARGE} fontWeight="bold" px={8} py={6} borderRadius={XL} _hover={{ bg: '#edf2f7', color: '#2d3748', transform: 'scale(1.05)' }} transition="all 0.15s" onClick={backToFatty}>Back</Button>
      </div>
    </div>
  )
}

export default Dashboard