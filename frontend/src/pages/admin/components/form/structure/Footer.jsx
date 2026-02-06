import { Card } from "@chakra-ui/react";
import { BackToDashboard, SubmitFormButton } from "../../../../../components/Buttons.jsx";
import { DASHBOARD } from "../../../../../config/index.jsx";
import { handleDraftClick, handleAddClick } from "../../../utils/formHelpers.js";

export default function FormFooter({ isEdit, handleClick, event }) {
  const showDraftButton = !isEdit || event?.is_draft;

  return (
    <Card.Footer>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <BackToDashboard handleClick={handleClick(DASHBOARD, undefined)} />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input type="hidden" name="is_draft" value="false" />
          {showDraftButton && (
            <SubmitFormButton
              text="Save as Draft"
              onClick={handleDraftClick}
            />
          )}
          <SubmitFormButton
            text={isEdit ? "Update" : "Add"}
            onClick={handleAddClick}
          />
        </div>
      </div>
    </Card.Footer>
  );
}
