import { Input, Field } from "@chakra-ui/react";
import * as Config from 'config/index.jsx';

// Reusable form input field with consistent styling
export default function FormInput({ label, name, type = "text", defaultValue = "", placeholder = "", onChange }) {
  return (
    <Field.Root>
      <Field.Label color={Config.FORM_INPUT_COLOR}>{label}</Field.Label>
      <Input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={onChange}
        borderColor={Config.FORM_BORDER_COLOR}
        borderWidth={2}
        _focus={{ borderColor: Config.FORM_INPUT_COLOR }}
        paddingLeft={4}
      />
    </Field.Root>
  );
}
