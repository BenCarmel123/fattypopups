import { Input, Field } from "@chakra-ui/react";
import { FORM_FIELD_COLOR, TEXT_AREA_COLOR } from "../../../../../config/index.jsx";

// Reusable form input field with consistent styling
export default function FormInput({ label, name, type = "text", defaultValue = "", placeholder = "" }) {
  return (
    <Field.Root>
      <Field.Label color={FORM_FIELD_COLOR}>{label}</Field.Label>
      <Input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        borderColor={TEXT_AREA_COLOR}
        borderWidth={2}
        _focus={{ borderColor: FORM_FIELD_COLOR }}
      />
    </Field.Root>
  );
}
