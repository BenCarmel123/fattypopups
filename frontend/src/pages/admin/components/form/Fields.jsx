import { Stack } from "@chakra-ui/react";
import Input from "./fields/Input.jsx";
import Description from "./fields/Description.jsx";
import DraftCheckbox from "./fields/DraftCheckbox.jsx";
import Section from "./structure/Section.jsx";
import Row from "./structure/Row.jsx";
import { FileUploadButton } from "../../../../components/Buttons.jsx";
import { formatDate } from "../../../../utils/formatting.js";

export default function FormFields({ event, tomorrowStr }) {
    return (
        <Stack gap={4} w="full" px={{ base: 5, md: 0 }}>
            {/* General Section */}
            <Section title="General">
                <Stack gap={7}>
                    <Input label="Title" name="title" 
                        defaultValue={event?.title || ""} />
                    <Row spacing={{ base: 4, md: 14 }}>
                        <Input label="Start Date" name="start_datetime" type="date"
                            defaultValue={formatDate(event?.start_datetime) || tomorrowStr} />
                        <Input label="End Date" name="end_datetime" type="date"
                            defaultValue={formatDate(event?.end_datetime) || tomorrowStr} />
                    </Row>
                    <Input label="Reservation URL" name="reservation_url" 
                        defaultValue={event?.reservation_url || ""} />
                </Stack>
            </Section>

            {/* Venue & Chef Section */}
            <Section title="Venue & Chef">
                <Stack gap={7}>
                    <Row>
                        <Input label="Venue Name" name="venue_name" 
                            defaultValue={event?.venue?.name || ""} />
                        <Input label="Venue Instagram" name="venue_instagram" placeholder="@"
                            defaultValue={event?.venue?.instagram_handle || ""} />
                    </Row>
                    <Input label="Venue Address" name="venue_address" 
                        defaultValue={event?.venue?.address || ""} />
                    <Row>
                        <Input label="Chef Names (comma separated)" name="chef_names" 
                            defaultValue={event?.chefs ? event.chefs.map(c => c.name).join(', ') : ""} />
                        <Input label="Chef Instagrams (comma separated)" name="chef_instagrams" placeholder="@"
                            defaultValue={event?.chefs ? event.chefs.map(c => c.instagram_handle).join(', ') : ""} />
                    </Row>
                </Stack>
            </Section>

            {/* Descriptions Section */}
            <Section title="Descriptions">
                <Stack gap={7}>
                    <Description event={event} lang="en" />
                    <Description event={event} lang="he" />
                </Stack>
            </Section>

            {/* Image & Draft Section */}
            <Section title="Image & Draft">
                <Stack gap={7} align="center">
                    <FileUploadButton />
                    {(event?.is_draft ?? true) && (
                        <DraftCheckbox defaultChecked={event?.is_draft || false} />
                    )}
                </Stack>
            </Section>
        </Stack>
    );
}
