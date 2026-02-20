import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import FormInput from "../fields/FormInput.jsx";
import Description from "../fields/Description.jsx";
import Section from "./Section.jsx";
import Row from "./Row.jsx";
import ChefFields from "../fields/ChefFields.jsx";
import VenueFields from "../fields/VenueFields.jsx";
import { FileUploadButton } from "components/Buttons.jsx";
import { formatDate, getTomorrowDate } from "utils/formatting.js";

export default function FormFields({ event }) {
    const tomorrowStr = getTomorrowDate();
    const [startDatetime, setStartDatetime] = useState(formatDate(event?.start_datetime) || tomorrowStr);

    return (
        <Stack gap={4} w="full" px={{ base: 5, md: 0 }}>
            {/* General Section */}
            <Section title="General">
                <Stack gap={7}>
                    <FormInput label="Title" name="title"
                        defaultValue={event?.title || ""} />
                    <Row spacing={{ base: 4, md: 14 }}>
                        <FormInput label="Start Date" name="start_datetime" type="date"
                            defaultValue={startDatetime}
                            onChange={(e) => setStartDatetime(e.target.value)} />
                        <FormInput key={startDatetime} label="End Date" name="end_datetime" type="date"
                            defaultValue={formatDate(event?.end_datetime) || startDatetime} />
                    </Row>
                    <FormInput label="Reservation URL" name="reservation_url"
                        defaultValue={event?.reservation_url || ""} />
                </Stack>
            </Section>

            {/* Venue & Chef Section */}
            <Section title="Venue & Chef">
                <Stack gap={7}>
                    <VenueFields event={event} />
                    <ChefFields event={event} />
                </Stack>
            </Section>

            {/* Descriptions Section */}
            <Section title="Descriptions">
                <Stack gap={7}>
                    <Description event={event} lang="en" />
                    <Description event={event} lang="he" />
                </Stack>
            </Section>

            {/* Image Section */}
            <Section title="Image">
                <Stack gap={7} align="flex-start">
                    <FileUploadButton />
                </Stack>
            </Section>
        </Stack>   
    );
}
