import { Table } from "@chakra-ui/react"
import * as Config from 'config/index.jsx'
import { FaTrash } from "config/index.jsx";
import FailedBar from "../draft/FailedBar.jsx";

const FailedEventRow = ({ event, hoveredIcon, setHoveredIcon, onDelete }) => (
  <Table.Row>
    <Table.Cell style={{ textAlign: 'left', paddingLeft: '2rem' }}>
      <FailedBar title={event.title} />
    </Table.Cell>
    <Table.Cell style={{ textAlign: 'right', display: Config.FLEX, gap: '1rem', alignItems: Config.CENTER, justifyContent: 'flex-end', paddingRight: '2rem' }}>
      <FaTrash
        style={{ cursor: Config.POINTER, color: hoveredIcon === `delete-${event.title}` ? Config.DANGER_HOVER_COLOR : 'gray', transition: 'color 0.2s' }}
        onMouseEnter={() => setHoveredIcon(`delete-${event.title}`)}
        onMouseLeave={() => setHoveredIcon(null)}
        onClick={onDelete}
      />
    </Table.Cell>
  </Table.Row>
)

export default FailedEventRow
