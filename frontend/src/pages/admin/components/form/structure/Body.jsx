import { Card } from "@chakra-ui/react";
import Fields from "../Fields.jsx";

export default function FormBody({ event, tomorrowStr }) {
  return (
    <Card.Body>
      <Fields event={event} tomorrowStr={tomorrowStr} />
    </Card.Body>
  );
}
