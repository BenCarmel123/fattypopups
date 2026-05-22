import { Textarea } from "@chakra-ui/react";
import FileUpload, { ContextFileUpload } from '../FileUpload.jsx';
import * as Config from 'config/index.jsx';
import { SubmitPromptButton, BackButton } from 'components/buttons/Buttons.jsx';

const AIDraftForm = ({ prompt, onPromptChange, onKeyDown, onSubmit, onBack, isLoading }) => (
  <form onSubmit={onSubmit} className="min-h-screen flex flex-col items-center justify-center gap-4">
    <div className="w-full max-w-xl md:max-w-3xl lg:max-w-4xl pl-6">
      <BackButton variant="default" onBack={onBack} />
    </div>
    <div className="relative flex items-end gap-2 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 w-full max-w-xl md:max-w-3xl lg:max-w-4xl">
      <Textarea
        value={prompt}
        onChange={onPromptChange}
        onKeyDown={onKeyDown}
        placeholder={Config.PROMPT_PLACEHOLDER}
        disabled={isLoading}
        borderWidth={"thick"}
        borderRadius={"1rem"}
        className="min-h-[64px] md:min-h-[100px] max-h-[400px] resize-none bg-transparent pl-1rem pr-12 py-4 px-4 text-base md:text-lg placeholder:text-slate-400"
        rows={1}
      />
      <SubmitPromptButton prompt={prompt} isLoading={isLoading} />
    </div>
    <div className="flex flex-col md:flex-row gap-4 scale-[90%] md:scale-100 origin-center">
      <FileUpload />
      <ContextFileUpload />
    </div>
  </form>
)

export default AIDraftForm
