import { Table } from "@chakra-ui/react"
import * as Config from 'config/index.jsx'
import { DeleteButton } from 'components/buttons/IconButtons.jsx';
import ProcessingBar from "../draft/ProcessingBar.jsx";

const ProcessingEventRow = ({ event, hoveredIcon, setHoveredIcon, onDelete }) => (
  <Table.Row>
    <Table.Cell style={{ textAlign: 'left', paddingLeft: '2rem' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</span>
        <span style={{ color: 'gray', fontStyle: 'italic', fontSize: '0.85em', flexShrink: 0 }}>(draft)</span>
      </span>
    </Table.Cell>
    <Table.Cell style={{ textAlign: 'right', display: Config.FLEX, gap: '1rem', alignItems: Config.CENTER, justifyContent: 'flex-end', paddingRight: '2rem' }}>
      <ProcessingBar />
      <DeleteButton id={event.title} hoveredIcon={hoveredIcon} setHoveredIcon={setHoveredIcon} onClick={onDelete} />
    </Table.Cell>
  </Table.Row>
)

export default ProcessingEventRow
