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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");


  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("title", title);
      formData.append("description", description);
      if (image) {
        formData.append("picture", image);
        formData.append("picturePath", image.name);
      }
  
      // Log form data to the console for verification
      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
  
      const response = await fetch(`http://localhost:3001/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
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
      setDescription("");
      setTitle("");
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
            placeholder="Qu'est-ce qui préoccupe votre esprit..."
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
