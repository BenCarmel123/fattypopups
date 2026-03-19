import { Button, Float, Image, useFileUploadContext, FileUpload as ChakraFileUpload } from "@chakra-ui/react";
import * as Config from "../config/index.jsx";

function ExistingImagePreview({ src }) {
    if (!src) return null;
    return (
        <Image
            src={src}
            alt="Current poster"
            boxSize="20"
            objectFit="cover"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
        />
    );
}

function FileUploadList({ existingImage })
{
    const fileUpload = useFileUploadContext();
    const files = fileUpload?.acceptedFiles || [];
    if (files.length === 0) return <ExistingImagePreview src={existingImage} />;
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

function FileUploadTrigger({ name, label, existingImage }) {
    return (
        <ChakraFileUpload.Root name={name} accept="image/*" maxFiles={1}>
            <ChakraFileUpload.HiddenInput />
            <div style={{ display: Config.FLEX, gap: '2rem', alignItems: Config.CENTER, justifyContent: Config.CENTER }}>
                <ChakraFileUpload.Trigger asChild>
                    <Button variant={Config.OUTLINE} size={Config.SMALL}>
                        <Config.LuFileImage /> {label}
                    </Button>
                </ChakraFileUpload.Trigger>
                <FileUploadList existingImage={existingImage} />
            </div>
        </ChakraFileUpload.Root>
    );
};

function FileUploadButton({ name, label, existingImage }) {
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
            <FileUploadTrigger name={name} label={label} existingImage={existingImage} />
        </Button>
    );
};

export default function FileUpload({ existingImage }) {
    return <FileUploadButton name="poster" label="Event Poster" existingImage={existingImage} />;
};

export function ContextFileUpload() {
    return <FileUploadButton name="context_image" label="Context Image" />;
};

export { FileUploadList };
