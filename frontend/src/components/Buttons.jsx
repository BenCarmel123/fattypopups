import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { 
  WHITE, 
  ADMIN_PANEL_COLOR, 
  BACK_TO_DASHBOARD_BUTTON_COLOR,
  SOLID, 
  BOLD, 
  XL, 
  MEDIUM, 
  MINIMAL_TRANSFORM, 
  MINIMAL_TRANSITION, 
  POINTER, 
  BACK_BUTTON_TEXT, 
  LARGE 
} from '../config/index.jsx';
import { Send, Loader2 } from 'lucide-react';
import FileUpload from "./FileUpload.jsx";

export function BackButton() {
  const navigate = useNavigate();
  return (
        <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 underline hover:text-gray-800"
            aria-label="Go back"
            style={{ cursor: POINTER }}>
            {BACK_BUTTON_TEXT}
        </button>
    );
}

export function SubmitFormButton({ text, onClick }) {
    return (
 <Button
    color={WHITE}
    backgroundColor={ADMIN_PANEL_COLOR}
    variant={SOLID}
    size={MEDIUM}
    fontWeight={BOLD}
    px={4}
    py={4}
    boxShadow={MEDIUM}
    borderRadius={XL}
    _hover={{transition:MINIMAL_TRANSITION, transform: MINIMAL_TRANSFORM }}
    type="submit"
    onClick={onClick}>
    {text}
    </Button>
    );
}

export function BackToDashboard({ handleClick }) {
    return (<Button 
            color={WHITE}
            backgroundColor={ BACK_TO_DASHBOARD_BUTTON_COLOR }
            variant={SOLID} 
            size={MEDIUM} 
            fontWeight={BOLD} 
            py={4}
            px={4}
            boxShadow={MEDIUM} 
            borderRadius={XL} 
            onClick={handleClick}
            _hover={{transition:MINIMAL_TRANSITION, transform: MINIMAL_TRANSFORM }} >
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
            variant={SOLID}
            size={LARGE}
            fontWeight={BOLD}
            px={2} 
            py={2} 
            boxShadow={MEDIUM}
            borderRadius={XL} 
            backgroundColor={ADMIN_PANEL_COLOR}
            _hover={{ transform: MINIMAL_TRANSFORM }} 
            transition={MINIMAL_TRANSITION}
            as="label">
            <FileUpload style={{ display: 'none'}} />
        </Button>);
}

export function AdminActionButton({ onClick, text }) {
    return (
        <Button
            color={WHITE}
            variant={SOLID}
            px={6}
            py={6}
            boxShadow={MEDIUM}
            borderRadius={XL}
            backgroundColor={ADMIN_PANEL_COLOR}
            _hover={{ transform: MINIMAL_TRANSFORM }}
            transition={MINIMAL_TRANSITION}
            onClick={onClick}
        >
            {text}
        </Button>
    );
}