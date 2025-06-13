import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Box } from "@chakra-ui/react";
import './style.css'

const RichTextEditor = ({ editorHtml, setEditorHtml, height = "350px" }: any) => {
  return (
    <Box>
      <ReactQuill
        theme="snow"
        value={editorHtml}
        onChange={setEditorHtml}
        modules={modules}
        formats={formats}
        style={{ height: height, overflowY :'auto'}}
      />
    </Box>
  );
};

const modules = {
  syntax: false, // Disable the default syntax module
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "blockquote",
  "code-block",
  "align",
  "link",
  "image",
];

export default RichTextEditor;
