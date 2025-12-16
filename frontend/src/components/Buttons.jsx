import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { WHITE, ADMIN_PANEL_COLOR } from './config/colors.jsx';
import { SOLID, LARGE, BOLD, XL, MEDIUM, MINIMAL_TRANSFORM, MINIMAL_TRANSITION, POINTER, BACK_BUTTON_TEXT } from './config/strings.jsx';

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

export function SubmitFormButton({ text }) {
    return (
 <Button 
    color={WHITE}
    backgroundColor={ADMIN_PANEL_COLOR}
    variant={SOLID} 
    size={LARGE} 
    fontWeight={BOLD} 
    px={8} 
    py={6} 
    boxShadow={MEDIUM} 
    borderRadius={XL} 
    _hover={{transition:MINIMAL_TRANSITION, transform: MINIMAL_TRANSFORM }} 
    type="submit">
    {text}
    </Button>
    );
}