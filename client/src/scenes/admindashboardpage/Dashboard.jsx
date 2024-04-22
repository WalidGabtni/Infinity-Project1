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
          src="https://app.powerbi.com/reportEmbed?reportId=58cc7e78-bf44-458c-bd11-3e99e1d6253e&autoAuth=true&ctid=d247c568-e781-4cd0-a593-1d0d689bc8ac"
          frameBorder="0"
          allowFullScreen={true}
        ></iframe>
      </header>
    </Box>
  );
};

export default Dashboard;
