import { Field, Textarea } from "@chakra-ui/react";
import * as Config from 'config/index.jsx';

export default function FormTextArea({ event, lang = 'en' }) {
  const value = lang === 'en' ? event?.english_description || "" : event?.hebrew_description || "";
  const label = lang === 'en' ? 'English Description' : 'Hebrew Description';
  const name = lang === 'en' ? 'english_description' : 'hebrew_description';
  const isHebrew = lang === 'he';

  return (
    <Field.Root>
      <Field.Label color={Config.FORM_INPUT_COLOR}>{label}</Field.Label>
      <Textarea
        name={name}
        defaultValue={value}
        borderColor={Config.FORM_BORDER_COLOR}
        borderWidth={2}
        _focus={{ borderColor: Config.FORM_INPUT_COLOR }}
        resize="vertical"
        minH="100px"
        dir={isHebrew ? 'rtl' : 'ltr'}
        textAlign={isHebrew ? 'right' : 'left'}
        sx={{ unicodeBidi: 'plaintext', lineHeight: 1.7, overflowWrap: 'anywhere', wordBreak: 'break-word' }}
        onInput={(e) => e.target.style.height = `${e.target.scrollHeight}px`}
        paddingLeft={isHebrew ? 2 : 4}
        paddingRight={isHebrew ? 4 : 2}
      />
    </Field.Root>
  );
}
