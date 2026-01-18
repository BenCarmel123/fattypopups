import { Card } from "@chakra-ui/react";
import { BackToDashboard, SubmitFormButton } from "../../../../../components/Buttons.jsx";
import { DASHBOARD } from "../../../../../config/index.jsx";

export default function FormFooter({ isEdit, handleClick }) {
  return (
    <Card.Footer gap="1rem">
      <SubmitFormButton text={isEdit ? "Update" : "Add"} />
      <BackToDashboard handleClick={handleClick(DASHBOARD, undefined)} />
    </Card.Footer>
  );
}
