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

function CustomEditor({ initialData, onEditorChange }: any) {
    return (
        <CKEditor
            editor={Editor as any}
            data={initialData}
            onChange={(event, editor: any) => {
                const data = editor.getData()
                onEditorChange(data)
            }}
        />
    )
}

export default CustomEditor
