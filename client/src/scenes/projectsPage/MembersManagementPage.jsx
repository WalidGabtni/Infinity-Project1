import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableContainer, TableHead, TableBody, TableCell, TableRow, Paper, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import UserImage from 'components/UserImage';
import Navbar from "scenes/navbar";

const MembersManagementPage = () => {
  const { projectId } = useParams(); // Get projectId from URL params
  const token = useSelector((state) => state.token);
  const [members, setMembers] = useState([]);
  const projects = useSelector((state) => state.projects);
  const project = projects.find((project) => project._id === projectId);
  const projectOwnerId = project?.userId; // Fetch project owner's ID

  // Fetch project members data
  const fetchMembers = async () => {
    try {
      console.log('Fetching project members...');
      const response = await fetch(`http://localhost:3001/projects/${projectId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project members');
      }

      const data = await response.json();
      console.log('Received API response:', data);

      // Check if 'members' array exists in the response
      if (Array.isArray(data)) {
        console.log('Received members:', data);
        setMembers(data); // Set the members state with the array from the response
      } else {
        console.log('No members array found in response.');
        setMembers([]); // Set an empty array if 'members' is not present
      }
    } catch (error) {
      console.error('Error fetching project members:', error);
      // Handle error state or display error message
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []); // Fetch members data on component mount

  // Define handleRemoveMember function
  const handleRemoveMember = async (memberId) => {
    try {
      console.log(`Removing member with ID: ${memberId}`);
  
      const deleteUrl = `http://localhost:3001/projects/${projectId}/members/${memberId}`;
      const requestOptions = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
  
      console.log('Sending DELETE request to:', deleteUrl);
      const response = await fetch(deleteUrl, requestOptions);
  
      if (!response.ok) {
        const errorData = await response.json(); // Parse the response body as JSON
        const errorMessage = errorData.message || 'Member not found in the project.';
        throw new Error(`Failed to remove member: ${errorMessage}`);
      }
  
      // Update members list after removal
      setMembers((prevMembers) => prevMembers.filter((member) => member.userId !== memberId));
  
      console.log(`Member with ID ${memberId} successfully removed.`);
    } catch (error) {
      console.error('Error removing member:', error.message);
      // Display an error message to the user or handle the error appropriately
    }
  };

  return (
    <Box>
      <Navbar />
      <Typography variant="h4" gutterBottom>
        Members Management
      </Typography>

      <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
        <TableContainer component={Paper}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.userId}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <UserImage image={member.picturePath} size="40px" userId={member.userId} />
                      <Typography sx={{ marginLeft: '8px' }}>{`${member.firstName} ${member.lastName}`}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    {member.userId !== projectOwnerId && ( // Display button if member is not the project owner
                      <Button variant="contained" color="error" onClick={() => handleRemoveMember(member.userId)}>
                        Remove
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default MembersManagementPage;
