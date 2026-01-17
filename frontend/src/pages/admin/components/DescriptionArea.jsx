import { Field, Textarea } from "@chakra-ui/react";
import { FORM_FIELD_COLOR, TEXT_AREA_COLOR } from "../../../config/colors.jsx"; 

export default function DescriptionArea({ event, lang = 'en' }) {
  // Choose the right field from event
  const value = lang === 'en' ? event?.english_description || "" : event?.hebrew_description || "";
  const label = lang === 'en' ? 'English Description' : 'Hebrew Description';
  const name = lang === 'en' ? 'english_description' : 'hebrew_description';

  return (
    <Field.Root>
      <Field.Label color={FORM_FIELD_COLOR}>{label}</Field.Label>
      <Textarea
        name={name}
        defaultValue={value}
        borderColor={TEXT_AREA_COLOR}
        borderWidth={2}
        _focus={{ borderColor: FORM_FIELD_COLOR }}
        resize="vertical"
        minH="100px"
        onInput={(e) => e.target.style.height = `${e.target.scrollHeight}px`}
      />
    </Field.Root>
  );
}
