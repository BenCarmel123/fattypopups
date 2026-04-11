import { Button } from '@chakra-ui/react';
import * as Config from 'config/index.jsx';
import { Send, Loader2, ArrowLeft, Home } from 'lucide-react';

function StyledButton({ children, bgColor, hoverBg, textColor = Config.WHITE, onClick, ...props }) {
  return (
    <Button
      onClick={onClick}
      color={textColor}
      variant={Config.SOLID}
      boxShadow={Config.MEDIUM}
      borderRadius={Config.XL}
      backgroundColor={bgColor}
      _hover={{ boxShadow: '0 12px 24px rgba(0,0,0,0.15)', backgroundColor: hoverBg }}
      transition={Config.MINIMAL_TRANSITION}
      {...props}
    >
      {children}
    </Button>
  );
}

export function BackButton({ homepage = false, variant = 'default', onBack }) {
  let bgColor = '#f1f5f9';
  let textColor = '#4b5563';
  let hoverBg = '#e2e8f0';

  if (variant === 'about') {
    bgColor = Config.SECONDARY_COLOR;
    textColor = Config.WHITE;
    hoverBg = '#2a6563';
  } else if (homepage) {
    bgColor = '#f1f5f9';
    textColor = '#4b5563';
    hoverBg = '#e2e8f0';
  }

  return (
    <StyledButton
      onClick={onBack}
      bgColor={bgColor}
      hoverBg={hoverBg}
      textColor={textColor}
      px={4}
      py={4}
      aria-label="Go back"
    >
      {homepage ? <Home size={20} /> : <ArrowLeft size={20} />}
    </StyledButton>
  );
}

export function SubmitFormButton({ text, onClick, isDraft }) {
  return (
    <StyledButton
      bgColor={Config.ADMIN_PANEL_COLOR}
      hoverBg="#1a365d"
      onClick={onClick}
      size={Config.MEDIUM}
      fontWeight={Config.BOLD}
      px={6}
      py={6}
      type="submit"
    >
      {text}
    </StyledButton>
  );
}

export function BackToDashboard({ handleClick }) {
  return (
    <StyledButton
      bgColor="#f1f5f9"
      hoverBg="#e2e8f0"
      textColor="#4b5563"
      onClick={handleClick}
      px={4}
      py={4}
      aria-label="Back to dashboard"
    >
      <ArrowLeft size={20} />
    </StyledButton>
  );
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

export function AdminActionButton({ onClick, text }) {
  return (
    <StyledButton
      bgColor={Config.ADMIN_PANEL_COLOR}
      hoverBg="#1a365d"
      onClick={onClick}
      px={6}
      py={6}
    >
      {text}
    </StyledButton>
  );
}