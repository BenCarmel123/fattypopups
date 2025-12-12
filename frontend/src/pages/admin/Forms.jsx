import { Button, Card, Stack, Input, Field, Textarea } from "@chakra-ui/react";
import { DASHBOARD, MINIMAL_TRANSITION } from "../../components/config/strings.jsx";
import validateEvent from "../../components/utils.jsx";
import  MyAlert  from "../../components/CustomAlert.jsx";
import { useState } from "react";
import FileUpload from "../../components/FileUpload.jsx";
import { FORM_FIELD_COLOR, TEXT_AREA_COLOR, TRANSPARENT, WHITE } from "../../components/config/colors.jsx"; 
import { CENTER, FLEX, RELATIVE, FIXED, MAX, NONE, AUTO, LARGE, XL, MEDIUM, SOLID, MINIMAL_TRANSFORM, BOLD } from "../../components/config/strings.jsx";
import { formatDate } from "../../components/utils.jsx";
import { BackButton, SubmitFormButton } from "../../components/Buttons.jsx";

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
            console.log("[DEBUG] - Login successful");
            handleClick(DASHBOARD)();
        } else {
            setAlert({ status: "error", title: "Login Failed", description: "Invalid username or password." });
            console.log("[DEBUG] - Login failed");
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
                <SubmitFormButton text="Login" />
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
        const validation = validateEvent(eventData, isEdit);
        if (!validation.valid) {
            setAlert({ status: "error", description: validation.error });
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
            <Card.Root backgroundColor={TRANSPARENT} marginBottom="4rem" maxW="800px" w={MAX} minW="300px" boxShadow={NONE} borderRadius={XL}>
                <br></br> <br></br>
                <BackButton marginBottom="2rem" />
                <form className onSubmit={handleEvent} style={{ backgroundColor: WHITE, enctype: "multipart/form-data", borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    <Card.Body>
                        <Stack gap={4} w="full">
                            <Field.Root>
                                <Field.Label color={FORM_FIELD_COLOR}>Title</Field.Label>
                                <Input name="title" defaultValue={event?.title || ""} borderColor={TEXT_AREA_COLOR} borderWidth={2} _focus={{ borderColor: FORM_FIELD_COLOR }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color={FORM_FIELD_COLOR}>Start Date</Field.Label>
                                <Input type="date" name="start_datetime" defaultValue={formatDate(event?.start_datetime) || ""} borderColor={TEXT_AREA_COLOR} borderWidth={2} _focus={{ borderColor: FORM_FIELD_COLOR }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color={FORM_FIELD_COLOR}>End Date</Field.Label>
                                <Input type="date" name="end_datetime" defaultValue={formatDate(event?.end_datetime) || ""} borderColor={TEXT_AREA_COLOR} borderWidth={2} _focus={{ borderColor: FORM_FIELD_COLOR }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color={FORM_FIELD_COLOR}>Venue Instagram</Field.Label>
                                <Input name="venue_instagram" placeholder="@" defaultValue={event?.venue_instagram || ""} borderColor={TEXT_AREA_COLOR} borderWidth={2} _focus={{ borderColor: FORM_FIELD_COLOR }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color={FORM_FIELD_COLOR}>Venue Address</Field.Label>
                                <Input name="venue_address" defaultValue={event?.venue_address || ""} borderColor={TEXT_AREA_COLOR} borderWidth={2} _focus={{ borderColor: FORM_FIELD_COLOR }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color={FORM_FIELD_COLOR}>Chef Names (comma separated)</Field.Label>
                                <Input name="chef_names" defaultValue={event?.chef_names ? event.chef_names.join(', ') : ""} borderColor={TEXT_AREA_COLOR} borderWidth={2} _focus={{ borderColor: FORM_FIELD_COLOR }} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label color={FORM_FIELD_COLOR}>Chef Instagrams (comma separated)</Field.Label>
                                <Input name="chef_instagrams" placeholder="@" defaultValue={event?.chef_instagrams ? event.chef_instagrams.join(', ') : ""} borderColor={TEXT_AREA_COLOR} borderWidth={2} _focus={{ borderColor: FORM_FIELD_COLOR }} />
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
                                    variant={SOLID}
                                    size={LARGE}
                                    fontWeight={BOLD}
                                    px={2} 
                                    py={2} 
                                    boxShadow={MEDIUM}
                                    borderRadius={XL} 
                                    backgroundColor={FORM_FIELD_COLOR}
                                    _hover={{ transform: MINIMAL_TRANSFORM }} 
                                    transition={MINIMAL_TRANSITION}
                                    as="label"
                                >
                                    <FileUpload style={{ display: 'none'}} />
                                </Button>
                            </Field.Root>
                        </Stack>
                    </Card.Body>
                    <Card.Footer>
                        <SubmitFormButton text={isEdit ? "Update" : "Add"} />
                    </Card.Footer>
                </form>
            </Card.Root>
        </div>
    );
}