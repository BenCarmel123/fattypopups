import { Button } from '@chakra-ui/react';
import * as Config from 'config/index.jsx';
import { Send, Loader2, ArrowLeft, Home } from 'lucide-react';
import * as Classes from 'config/classes.jsx';

function StyledButton({ children, bgColor, hoverBg, textColor = Config.WHITE, onClick, ...props }) {
  return (
    <Button
      onClick={onClick}
      color={textColor}
      variant={Config.SOLID}
      boxShadow={Config.MEDIUM}
      borderRadius={Config.XL}
      backgroundColor={bgColor}
      _hover={{ boxShadow: Config.SHADOW_SOFT, backgroundColor: hoverBg }}
      transition={Config.MINIMAL_TRANSITION}
      {...props}
    >
      {children}
    </Button>
  );
}

export function BackButton({ homepage = false, variant = 'default', onBack }) {
  let bgColor = Config.SLATE_BG;
  let textColor = Config.SLATE_TEXT;
  let hoverBg = Config.SLATE_BG_HOVER;

  if (variant === 'about') {
    bgColor = Config.SECONDARY_COLOR;
    textColor = Config.WHITE;
    hoverBg = Config.SECONDARY_HOVER_COLOR;
  } else if (homepage) {
    bgColor = Config.SLATE_BG;
    textColor = Config.SLATE_TEXT;
    hoverBg = Config.SLATE_BG_HOVER;
  }

  return (
    <StyledButton
      onClick={onBack}
      bgColor={bgColor}
      hoverBg={hoverBg}
      textColor={textColor}
      px={4}
      py={4}
      aria-label={Config.ARIA_GO_BACK}
    >
      {homepage ? <Home size={20} /> : <ArrowLeft size={20} />}
    </StyledButton>
  );
}

export function SubmitFormButton({ text, onClick, isDraft }) {
  return (
    <StyledButton
      bgColor={Config.ADMIN_PANEL_COLOR}
      hoverBg={Config.NAVY_HOVER_COLOR}
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
      bgColor={Config.SLATE_BG}
      hoverBg={Config.SLATE_BG_HOVER}
      textColor={Config.SLATE_TEXT}
      onClick={handleClick}
      px={4}
      py={4}
      aria-label={Config.ARIA_BACK_TO_DASHBOARD}
    >
      <ArrowLeft size={20} />
    </StyledButton>
  );
}

export function SubmitPromptButton({ prompt, isLoading}) {
    return(
        <Button type="submit" size={Config.LARGE} disabled={!prompt.trim() || isLoading}
        className={Classes.SUBMIT_PROMPT_BTN}>
        {isLoading ? (
                <Loader2 className={Classes.LOADER_ICON} />
            ) : (
                <Send className={Classes.SEND_ICON} />
            )}
        </Button>)
}

export function AdminActionButton({ onClick, text }) {
  return (
    <StyledButton
      bgColor={Config.ADMIN_PANEL_COLOR}
      hoverBg={Config.NAVY_HOVER_COLOR}
      onClick={onClick}
      px={6}
      py={6}
    >
      {text}
    </StyledButton>
  );
}