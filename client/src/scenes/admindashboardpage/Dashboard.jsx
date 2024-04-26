import React from 'react';
import { Box } from '@mui/material';
import Navbar from 'scenes/navbar';

const Dashboard = () => {
  return (
    <Box>
      <Navbar />
      <Box m="2rem 0" />
      <header className="App-header">
        <iframe
          title="pfe"
          width="1500"
          height="700"
          src="https://app.powerbi.com/view?r=eyJrIjoiNGU2MzdhMWMtYTRkYS00NzdiLWIyYzctZDI0N2VkMWMzNDdlIiwidCI6IjJiMDg1MTdlLWM0MDYtNGM5MS05ODZkLWQ1MTNlM2Q0MWE2ZiJ9"
          frameBorder="0"
          allowFullScreen={true}
        ></iframe>
      </header>
    </Box>
  );
};

export default Dashboard;
