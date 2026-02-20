import { Card } from "@chakra-ui/react";
import { TRANSPARENT, FORM_BACKGROUND_COLOR, MAX, NONE, XL } from "config/index.jsx";
import FormFields from "./FormFields.jsx";
import FormFooter from "./FormFooter.jsx";

export default function FormBody({ event, isEdit, onSubmit, handleClick, isDraftRef }) {
  return (
    <Card.Root
      backgroundColor={TRANSPARENT}
      marginBottom="4rem"
      maxW="800px"
      w={MAX}
      minW="300px"
      boxShadow={NONE}
      borderRadius={XL}
    >
      <form
        onSubmit={onSubmit}
        style={{
          backgroundColor: FORM_BACKGROUND_COLOR,
          encType: "multipart/form-data",
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Card.Body>
          <FormFields event={event} />
        </Card.Body>
        <FormFooter isEdit={isEdit} handleClick={handleClick} event={event} isDraftRef={isDraftRef} />
      </form>
    </Card.Root>
  );
}
