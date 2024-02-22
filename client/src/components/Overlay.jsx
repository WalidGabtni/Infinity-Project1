import React from "react";
import { Box } from "@mui/material";

const Overlay = ({ children }) => {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      backgroundColor="rgba(0, 0, 0, 0.7)"
      zIndex="998"
    >
      {children}
    </Box>
  );
};

export default Overlay;
