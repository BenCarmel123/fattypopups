import { Button, Card, Stack, Input, Field, Float, useFileUploadContext } from "@chakra-ui/react";
import { DASHBOARD } from "../../components/strings.jsx";
import validateEvent from "../../components/utils.jsx";
import { ADMIN_USERNAME, ADMIN_PASSWORD } from "../../adminRoute.js";
import  MyAlert  from "../../components/CustomAlert.jsx";
import { useState } from "react";
import FileUpload from "../../components/FileUpload.jsx";


export default function LoginForm( {handleClick} ) {
    const [alert, setAlert] = useState(undefined);

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
            setAlert({ status: "error", title: "Login Failed", description: "Invalid username or password." });
            console.log("Login failed");
        }
    }

    return (<div className="centered-content-global" style={{ position: 'relative' }}>
         {alert && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 2000, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ pointerEvents: 'auto', width: 'fit-content' }}>
                    <MyAlert {...alert} onClose={() => setAlert(null)} />
                </div>
            </div>
        )}
        <form onSubmit={handleLogin} enctype="multipart/form-data">
        <Card.Root maxW="lg" w="100%" minW="400px" padding={8} boxShadow="2xl" borderRadius="2xl">
            <Card.Header>
                <div style={{ marginBottom: 16, color: '#2596be', fontSize: 24, textDecoration: "underline" }}>Hey Hallee / Benji ! </div>
                <div style={{ fontWeight: 700, fontSize: 32 }}></div>
            </Card.Header>
            <Card.Body>
                <Stack gap={6} w="full">
                    <Field.Root>
                        <Field.Label color="#2596be" fontSize={18}>Username</Field.Label>
                        <Input name="username" size="lg" padding={6} fontSize={18} borderColor="#bbb" borderWidth={2} _focus={{ borderColor: '#2596be' }} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label color="#2596be" fontSize={18}>Password</Field.Label>
                        <Input type="password" name="password" size="lg" padding={6} fontSize={18} borderColor="#bbb" borderWidth={2} _focus={{ borderColor: '#2596be' }} />
                    </Field.Root>
                </Stack>
            </Card.Body>
            <Card.Footer justifyContent="flex-end" paddingTop={6}>
                <Button 
                    variant="solid" 
                    colorScheme="blue" 
                    ml={4} 
                    size="md" 
                    type="submit"
                    fontWeight="bold"
                    fontSize={18}
                    px={7}
                    py={5}
                    boxShadow="md"
                    _hover={{
                        bg: '#1976d2',
                        color: 'white',
                        boxShadow: 'xl',
                        transform: 'scale(1.04)'
                    }}
                >
                    Login
                </Button>
            </Card.Footer>
        </Card.Root>
        </form>
    </div>);
}

export function EventForm({ handleClick, event } ) {
    const [alert, setAlert] = useState(undefined);
    function handleEvent(e) {
        e.preventDefault(); 
        const form = e.target; // e.target is the form when using onSubmit
        const eventData = {
          title: form.title.value,
          start_datetime: form.start_datetime.value,
          end_datetime: form.end_datetime.value,
          venue_instagram: form.venue_instagram.value,
          venue_address: form.venue_address.value,
          chef_names: form.chef_names.value,
          chef_instagrams: form.chef_instagrams.value, 
          reservation_url: form.reservation_url.value,
          english_description: form.english_description.value,
          hebrew_description: form.hebrew_description.value,
          poster: form.poster.files[0] // File input
        };
        const validation = validateEvent(eventData);
        if (!validation.valid) {
            setAlert({ status: "error", title: "Validation Error", description: validation.error });
            return;
        }
        // If valid, proceed to submit the form data
        const formData = new FormData();
        formData.append('title', eventData.title);
        formData.append('start_datetime', eventData.start_datetime);
        formData.append('end_datetime', eventData.end_datetime);
        formData.append('venue_instagram', eventData.venue_instagram);
        formData.append('venue_address', eventData.venue_address);
        formData.append('chef_names', eventData.chef_names);
        formData.append('chef_instagrams', eventData.chef_instagrams);
        formData.append('reservation_url', eventData.reservation_url);
        formData.append('english_description', eventData.english_description);
        formData.append('hebrew_description', eventData.hebrew_description);
        formData.append('poster', eventData.poster);

        console.log('Submitting event:', eventData);

        fetch("http://localhost:5000/api/events", {
            method: "POST",
            body: formData,
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
            setAlert("Event created!");
        })
        .catch((err) => {
            // handle error
            setAlert("Error creating event: " + err.message);
        });
    }

    return (
        <div className="centered-content-global" style={{ position: 'relative' }}>
            {alert && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 2000, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                    <div style={{ pointerEvents: 'auto', width: 'fit-content' }}>
                        <MyAlert {...alert} onClose={() => setAlert(null)} />
                    </div>
                </div>
            )}
            <Card.Root maxW="md" w="100%" minW="350px">
                <Card.Header>
                    <div style={{ marginBottom: 8, color: '#888' }}>Event Details</div>
                </Card.Header>
                <form onSubmit={handleEvent}>
                    <Card.Body>
                        <Stack gap={4} w="full">
                            <Field.Root>
                                <Field.Label color="#2596be">Title</Field.Label>
                                <Input name="title" defaultValue={event?.title || ""} borderColor="#bbb" borderWidth={2} _focus={{ borderColor: '#2596be' }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color="#2596be">Start Date</Field.Label>
                                <Input type="date" name="start_datetime" defaultValue={event?.start_datetime || ""} borderColor="#bbb" borderWidth={2} _focus={{ borderColor: '#2596be' }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color="#2596be">End Date</Field.Label>
                                <Input type="date" name="end_datetime" defaultValue={event?.end_datetime || ""} borderColor="#bbb" borderWidth={2} _focus={{ borderColor: '#2596be' }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color="#2596be">Venue Instagram</Field.Label>
                                <Input name="venue_instagram" defaultValue={event?.venue_instagram || ""} borderColor="#bbb" borderWidth={2} _focus={{ borderColor: '#2596be' }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color="#2596be">Venue Address</Field.Label>
                                <Input name="venue_address" defaultValue={event?.venue_address || ""} borderColor="#bbb" borderWidth={2} _focus={{ borderColor: '#2596be' }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color="#2596be">Chef Names (comma separated)</Field.Label>
                                <Input name="chef_names" placeholder="e.g. Ori Salama, Ido Kablan" defaultValue={event?.chef_names ? event.chef_names.join(', ') : ""} borderColor="#bbb" borderWidth={2} _focus={{ borderColor: '#2596be' }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color="#2596be">Chef Instagrams (comma separated)</Field.Label>
                                <Input name="chef_instagrams" placeholder="e.g. @ori, @ido" defaultValue={event?.chef_instagrams ? event.chef_instagrams.join(', ') : ""} borderColor="#bbb" borderWidth={2} _focus={{ borderColor: '#2596be' }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color="#2596be">Reservation URL</Field.Label>
                                <Input name="reservation_url" defaultValue={event?.reservation_url || ""} borderColor="#bbb" borderWidth={2} _focus={{ borderColor: '#2596be' }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color="#2596be">English Description</Field.Label>
                                <Input name="english_description" defaultValue={event?.english_description || ""} borderColor="#bbb" borderWidth={2} _focus={{ borderColor: '#2596be' }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color="#2596be">Hebrew Description</Field.Label>
                                <Input name="hebrew_description" defaultValue={event?.hebrew_description || ""} borderColor="#bbb" borderWidth={2} _focus={{ borderColor: '#2596be' }} />
                            </Field.Root>
                            <Field.Root>
                                <FileUpload />
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