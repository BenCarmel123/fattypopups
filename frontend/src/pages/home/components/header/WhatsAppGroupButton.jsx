import { Button } from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";
import * as Config from 'config/index.jsx';

export default function WhatsAppGroupButton() {
    function handleJoin() {
        window.open(Config.WHATSAPP_GROUP_URL, '_blank', 'noopener,noreferrer');
    }
    return (
        <Button
            variant={Config.SOLID}
            size={Config.SMALL}
            color={Config.SECONDARY_COLOR}
            px={[3, 4]}
            py={[2, 3]}
            borderRadius="14px"
            borderBoxing='border-box'
            borderStyle={Config.SOLID}
            borderWidth='1px'
            backgroundColor={Config.TEAL_TINT}
            borderColor={Config.TEAL_BORDER_SOFT}
            _hover={{ backgroundColor: Config.TEAL_TINT_HOVER, transform: 'translateY(-1px)' }}
            transition="all 0.16s ease"
            letterSpacing="0.04em"
            fontWeight="bold"
            whiteSpace="nowrap"
            onClick={handleJoin}
        >
            <FaWhatsapp style={{ marginRight: '-0.25rem', fontSize: ['1.05em', '1.25em'] }} />
            {Config.WHATSAPP_GROUP_TEXT}
        </Button>
    );
}
