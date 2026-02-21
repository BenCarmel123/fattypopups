import { Button, Float, useFileUploadContext, FileUpload as ChakraFileUpload } from "@chakra-ui/react";
import * as Config from "../config/index.jsx";

function FileUploadList()
{
    const fileUpload = useFileUploadContext();
    const files = fileUpload?.acceptedFiles || [];
    if (files.length === 0) return null;
    return (
        <ChakraFileUpload.ItemGroup>
            {files.map((file) => (
                <ChakraFileUpload.Item
                    w={Config.AUTO}
                    boxSize="20"
                    p="2"
                    file={file}
                    key={file.name}
                >
                    <ChakraFileUpload.ItemPreviewImage />
                    <Float placement="top-end">
                        <ChakraFileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
                            <Config.LuX />
                        </ChakraFileUpload.ItemDeleteTrigger>
                    </Float>
                </ChakraFileUpload.Item>
            ))}
        </ChakraFileUpload.ItemGroup>
    );
};

function FileUploadTrigger({ name, label }) {
    return (
        <ChakraFileUpload.Root name={name} accept="image/*" maxFiles={1}>
            <ChakraFileUpload.HiddenInput />
            <div style={{ display: Config.FLEX, gap: '2rem', alignItems: Config.CENTER, justifyContent: Config.CENTER }}>
                <ChakraFileUpload.Trigger asChild>
                    <Button variant={Config.OUTLINE} size={Config.SMALL}>
                        <Config.LuFileImage /> {label}
                    </Button>
                </ChakraFileUpload.Trigger>
                <FileUploadList />
            </div>
        </ChakraFileUpload.Root>
    );
};

function FileUploadButton({ name, label }) {
    return (
        <Button
            variant={Config.SOLID}
            size={Config.LARGE}
            fontWeight={Config.BOLD}
            px={2}
            py={2}
            boxShadow={Config.MEDIUM}
            borderRadius={Config.XL}
            backgroundColor={Config.ADMIN_PANEL_COLOR}
            _hover={{ transform: Config.MINIMAL_TRANSFORM }}
            transition={Config.MINIMAL_TRANSITION}
            as="label">
            <FileUploadTrigger name={name} label={label} />
        </Button>
    );
};

export default function FileUpload() {
    return <FileUploadButton name="poster" label="Event Poster" />;
};

export function ContextFileUpload() {
    return <FileUploadButton name="context_image" label="Context Image" />;
};

export { FileUploadList };
