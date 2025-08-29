import { Checkbox, Table, Button } from "@chakra-ui/react"
import { useState } from "react"
import { ADD, EDIT } from "../../components/strings"

const Dashboard = ({ handleClick }) => {
  const [selection, setSelection] = useState([])

  const indeterminate = selection.length > 0 && selection.length < items.length

  function backToFatty() {
    window.location.href = "/";
  }

  const rows = items.map((item) => (
    <Table.Row
      key={item.name}
      data-selected={selection.includes(item.name) ? "" : undefined}
    >
      <Table.Cell>
        <Checkbox.Root
          size="sm"
          mt="0.5"
          aria-label="Select row"
          checked={selection.includes(item.name)}
          onCheckedChange={(changes) => {
            setSelection((prev) =>
              changes.checked
                ? [...prev, item.name]
                : selection.filter((name) => name !== item.name),
            )
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </Table.Cell>
      <Table.Cell>{item.name}</Table.Cell>
      <Table.Cell>{item.category}</Table.Cell>
      <Table.Cell>${item.price}</Table.Cell>
    </Table.Row>
  ))

  return (
    <div className="centered-content-global" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <Table.Root interactive stickyHeader>
        <Table.Header colorScheme="blue">
          <Table.Row>
            <Table.ColumnHeader w="6">
              <Checkbox.Root
                size="sm"
                mt="0.5"
                aria-label="Select all rows"
                checked={indeterminate ? "indeterminate" : selection.length > 0}
                onCheckedChange={(changes) => {
                  setSelection(
                    changes.checked ? items.map((item) => item.name) : [],
                  )
                }}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            </Table.ColumnHeader>
            <Table.ColumnHeader>Event</Table.ColumnHeader>
            <Table.ColumnHeader>Start Date</Table.ColumnHeader>
            <Table.ColumnHeader>End Date</Table.ColumnHeader>
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

const items = [
  { name: "Event 1", category: "Music", price: 20 },
  { name: "Event 2", category: "Art", price: 15 },
  { name: "Event 3", category: "Tech", price: 30 },
]

export default Dashboard
