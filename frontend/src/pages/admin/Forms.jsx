import { Button, Card, Stack, Input, Field, Float, useFileUploadContext, Textarea } from "@chakra-ui/react";
import { DASHBOARD, MINIMAL_TRANSITION } from "../../components/config/strings.jsx";
import validateEvent from "../../components/utils.jsx";
import  MyAlert  from "../../components/CustomAlert.jsx";
import { useState } from "react";
import FileUpload from "../../components/FileUpload.jsx";
import { FORM_FIELD_COLOR, SECONDARY_COLOR, TEXT_AREA_COLOR, WHITE } from "../../components/config/colors.jsx"; 
import { CENTER, FLEX, RELATIVE, FIXED, MAX, NONE, AUTO, LARGE, XL, MEDIUM, SOLID, OUTLINE, MINIMAL_TRANSFORM, BOLD } from "../../components/config/strings.jsx";

const ADMIN_USERNAME = process.env.REACT_APP_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

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

    return (<div className={CENTER} style={{ position: RELATIVE, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
         {alert && (
            <div style={{ position: FIXED, top: 0, left: 0, width: MAX, zIndex: 2000, display: FLEX, justifyContent: CENTER, pointerEvents: NONE }}>
                <div style={{ pointerEvents: AUTO, width: 'fit-content' }}>
                    <MyAlert {...alert} onClose={() => setAlert(null)} />
                </div>
            </div>
        )}
        <form onSubmit={handleLogin} enctype="multipart/form-data">
        <Card.Root maxW={LARGE} w={MAX} minW="400px" padding={8} boxShadow={XL} borderRadius={XL}>
            <Card.Header>
                <div style={{ marginBottom: 16, color: FORM_FIELD_COLOR, fontSize: 24, textDecoration: "underline" }}>Hey Hallee / Benji ! </div>
                <div style={{ fontWeight: 700, fontSize: 32 }}></div>
            </Card.Header>
            <Card.Body>
                <Stack gap={6} w="full">
                    <Field.Root>
                        <Field.Label color={FORM_FIELD_COLOR} fontSize={18}>Username</Field.Label>
                        <Input name="username" size={LARGE} padding={6} fontSize={18} borderColor={TEXT_AREA_COLOR} borderWidth={2} _focus={{ borderColor: FORM_FIELD_COLOR }} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label color={FORM_FIELD_COLOR} fontSize={18}>Password</Field.Label>
                        <Input type="password" name="password" size={LARGE} padding={6} fontSize={18} borderColor={TEXT_AREA_COLOR} borderWidth={2} _focus={{ borderColor: FORM_FIELD_COLOR }} />
                    </Field.Root>
                </Stack>
            </Card.Body>
            <Card.Footer justifyContent="flex-end" paddingTop={6}>
                <Button 
                    variant={SOLID} 
                    colorScheme="blue" 
                    ml={4} 
                    size={MEDIUM} 
                    type="submit"
                    fontWeight={BOLD}
                    fontSize={18}
                    px={7}
                    py={5}
                    boxShadow={MEDIUM}
                    _hover={{
                        bg: SECONDARY_COLOR,
                        color: WHITE,
                        boxShadow: XL,
                        transform: MINIMAL_TRANSFORM
                    }}
                >
                    Login
                </Button>
            </Card.Footer>
        </Card.Root>
        </form>
    </div>);
}

export function EventForm({ handleClick, event, isEdit } ) {
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
        const method = isEdit ? "PUT" : "POST";
        const url = isEdit ? `${SERVER_URL}/api/events/${event.id}` : `${SERVER_URL}/api/events`;

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
        fetch(url, {
            method: method,
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
            setAlert({
                status: "success",
                title: isEdit ? "Event Updated" : "Event Created",
                description: isEdit ? "The event was successfully updated." : "The event was successfully added."
            });
        })
        .catch((err) => {
            // handle error
            setAlert({
                status: "error", title: "Submission Error", description: err.message
            });
        });
    }

    return (
        <div className={CENTER} style={{ position: RELATIVE, display: FLEX, alignItems: CENTER, justifyContent: CENTER, minHeight: '100vh' }}>
            {alert && (
                <div style={{ position: FIXED, top: 0, left: 0, width: MAX, zIndex: 2000, display: FLEX, justifyContent: CENTER, pointerEvents: NONE }}>
                    <div style={{ pointerEvents: AUTO, width: 'fit-content' }}>
                        <MyAlert {...alert} onClose={() => setAlert(null)} />
                    </div>
                </div>
            )}
            <Card.Root maxW={MEDIUM} w={MAX} minW="350px">
                <form onSubmit={handleEvent}>
                    <Card.Body>
                        <Stack gap={4} w="full">
                            <Field.Root>
                                <Field.Label color={FORM_FIELD_COLOR}>Title</Field.Label>
                                <Input name="title" defaultValue={event?.title || ""} borderColor={TEXT_AREA_COLOR} borderWidth={2} _focus={{ borderColor: FORM_FIELD_COLOR }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color={FORM_FIELD_COLOR}>Start Date</Field.Label>
                                <Input type="date" name="start_datetime" defaultValue={event?.start_datetime || ""} borderColor={TEXT_AREA_COLOR} borderWidth={2} _focus={{ borderColor: FORM_FIELD_COLOR }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color={FORM_FIELD_COLOR}>End Date</Field.Label>
                                <Input type="date" name="end_datetime" defaultValue={event?.end_datetime || ""} borderColor={TEXT_AREA_COLOR} borderWidth={2} _focus={{ borderColor: FORM_FIELD_COLOR }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color={FORM_FIELD_COLOR}>Venue Instagram</Field.Label>
                                <Input name="venue_instagram" defaultValue={event?.venue_instagram || ""} borderColor={TEXT_AREA_COLOR} borderWidth={2} _focus={{ borderColor: FORM_FIELD_COLOR }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color={FORM_FIELD_COLOR}>Venue Address</Field.Label>
                                <Input name="venue_address" defaultValue={event?.venue_address || ""} borderColor={TEXT_AREA_COLOR} borderWidth={2} _focus={{ borderColor: FORM_FIELD_COLOR }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color={FORM_FIELD_COLOR}>Chef Names (comma separated)</Field.Label>
                                <Input name="chef_names" placeholder="e.g. Ori Salama, Ido Kablan" defaultValue={event?.chef_names ? event.chef_names.join(', ') : ""} borderColor={TEXT_AREA_COLOR} borderWidth={2} _focus={{ borderColor: FORM_FIELD_COLOR }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color={FORM_FIELD_COLOR}>Chef Instagrams (comma separated)</Field.Label>
                                <Input name="chef_instagrams" placeholder="e.g. @ori, @ido" defaultValue={event?.chef_instagrams ? event.chef_instagrams.join(', ') : ""} borderColor={TEXT_AREA_COLOR} borderWidth={2} _focus={{ borderColor: FORM_FIELD_COLOR }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color={FORM_FIELD_COLOR}>Reservation URL</Field.Label>
                                <Input name="reservation_url" defaultValue={event?.reservation_url || ""} borderColor={TEXT_AREA_COLOR} borderWidth={2} _focus={{ borderColor: FORM_FIELD_COLOR }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color={FORM_FIELD_COLOR}>English Description</Field.Label>
                                <Textarea
                                    name="english_description"
                                    defaultValue={event?.english_description || ""}
                                    borderColor={TEXT_AREA_COLOR}
                                    borderWidth={2}
                                    _focus={{ borderColor: FORM_FIELD_COLOR }}
                                    resize="vertical"
                                    minH="100px"
                                    onInput={(e) => e.target.style.height = `${e.target.scrollHeight}px`}
                                />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color={FORM_FIELD_COLOR}>Hebrew Description</Field.Label>
                                <Textarea
                                    name="hebrew_description"
                                    defaultValue={event?.hebrew_description || ""}
                                    borderColor={TEXT_AREA_COLOR}
                                    borderWidth={2}
                                    _focus={{ borderColor: FORM_FIELD_COLOR }}
                                    resize="vertical"
                                    minH="100px"
                                    onInput={(e) => e.target.style.height = `${e.target.scrollHeight}px`}
                                />
                            </Field.Root>
                            <Field.Root>
                                <Button 
                                    colorScheme="blue"
                                    variant={SOLID}
                                        size={LARGE}
                                        fontWeight={BOLD}
                                    px={2} 
                                    py={2} 
                                    boxShadow={MEDIUM}
                                    borderRadius={XL} 
                                    _hover={{ bg: '#3182ce', color: WHITE, transform: MINIMAL_TRANSFORM }} 
                                    transition={MINIMAL_TRANSITION}
                                    as="label"
                                >
                                    <FileUpload style={{ display: 'none' }} />
                                </Button>
                            </Field.Root>
                        </Stack>
                    </Card.Body>
                    <Card.Footer justifyContent="flex-end">
                        <Button 
                            colorScheme="gray" 
                            variant={OUTLINE} 
                            size={LARGE} 
                            fontWeight={BOLD} 
                            px={8} 
                            py={6} 
                            borderRadius={XL} 
                            _hover={{ bg: '#edf2f7', color: '#2d3748', transform: MINIMAL_TRANSFORM }} 
                            transition={MINIMAL_TRANSITION} 
                            onClick={handleClick(DASHBOARD)} 
                            type="button">
                            Back
                        </Button>
                        <Button 
                            colorScheme="blue" 
                            variant={SOLID} 
                            size={LARGE} 
                            fontWeight={BOLD} 
                            px={8} 
                            py={6} 
                            boxShadow={MEDIUM} 
                            borderRadius={XL} 
                            _hover={{ bg: '#3182ce', color: WHITE, transform: MINIMAL_TRANSFORM }} 
                            transition={MINIMAL_TRANSITION} 
                            type="submit">
                            Add Event
                        </Button>
                    </Card.Footer>
                </form>
            </Card.Root>
        </div>
    );
}