import { Button } from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";
import * as Config from 'config/index.jsx';

export default function WhatsAppGroupButton() {
    function handleJoin() {
        window.open(Config.WHATSAPP_GROUP_URL, Config.BLANK, Config.NO_OPENER);
    }
    return (
        <Button
            variant={Config.SOLID}
            size={[Config.SMALL, Config.MEDIUM]}
            color={Config.SECONDARY_COLOR}
            fontSize={["sm", "md"]}
            px={[3, 5]}
            py={[2, 4]}
            borderRadius="14px"
            borderBoxing='border-box'
            borderStyle={Config.SOLID}
            borderWidth='1px'
            backgroundColor={Config.TEAL_TINT}
            borderColor={Config.TEAL_BORDER_SOFT}
            _hover={{ backgroundColor: Config.TEAL_TINT_HOVER, transform: 'translateY(-1px)' }}
            transition="all 0.16s ease"
            letterSpacing="0.04em"
            fontWeight={Config.BOLD}
            whiteSpace={Config.NOWRAP}
            onClick={handleJoin}
        >
            <FaWhatsapp style={{ marginRight: '-0.25rem', fontSize: ['1.05em', '1.25em'] }} />
            {Config.WHATSAPP_GROUP_TEXT}
        </Button>
    );
}
