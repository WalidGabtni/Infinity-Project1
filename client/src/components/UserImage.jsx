import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      {image ? (
        <img
          style={{ objectFit: "cover", borderRadius: "50%" }}
          width={size}
          height={size}
          alt="user"
          src={`http://localhost:3001/assets/${image}`}
        />
      ) : (
        // Render a placeholder or a default image when 'image' is undefined or null
        <div style={{ width: size, height: size, backgroundColor: "#ccc", borderRadius: "50%" }}></div>
      )}
    </Box>
  );
};

export default UserImage;
