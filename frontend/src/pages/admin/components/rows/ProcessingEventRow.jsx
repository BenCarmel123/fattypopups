import { Table } from "@chakra-ui/react"
import { DeleteButton } from 'components/buttons/IconButtons.jsx';
import ProcessingBar from "../draft/ProcessingBar.jsx";
import TitleCell from './TitleCell.jsx';
import ActionsCell from './ActionsCell.jsx';
import TitleContent from './TitleContent.jsx';

const ProcessingEventRow = ({ event, hoveredIcon, setHoveredIcon, onDelete }) => (
  <Table.Row>
    <TitleCell>
      <TitleContent title={event.title} isDraft={true} />
    </TitleCell>
    <ActionsCell>
      <ProcessingBar />
      <DeleteButton id={event.title} hoveredIcon={hoveredIcon} setHoveredIcon={setHoveredIcon} onClick={onDelete} />
    </ActionsCell>
  </Table.Row>
)

export default ProcessingEventRow
