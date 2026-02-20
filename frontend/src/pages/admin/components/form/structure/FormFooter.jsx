import { Card } from "@chakra-ui/react";
import { BackToDashboard, SubmitFormButton } from "components/Buttons.jsx";
import { DASHBOARD } from "config/index.jsx";
export default function FormFooter({ isEdit, handleClick, event, isDraftRef }) {
  const showDraftButton = !isEdit || event?.is_draft;

  return (
    <Card.Footer>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <BackToDashboard handleClick={handleClick(DASHBOARD, undefined)} />
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {showDraftButton && (
            <SubmitFormButton
              text="Save as Draft"
              onClick={() => { isDraftRef.current = true; }}
            />
          )}
          <SubmitFormButton
            text={isEdit ? "Update" : "Publish"}
            onClick={() => { isDraftRef.current = false; }}
          />
        </div>
      </div>
    </Card.Footer>
  );
}
