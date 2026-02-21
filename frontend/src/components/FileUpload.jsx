import { Button, Float, useFileUploadContext, FileUpload as ChakraFileUpload } from "@chakra-ui/react";
import { LuFileImage, LuX, AUTO, SMALL, OUTLINE, SOLID, LARGE, BOLD, MEDIUM, XL, MINIMAL_TRANSFORM, MINIMAL_TRANSITION } from "../config/index.jsx";
import { ADMIN_PANEL_COLOR } from "../config/colors.jsx";

function FileUploadList()
{
    const fileUpload = useFileUploadContext();
    const files = fileUpload?.acceptedFiles || [];
    if (files.length === 0) return null;
    return (
        <ChakraFileUpload.ItemGroup>
            {files.map((file) => (
                <ChakraFileUpload.Item
                    w={AUTO}
                    boxSize="20"
                    p="2"
                    file={file}
                    key={file.name}
                >
                    <ChakraFileUpload.ItemPreviewImage />
                    <Float placement="top-end">
                        <ChakraFileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
                            <LuX />
                        </ChakraFileUpload.ItemDeleteTrigger>
                    </Float>
                </ChakraFileUpload.Item>
            ))}
        </ChakraFileUpload.ItemGroup>
    );
};

function FileUploadTrigger() {
    return (
        <ChakraFileUpload.Root name="poster" accept="image/*" maxFiles={1}>
            <ChakraFileUpload.HiddenInput />
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
                <ChakraFileUpload.Trigger asChild>
                    <Button variant={OUTLINE} size={SMALL}>
                        <LuFileImage /> Event Poster
                    </Button>
                </ChakraFileUpload.Trigger>
                <FileUploadList />
            </div>
        </ChakraFileUpload.Root>
    );
};

export default function FileUpload() {
    return (
        <Button
            variant={SOLID}
            size={LARGE}
            fontWeight={BOLD}
            px={2}
            py={2}
            boxShadow={MEDIUM}
            borderRadius={XL}
            backgroundColor={ADMIN_PANEL_COLOR}
            _hover={{ transform: MINIMAL_TRANSFORM }}
            transition={MINIMAL_TRANSITION}
            as="label">
            <FileUploadTrigger />
        </Button>
    );
};

export { FileUploadList };
