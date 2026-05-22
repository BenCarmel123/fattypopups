import { Table } from "@chakra-ui/react"
import { DeleteButton, RetryButton } from 'components/buttons/IconButtons.jsx';
import FailedBar from "../draft/FailedBar.jsx";
import TitleCell from './TitleCell.jsx';
import ActionsCell from './ActionsCell.jsx';

const FailedEventRow = ({ event, hoveredIcon, setHoveredIcon, onDelete, onRetry }) => (
  <Table.Row>
    <TitleCell>
      <FailedBar title={event.title} />
    </TitleCell>
    <ActionsCell>
      <RetryButton id={event.title} hoveredIcon={hoveredIcon} setHoveredIcon={setHoveredIcon} onClick={onRetry} />
      <DeleteButton id={event.title} hoveredIcon={hoveredIcon} setHoveredIcon={setHoveredIcon} onClick={onDelete} />
    </ActionsCell>
  </Table.Row>
)

export default FailedEventRow
