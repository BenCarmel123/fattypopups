import { Textarea } from "@chakra-ui/react";
import FileUpload, { ContextFileUpload } from '../FileUpload.jsx';
import * as Config from 'config/index.jsx';
import { SubmitPromptButton, BackButton } from 'components/buttons/Buttons.jsx';
import * as Classes from 'config/classes.jsx';

const AIDraftForm = ({ prompt, onPromptChange, onKeyDown, onSubmit, onBack, isLoading }) => (
  <form onSubmit={onSubmit} className={Classes.DRAFT_FORM}>
    <div className={Classes.DRAFT_BACK_WRAPPER}>
      <BackButton variant="default" onBack={onBack} />
    </div>
    <div className={Classes.DRAFT_INPUT_WRAPPER}>
      <Textarea
        value={prompt}
        onChange={onPromptChange}
        onKeyDown={onKeyDown}
        placeholder={Config.PROMPT_PLACEHOLDER}
        disabled={isLoading}
        borderWidth={"thick"}
        borderRadius={"1rem"}
        className={Classes.DRAFT_TEXTAREA}
        rows={1}
      />
      <SubmitPromptButton prompt={prompt} isLoading={isLoading} />
    </div>
    <div className={Classes.DRAFT_FILE_UPLOAD_WRAPPER}>
      <FileUpload />
      <ContextFileUpload />
    </div>
  </form>
)

export default AIDraftForm
