import { Table } from "@chakra-ui/react"
import { EditButton, DeleteButton } from 'components/buttons/IconButtons.jsx';
import TitleCell from './TitleCell.jsx';
import ActionsCell from './ActionsCell.jsx';
import TitleContent from './TitleContent.jsx';

const DefaultEventRow = ({ event, hoveredIcon, setHoveredIcon, onDelete, onEdit }) => (
  <Table.Row>
    <TitleCell>
      <TitleContent title={event.title} isDraft={event.is_draft} />
    </TitleCell>
    <ActionsCell>
      <EditButton id={event.title} hoveredIcon={hoveredIcon} setHoveredIcon={setHoveredIcon} onClick={onEdit} />
      <DeleteButton id={event.title} hoveredIcon={hoveredIcon} setHoveredIcon={setHoveredIcon} onClick={onDelete} />
    </ActionsCell>
  </Table.Row>
)

export default DefaultEventRow
