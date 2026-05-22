import FailedEventRow from "./FailedEventRow.jsx";
import ProcessingEventRow from "./ProcessingEventRow.jsx";
import DefaultEventRow from "./DefaultEventRow.jsx";

const EventRow = (props) => {
  if (props.event.status === 'failed') return <FailedEventRow {...props} />
  if (props.event.status === 'processing') return <ProcessingEventRow {...props} />
  return <DefaultEventRow {...props} />
}

export default EventRow
