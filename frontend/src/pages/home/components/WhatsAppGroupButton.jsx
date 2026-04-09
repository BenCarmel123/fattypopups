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
            px={2}
            py={2}
            borderRadius={Config.XL}
            borderBoxing='border-box'
            boxShadow={Config.SMALL}
            borderStyle={Config.SOLID}
            borderWidth='2px'
            backgroundColor={Config.TRANSPARENT}
            borderColor="#ffffff3d"
            _hover={{ opacity: 0.8 }}
            transition={Config.MINIMAL_TRANSITION}
            letterSpacing="normal"
            whiteSpace="nowrap"
            onClick={handleJoin}
        >
            <FaWhatsapp style={{ marginRight: '0.05rem' }} />
            {Config.WHATSAPP_GROUP_TEXT}
        </Button>
    );
}
