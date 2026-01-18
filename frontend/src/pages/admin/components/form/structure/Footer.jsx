import { Card } from "@chakra-ui/react";
import { BackToDashboard, SubmitFormButton } from "../../../../../components/Buttons.jsx";
import { DASHBOARD } from "../../../../../config/index.jsx";

export default function FormFooter({ isEdit, handleClick }) {
  return (
    <Card.Footer>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <BackToDashboard handleClick={handleClick(DASHBOARD, undefined)} />
        <SubmitFormButton text={isEdit ? "Update" : "Add"} />
      </div>
    </Card.Footer>
  );
}
