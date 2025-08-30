import { Checkbox, Table, Button } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { ADD, EDIT } from "../../components/strings"
import { SERVER_URL } from "../../Config"

const Dashboard = ({ handleClick }) => {
  const [selection, setSelection] = useState([])
  const [events, setEvents] = useState([])
  
  useEffect(() => {
    fetch(`${SERVER_URL}/api/events`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Error fetching events:', err));
  }, [])

  console.log('Fetched events:', events)

  const indeterminate = selection.length > 0 && selection.length < events.length

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
    <div className="centered-content-global" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <Table.Root interactive stickyHeader>
        <Table.Header>
          <Table.Row style={{ backgroundColor: '#cce6ff' }}>
            <Table.ColumnHeader w="6">
            </Table.ColumnHeader>
            <Table.ColumnHeader>Event</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader>Location</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>{rows}</Table.Body>
      </Table.Root>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
        <Button colorPalette="blue" variant="subtle" onClick={ handleClick(ADD) }>Add</Button>
        <Button colorPalette="blue" variant="subtle" onClick={ handleClick(EDIT) }>Edit</Button>
        <Button colorPalette="blue" variant="subtle">Delete</Button>
        <Button colorPalette="blue" variant="subtle" onClick={backToFatty}>Back</Button>
      </div>
    </div>
  )
}

export default Dashboard
