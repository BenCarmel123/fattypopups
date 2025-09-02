import { Checkbox, Table, Button } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { ADD, EDIT } from "../../components/strings"
import { SERVER_URL } from "../../Config"
import MyAlert from "../../components/CustomAlert.jsx"; 

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
          size="sm"
          mt="0.5"
          aria-label="Select row"
          checked={selection.includes(event.title)}
          onCheckedChange={(changes) => {
            setSelection((prev) =>
              changes.checked
                ? [...prev, event.title]
                : selection.filter((title) => title !== event.title),
            )
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </Table.Cell>
      <Table.Cell>{event.title}</Table.Cell>
      <Table.Cell>{event.description}</Table.Cell>
      <Table.Cell>{event.venue_address}</Table.Cell>
    </Table.Row>
  ))

  return (
    <div className="centered-content-global" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', maxWidth: '1200px', minWidth: '400px', margin: '0 auto', padding: '2rem', borderRadius: '2rem' }}>
      {alert && <MyAlert {...alert} onClose={() => setAlert(null)} />}
      <Table.Root interactive stickyHeader size="lg">
        <Table.Header>
          <Table.Row style={{ backgroundColor: '#cce6ff', fontSize: '1.25rem', height: '3.5rem' }}>
            <Table.ColumnHeader w="6" />
            <Table.ColumnHeader>Event</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader>Location</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>{rows}</Table.Body>
      </Table.Root>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2.5rem' }}>
        <Button colorPalette="blue" variant="subtle" size="lg" onClick={ handleClick(ADD, undefined) }>Add</Button>
        <Button colorPalette="blue" variant="subtle" size="lg" onClick={ handleEditEvents }>Edit</Button>
        <Button colorPalette="blue" variant="subtle" size="lg" onClick={handleDeleteEvents}>Delete</Button>
        <Button colorPalette="blue" variant="subtle" size="lg" onClick={backToFatty}>Back</Button>
      </div>
    </div>
  )
}

export default Dashboard