import { Editor } from "react-draft-wysiwyg";

export default function EditorComponent(props: { editorState?: any; handleEditorChange?: any }) {
    return (
        <Editor
            toolbar={{
                inline: {
                    inDropdown: true,
                },
                list: {
                    inDropdown: true,
                },
                textAlign: {
                    inDropdown: true,
                },
                link: {
                    inDropdown: true,
                },
                history: {
                    inDropdown: true,
                },
            }}
            wrapperStyle={{
                border: "1px solid #eee",
                height: "500px",
                margin: "20px 0",
            }}
            editorState={props.editorState}
            onEditorStateChange={props.handleEditorChange}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
        />
    );
}
