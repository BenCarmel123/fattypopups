import { Stack } from "@chakra-ui/react";
import Input from "./fields/Input.jsx";
import Description from "./fields/Description.jsx";
import DraftCheckbox from "./fields/DraftCheckbox.jsx";
import { FileUploadButton } from "../../../../components/Buttons.jsx";
import { formatDate } from "../../../../utils/formatting.js";

export default function FormFields({ event, tomorrowStr }) {
    return (
        <Stack gap={4} w="full">
            <Input label="Title" name="title" 
                defaultValue={event?.title || ""} />
            <Input label="Start Date" name="start_datetime" type="date"
                defaultValue={formatDate(event?.start_datetime) || tomorrowStr} />
            <Input label="End Date" name="end_datetime" type="date"
                defaultValue={formatDate(event?.end_datetime) || tomorrowStr} />
            <Input label="Venue Name" name="venue_name" 
                defaultValue={event?.venue?.name || ""} />
            <Input label="Venue Instagram" name="venue_instagram" placeholder="@"
                defaultValue={event?.venue?.instagram_handle || ""} />
            <Input label="Venue Address" name="venue_address" 
                defaultValue={event?.venue?.address || ""} />
            <Input label="Chef Names (comma separated)" name="chef_names" 
                defaultValue={event?.chefs ? event.chefs.map(c => c.name).join(', ') : ""} />
            <Input label="Chef Instagrams (comma separated)" name="chef_instagrams" placeholder="@"
                defaultValue={event?.chefs ? event.chefs.map(c => c.instagram_handle).join(', ') : ""} />
            <Input label="Reservation URL" name="reservation_url" 
                defaultValue={event?.reservation_url || ""} />
            <Description event={event} lang="en" />
            <Description event={event} lang="he" />
            <FileUploadButton />
            {(event?.is_draft ?? true) && (
                <DraftCheckbox defaultChecked={event?.is_draft || false} />
            )}
        </Stack>
    );
}
