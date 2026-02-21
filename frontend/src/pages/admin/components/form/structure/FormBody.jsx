import { Card } from "@chakra-ui/react";
import * as Config from 'config/index.jsx';
import FormFields from "./FormFields.jsx";
import FormFooter from "./FormFooter.jsx";

export default function FormBody({ event, isEdit, onSubmit, handleClick, isDraftRef }) {
  return (
    <Card.Root
      backgroundColor={Config.TRANSPARENT}
      marginBottom="4rem"
      maxW="800px"
      w={Config.MAX}
      minW="300px"
      boxShadow={Config.NONE}
      borderRadius={Config.XL}
    >
      <form
        onSubmit={onSubmit}
        style={{
          backgroundColor: Config.FORM_BACKGROUND_COLOR,
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
