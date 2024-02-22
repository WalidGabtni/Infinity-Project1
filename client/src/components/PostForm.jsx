import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  useTheme,
  Input,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import Overlay from "./Overlay";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const PostForm = ({ onClose, onPost, onImageChange }) => {
  const { palette } = useTheme();
  const [isOverlayOpen, setIsOverlayOpen] = useState(true);
  const [formData, setFormData] = useState({ title: "", description: "" });

  const closeOverlay = () => {
    setIsOverlayOpen(false);
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handlePostClick = () => {
    onPost(formData);
    closeOverlay();
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
    "image",
    "align",
    "color",
    "background",
  ];

  return (
    <>
      {isOverlayOpen && (
        <Overlay>
          <Box
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            p="2rem"
            backgroundColor={palette.background.paper}
            borderRadius="10px"
            boxShadow="0px 0px 20px rgba(0, 0, 0, 0.7)"
            zIndex="999"
            width="1500px"
            maxWidth="1500px"
            height="70vh"
            style={{
              transform: "translate(-50%, -50%)",
              msTransform: "translate(-50%, -50%)",
            }}
            id="postForm"
          >
            <Typography variant="h6">New Post</Typography>

            {/* Title input field */}
            <Input
              placeholder="Title"
              onChange={(e) => handleInputChange("title", e.target.value)}
              value={formData.title}
              variant="outlined"
              fullWidth
              sx={{
                marginTop: "2rem",
                fontSize: "1.5rem",
                borderRadius: "8px",
              }}
            />

            {/* Rich Text Editor */}
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
              modules={modules}
              formats={formats}
              style={{ height: "400px", marginTop: "1rem" }}
            />

            {/* Post button */}
            <Button
              onClick={handlePostClick}
              sx={{
                marginTop: "1rem",
                color: palette.background.alt,
                backgroundColor: palette.primary.main,
                borderRadius: "3rem",
                position: "absolute",
                bottom: "1rem",
                right: "2rem",
              }}
            >
              POST
            </Button>

            {/* Close button */}
            <IconButton
              onClick={closeOverlay}
              sx={{
                position: "absolute",
                top: "0.5rem",
                right: "1rem",
              }}
            >
              <CloseOutlined />
            </IconButton>
          </Box>
        </Overlay>
      )}
    </>
  );
};

export default PostForm;
