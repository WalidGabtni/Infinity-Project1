import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import UserImage from 'components/UserImage';
import Navbar from 'scenes/navbar';
import NavigationBreadcrumbsMemberManagementPage from 'components/NavigationBreadcrumbsMemberManagementPage';
import ProjectProfileWidget from 'scenes/widgets/ProjectProfileWidget';

const MembersManagementPage = () => {
  const { projectId } = useParams(); // Get projectId from URL params
  const token = useSelector((state) => state.token);
  const [members, setMembers] = useState([]);
  const projects = useSelector((state) => state.projects);
  const project = projects.find((project) => project._id === projectId);
  const projectOwnerId = project?.userId; // Fetch project owner's ID
  const userId = useSelector((state) => state.user?._id);

  const [anchorEl, setAnchorEl] = useState(null); // For controlling menu anchor
  const [currentUserId, setCurrentUserId] = useState(''); // State to hold the current user's ID
  const [currentMemberRole, setCurrentMemberRole] = useState(''); // State to hold the current member's role

  // Fetch project members data
  const fetchMembers = async () => {
    try {
      console.log('Fetching project members...');
      const response = await fetch(`http://localhost:3001/projects/${projectId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project members');
      }

      const data = await response.json();
      console.log('Received API response:', data);

      // Set the members state with the array from the response
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching project members:', error);
      // Handle error state or display error message
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []); // Fetch members data on component mount

  // Define handleRemoveMember function
  const handleRemoveMember = async (userId) => {
    try {
      console.log(`Removing member with ID: ${userId}`);

      const deleteUrl = `http://localhost:3001/projects/${projectId}/members/${userId}`;
      const requestOptions = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log('Sending DELETE request to:', deleteUrl);
      const response = await fetch(deleteUrl, requestOptions);

      if (!response.ok) {
        const errorData = await response.json(); // Parse the response body as JSON
        const errorMessage = errorData.message || 'Member not found in the project.';
        throw new Error(`Failed to remove member: ${errorMessage}`);
      }

      // Update members list after removal
      setMembers((prevMembers) => prevMembers.filter((member) => member.userId !== userId));

      console.log(`Member with ID ${userId} successfully removed.`);
    } catch (error) {
      console.error('Error removing member:', error.message);
      // Display an error message to the user or handle the error appropriately
    }
  };

  // Handle click on Role button to open menu
  const handleRoleButtonClick = (userId, memberRole) => (event) => {
    setCurrentUserId(userId); // Set the current user's ID
    setCurrentMemberRole(memberRole); // Set the current member's role
    setAnchorEl(event.currentTarget); // Set anchor element for the menu
  };

  // Handle role menu item selection based on current member's role
  const handleRoleMenuItemClick = async (role) => {
    try {
      const updateRoleUrl = `http://localhost:3001/projects/${projectId}/members/${currentUserId}/updateRole`;
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newRole: role }), // Send the selected role in the request body
      };

      const response = await fetch(updateRoleUrl, requestOptions);

      if (!response.ok) {
        const errorData = await response.json(); // Parse the response body as JSON
        throw new Error(`Failed to update member role: ${errorData.message}`);
      }

      // Fetch updated members data after role update
      fetchMembers();

      // Close the menu
      setAnchorEl(null);

      console.log(`Member role updated successfully. Member ID: ${currentUserId}, New Role: ${role}`);
    } catch (error) {
      console.error('Error updating member role:', error.message);
      // Handle error state or display error message
    }
  };

  // Close the role menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Navbar />
      <Box m="2rem 0" />
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Box sx={{ width: '100%', minWidth: '500px', maxWidth: '1000px', marginBottom: '20px' }}>
          <ProjectProfileWidget project={project} userId={userId} />
        </Box>
      </Box>

      <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
        <TableContainer component={Paper}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
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
                    {member.userId !== projectOwnerId && ( // Display buttons if member is not the project owner
                      <>
                        <Button variant="contained" color="error" onClick={() => handleRemoveMember(member.userId)}>
                          Remove
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ marginLeft: '10px' }}
                          onClick={handleRoleButtonClick(member.userId, member.role)}
                        >
                          Role
                        </Button>
                        <Menu anchorEl={anchorEl} open={currentUserId === member.userId && Boolean(anchorEl)} onClose={handleCloseMenu}>
                          {member.role !== 'Admin' && (
                            <MenuItem onClick={() => handleRoleMenuItemClick('Admin')}>Admin</MenuItem>
                          )}
                          {member.role !== 'Moderator' && (
                            <MenuItem onClick={() => handleRoleMenuItemClick('Moderator')}>Moderator</MenuItem>
                          )}
                          {member.role !== 'Member' && (
                            <MenuItem onClick={() => handleRoleMenuItemClick('Member')}>Member</MenuItem>
                          )}
                        </Menu>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box m="2rem 0" />
        <NavigationBreadcrumbsMemberManagementPage projectId={projectId} projectName={project.name} />
      </Box>
    </Box>
  );
};

export default MembersManagementPage;
