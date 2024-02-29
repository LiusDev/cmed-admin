import React from "react"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import Editor from "ckeditor5-custom-build"
import { EditorConfig } from "@ckeditor/ckeditor5-core/src/editor/editorconfig"

const editorConfiguration: EditorConfig = {
    toolbar: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "|",
        "outdent",
        "indent",
        "|",
        "imageUpload",
        "blockQuote",
        "insertTable",
        "mediaEmbed",
        "undo",
        "redo",
    ],
    heading: {
        options: [
            {
                model: "heading1",
                view: {
                    name: "h1",
                    classes: "text-5xl",
                },
                title: "Heading 1",
                class: "text-5xl",
            },
            {
                model: "heading2",
                view: {
                    name: "h2",
                    classes: "text-4xl",
                },
                title: "Heading 2",
                class: "text-4xl",
            },
            {
                model: "heading3",
                view: {
                    name: "h3",
                    classes: "text-3xl",
                },
                title: "Heading 3",
                class: "text-3xl",
            },
            {
                model: "heading4",
                view: {
                    name: "h4",
                    classes: "text-2xl",
                },
                title: "Heading 4",
                class: "text-2xl",
            },
            {
                model: "heading5",
                view: {
                    name: "h5",
                    classes: "text-xl",
                },
                title: "Heading 5",
                class: "text-xl",
            },
            {
                model: "heading6",
                view: {
                    name: "h6",
                    classes: "text-lg",
                },
                title: "Heading 6",
                class: "text-lg",
            },
            {
                model: "paragraph",
                title: "Paragraph",
                class: "text-base",
            },
        ],
    },
}

function CustomEditor({ initialData, onEditorChange }: any) {
    return (
        <CKEditor
            editor={Editor as any}
            config={editorConfiguration}
            data={initialData}
            onChange={(event, editor: any) => {
                const data = editor.getData()
                onEditorChange(data)
            }}
        />
    )
}

export default CustomEditor
