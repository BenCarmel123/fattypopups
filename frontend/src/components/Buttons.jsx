import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import * as Config from '../config/index.jsx';
import { Send, Loader2 } from 'lucide-react';
import FileUpload from "./FileUpload.jsx";

export function BackButton({ homepage = false }) {
  const navigate = useNavigate();
  return (
        <button
            onClick={() => navigate(homepage ? '/' : -1)}
            className="text-sm text-gray-600 underline hover:text-gray-800"
            aria-label="Go back"
            style={{ cursor: Config.POINTER }}>
            {homepage ? Config.HOMEPAGE_BUTTON_TEXT : Config.BACK_BUTTON_TEXT}
        </button>
    );
}

export function SubmitFormButton({ text, onClick, isDraft }) {
    return (
 <Button
    color={Config.WHITE}
    backgroundColor={Config.ADMIN_PANEL_COLOR}
    variant={Config.SOLID}
    size={Config.MEDIUM}
    fontWeight={Config.BOLD}
    px={4}
    py={4}
    boxShadow={Config.MEDIUM}
    borderRadius={Config.XL}
    _hover={{transition:Config.MINIMAL_TRANSITION, transform: Config.MINIMAL_TRANSFORM }}
    type="submit"
    onClick={onClick}>
    {text}
    </Button>
    );
}

export function BackToDashboard({ handleClick }) {
    return (<Button
            color={Config.WHITE}
            backgroundColor={ Config.BACK_TO_DASHBOARD_BUTTON_COLOR }
            variant={Config.SOLID}
            size={Config.MEDIUM}
            fontWeight={Config.BOLD}
            py={4}
            px={4}
            boxShadow={Config.MEDIUM}
            borderRadius={Config.XL}
            onClick={handleClick}
            _hover={{transition:Config.MINIMAL_TRANSITION, transform: Config.MINIMAL_TRANSFORM }} >
            Back
            </Button>);
}

export function SubmitPromptButton({ prompt, isLoading}) {
    return(
        <Button type="submit" size="lg" disabled={!prompt.trim() || isLoading}
        className="absolute right-3 bottom-3 h-11 w-11 md:h-12 md:w-12 rounded-xl bg-slate-100
        hover:bg-slate-200 disabled:bg-slate-100 disabled:text-slate-400 transition-all duration-200">
        {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Send className="h-4 w-4" />
            )}
        </Button>)
}

export function FileUploadButton() {
    return (<Button
            variant={Config.SOLID}
            size={Config.LARGE}
            fontWeight={Config.BOLD}
            px={2}
            py={2}
            boxShadow={Config.MEDIUM}
            borderRadius={Config.XL}
            backgroundColor={Config.ADMIN_PANEL_COLOR}
            _hover={{ transform: Config.MINIMAL_TRANSFORM }}
            transition={Config.MINIMAL_TRANSITION}
            as="label">
            <FileUpload style={{ display: Config.NONE}} />
        </Button>);
}

export function AdminActionButton({ onClick, text }) {
    return (
        <Button
            color={Config.WHITE}
            variant={Config.SOLID}
            px={6}
            py={6}
            boxShadow={Config.MEDIUM}
            borderRadius={Config.XL}
            backgroundColor={Config.ADMIN_PANEL_COLOR}
            _hover={{ transform: Config.MINIMAL_TRANSFORM }}
            transition={Config.MINIMAL_TRANSITION}
            onClick={onClick}
        >
            {text}
        </Button>
    );
}