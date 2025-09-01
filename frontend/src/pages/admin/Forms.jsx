import { Button, Card, Stack, Input, Field } from "@chakra-ui/react";
import { DASHBOARD, LOGIN } from "../../components/strings.jsx";
import validateEvent from "../../components/utils.jsx";
import { ADMIN_USERNAME, ADMIN_PASSWORD } from "../../adminRoute.js";

export default function LoginForm( {handleClick} ) {
    const handleLogin = (e) =>
    {
        e.preventDefault();
        const form = e.target; // e.target is the form when using onSubmit
        const username = form.username.value;
        const password = form.password.value;
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            console.log("Login successful");
            handleClick(DASHBOARD)();
        } else {
            console.log("Login failed");
        }
    }

    return (<div className="centered-content-global">
            <form onSubmit={handleLogin}>
        <Card.Root maxW="md" w="100%" minW="350px">
            <Card.Header>
                <div style={{ marginBottom: 8, color: '#888' }}>Hey Benji</div>
                <div style={{ fontWeight: 700, fontSize: 24 }}>Login</div>
            </Card.Header>
            <Card.Body>
                <Stack gap={4} w="full">
                    <Field.Root>
                        <Field.Label color="#2596be">Username</Field.Label>
                        <Input name="username" />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label color="#2596be">Password</Field.Label>
                        <Input type="password" name="password" />
                    </Field.Root>
                </Stack>
            </Card.Body>
            <Card.Footer justifyContent="flex-end">
                <Button variant="subtle" colorPalette="blue" ml={2} type="submit">Login</Button>
            </Card.Footer>
        </Card.Root>
        </form>
    </div>);
}

export function EventForm({ handleClick, event } ) {
    function handleEvent(e) {
        e.preventDefault(); 
        const form = e.target; // e.target is the form when using onSubmit
        const event = {
            title: form.title.value,
            description: form.description.value,
            start_datetime: form.start_datetime.value,
            end_datetime: form.end_datetime.value,
            venue_instagram: form.venue_instagram.value,
            venue_address: form.venue_address.value,
            chef_names: form.chef_names.value.split(',').map(s => s.trim()),
            chef_instagrams: form.chef_instagrams.value.split(',').map(s => s.trim()),
            image_url: form.image_url.value,
            reservation_url: form.reservation_url.value
        };
        const validation = validateEvent(event);
        if (!validation.valid) {
            console.log("Validation Error: " + validation.error);
            return;
        }
        fetch("http://localhost:5000/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event),
        })
        .then(async res => {
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Unknown error');
            }
            return res.json();
        })
        .then(() => {
            // handle success (e.g., show a message, reset form, etc.)
            alert("Event created!");
        })
        .catch((err) => {
            // handle error
            alert("Error creating event: " + err.message);
        });
    }
    return (
        <div className="centered-content-global">
            <Card.Root maxW="md" w="100%" minW="350px">
                <Card.Header>
                    <div style={{ marginBottom: 8, color: '#888' }}>Add New Event</div>
                </Card.Header>
                <form onSubmit={handleEvent}>
                    <Card.Body>
                        <Stack gap={4} w="full">
                            <Field.Root>
                                <Field.Label color="#2596be">Title</Field.Label>
                                <Input name="title" defaultValue={event?.title || ""} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color="#2596be">Description</Field.Label>
                                <Input name="description" defaultValue={event?.description || ""} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color="#2596be">Start Date & Time</Field.Label>
                                <Input type="datetime-local" name="start_datetime" defaultValue={event?.start_datetime || ""} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color="#2596be">End Date & Time</Field.Label>
                                <Input type="datetime-local" name="end_datetime" defaultValue={event?.end_datetime || ""} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color="#2596be">Venue Instagram</Field.Label>
                                <Input name="venue_instagram" defaultValue={event?.venue_instagram || ""} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color="#2596be">Venue Address</Field.Label>
                                <Input name="venue_address" defaultValue={event?.venue_address || ""} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color="#2596be">Chef Names (comma separated)</Field.Label>
                                <Input name="chef_names" placeholder="e.g. Ori Salama, Ido Kablan" defaultValue={event?.chef_names ? event.chef_names.join(', ') : ""} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color="#2596be">Chef Instagrams (comma separated)</Field.Label>
                                <Input name="chef_instagrams" placeholder="e.g. @ori, @ido" defaultValue={event?.chef_instagrams ? event.chef_instagrams.join(', ') : ""} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color="#2596be">Image URL</Field.Label>
                                <Input name="image_url" defaultValue={event?.image_url || ""} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color="#2596be">Reservation URL</Field.Label>
                                <Input name="reservation_url" defaultValue={event?.reservation_url || ""} />
                            </Field.Root>
                        </Stack>
                    </Card.Body>
                    <Card.Footer justifyContent="flex-end">
                        <Button variant="ghost" onClick={handleClick(DASHBOARD)} type="button">Cancel</Button>
                        <Button variant="subtle" colorPalette="blue" ml={2} type="submit">Add Event</Button>
                    </Card.Footer>
                </form>
            </Card.Root>
        </div>
    );
}