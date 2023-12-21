import "froala-editor/js/plugins.pkgd.min.js";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_editor.pkgd.min.css";
import { instance } from "@/utils";

// config for froala editor
export const config = {
    pluginsEnabled: [
        "fontSize",
        "image",
        "imageManager",
        "table",
        "align",
        "colors",
        "emoticons",
        "paragraphFormat",
        "paragraphStyle",
        "quote",
        "url",
    ],
    toolbarButtons: [
        "fontSize",
        "colors",
        "bold",
        "italic",
        "underline",
        "strikeThrough",
        "|",

        "textColor",
        "backgroundColor",
        "|",

        "alignLeft",
        "alignCenter",
        "alignRight",
        "|",

        "insertImage",
        "insertTable",
        "horizon",

        "|",
        "insertHR",
        "insertFile",
        "fileM",
    ],
    fontSize: [
        "8",
        "10",
        "12",
        "14",
        "18",
        "24",
        "30",
        "36",
        "48",
        "60",
        "72",
        "96",
    ],

    fontSizeDefaultSelection: "12",

    imageEditButtons: [
        "imageReplace",
        "imageAlign",
        "imageRemove",
        "|",
        "imageLink",
        "linkOpen",
        "linkEdit",
        "linkRemove",
        "-",
        "imageDisplay",
        "imageStyle",
        "imageAlt",
        "imageSize",
    ],

    imageUpload: true,
    imageInsertButtons: ["imageBack", "|", "imageUpload", "imageByURL"],
    imageUploadMethod: "POST",
    // Validation
    imageAllowedTypes: ["jpeg", "jpg", "png"],
    // Set max image size to 10MB.
    imageMaxSize: 1024 * 1024 * 10,
};

const MyFroalaEditor = ({
    model,
    setModel,
}: {
    model?: string;
    setModel: (model: string) => void;
}) => {
    return (
        <FroalaEditor config={config} model={model} onModelChange={setModel} />
    );
};

export default MyFroalaEditor;
