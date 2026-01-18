import { Card } from "@chakra-ui/react";
import { TRANSPARENT, FORM_BACKGROUND_COLOR, MAX, NONE, XL } from "../../../../../config/index.jsx";
import Body from "./Body.jsx";
import Footer from "./Footer.jsx";

export default function FormCard({ event, isEdit, tomorrowStr, onSubmit, handleClick }) {
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
        <Body event={event} tomorrowStr={tomorrowStr} />
        <Footer isEdit={isEdit} handleClick={handleClick} />
      </form>
    </Card.Root>
  );
}
