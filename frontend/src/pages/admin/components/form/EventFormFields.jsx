import { Stack } from "@chakra-ui/react";
import FormField from "./FormField.jsx";
import DescriptionArea from "./DescriptionArea.jsx";
import SaveAsDraft from "./SaveAsDraft.jsx";
import { FileUploadButton } from "../../../../components/Buttons.jsx";
import { formatDate } from "../../../../utils/formatting.js";

export default function EventFormFields({ event, tomorrowStr }) {
    return (
        <Stack gap={4} w="full">
            <FormField label="Title" name="title" 
                defaultValue={event?.title || ""} />
            <FormField label="Start Date" name="start_datetime" type="date"
                defaultValue={formatDate(event?.start_datetime) || tomorrowStr} />
            <FormField label="End Date" name="end_datetime" type="date"
                defaultValue={formatDate(event?.end_datetime) || tomorrowStr} />
            <FormField label="Venue Name" name="venue_name" 
                defaultValue={event?.venue?.name || ""} />
            <FormField label="Venue Instagram" name="venue_instagram" placeholder="@"
                defaultValue={event?.venue?.instagram_handle || ""} />
            <FormField label="Venue Address" name="venue_address" 
                defaultValue={event?.venue?.address || ""} />
            <FormField label="Chef Names (comma separated)" name="chef_names" 
                defaultValue={event?.chefs ? event.chefs.map(c => c.name).join(', ') : ""} />
            <FormField label="Chef Instagrams (comma separated)" name="chef_instagrams" placeholder="@"
                defaultValue={event?.chefs ? event.chefs.map(c => c.instagram_handle).join(', ') : ""} />
            <FormField label="Reservation URL" name="reservation_url" 
                defaultValue={event?.reservation_url || ""} />
            <DescriptionArea event={event} lang="en" />
            <DescriptionArea event={event} lang="he" />
            <FileUploadButton />
            {(event?.is_draft ?? true) && (
                <SaveAsDraft defaultChecked={event?.is_draft || false} />
            )}
        </Stack>
    );
}
