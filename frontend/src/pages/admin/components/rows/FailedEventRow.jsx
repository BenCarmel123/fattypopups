import { Table } from "@chakra-ui/react"
import * as Config from 'config/index.jsx'
import { DeleteButton, RetryButton } from 'components/buttons/IconButtons.jsx';
import FailedBar from "../draft/FailedBar.jsx";

const FailedEventRow = ({ event, hoveredIcon, setHoveredIcon, onDelete, onRetry }) => (
  <Table.Row>
    <Table.Cell style={{ textAlign: 'left', paddingLeft: '2rem' }}>
      <FailedBar title={event.title} />
    </Table.Cell>
    <Table.Cell style={{ textAlign: 'right', display: Config.FLEX, gap: '1rem', alignItems: Config.CENTER, justifyContent: 'flex-end', paddingRight: '2rem' }}>
      <RetryButton id={event.title} hoveredIcon={hoveredIcon} setHoveredIcon={setHoveredIcon} onClick={onRetry} />
      <DeleteButton id={event.title} hoveredIcon={hoveredIcon} setHoveredIcon={setHoveredIcon} onClick={onDelete} />
    </Table.Cell>
  </Table.Row>
)

export default FailedEventRow
