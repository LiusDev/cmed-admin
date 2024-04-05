import React from "react"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import { EditorConfig } from "@ckeditor/ckeditor5-core/src/editor/editorconfig"
import Editor from "ckeditor5-custom-build/build/ckeditor"

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
}

type Props = {
    value?: string
    onChange: (value?: string) => void
}

function CustomEditor({ value: data, onChange }: Props) {
    return (
        <CKEditor
            editor={Editor as any}
            data={data}
            onChange={(event, editor: any) => {
                const data = editor.getData()
                onChange(data)
            }}
        />
    )
}

export default CustomEditor
