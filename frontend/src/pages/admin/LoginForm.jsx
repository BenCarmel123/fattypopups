import { Card, Stack, Input, Field } from "@chakra-ui/react";
import { DASHBOARD, CENTER, FLEX, RELATIVE, FIXED, MAX, NONE, AUTO, LARGE, XL } from "../../components/config/strings.jsx";
import MyAlert from "../../components/CustomAlert.jsx";
import { useState } from "react";
import { FORM_FIELD_COLOR, TEXT_AREA_COLOR } from "../../components/config/colors.jsx";
import { SubmitFormButton } from "../../components/Buttons.jsx";


const ADMIN_USERNAME = process.env.REACT_APP_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;

export default function LoginForm( {handleClick} ) {
    const [alert, setAlert] = useState(undefined);

    const handleLogin = (e) =>
    {
        e.preventDefault();
        const form = e.target; 
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