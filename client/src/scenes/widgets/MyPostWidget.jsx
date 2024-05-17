import React, { useState } from "react";
import {
  Divider,
  InputBase,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import PostForm from "components/PostForm";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const handlePost = async (formData) => {
    try {
      const form = new FormData();
      form.append("userId", _id);
      form.append("title", formData.title);
      form.append("description", formData.description);
      if (image) {
        form.append("picture", image);
        form.append("picturePath", image.name);
      }

      console.log("Form Data:", Object.fromEntries(form));

      const response = await fetch(`http://localhost:3001/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!response.ok) {
        console.error(`Failed to create post. Server returned ${response.status}: ${response.statusText}`);
        const errorResponse = await response.json();
        console.error("Error details:", errorResponse);
        return;
      }

      const posts = await response.json();
      dispatch(setPosts({ posts }));
      setImage(null);

    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem" onClick={openForm}>
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind?"
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>

      {isFormOpen && (
        <PostForm
          onClose={closeForm}
          onPost={handlePost}
          onImageChange={setImage}
          currentImage={image}
        />
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />
    </WidgetWrapper>
  );
};

export default MyPostWidget;
