import { Button, Float, useFileUploadContext, FileUpload as ChakraFileUpload } from "@chakra-ui/react";
import * as Config from "../config/index.jsx";
import { LuFileImage, LuX } from "../config/index.jsx";

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
                            <LuX />
                        </ChakraFileUpload.ItemDeleteTrigger>
                    </Float>
                </ChakraFileUpload.Item>
            ))}
        </ChakraFileUpload.ItemGroup>
    );
};

// renamed to avoid shadowing the imported `FileUpload`
export default function FileUpload() {
    return (
        <ChakraFileUpload.Root name="poster" accept="image/*" maxFiles={1}>
            <ChakraFileUpload.HiddenInput />
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
                <ChakraFileUpload.Trigger asChild>
                    <Button variant={Config.OUTLINE} size={Config.SMALL}>
                        <LuFileImage /> Event Poster
                    </Button>
                </ChakraFileUpload.Trigger>
                <FileUploadList />
            </div>
        </ChakraFileUpload.Root>
    );
};

export { FileUploadList };
