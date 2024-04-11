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
  const { projectId } = useParams();
  const token = useSelector((state) => state.token);
  const [members, setMembers] = useState([]);
  const projects = useSelector((state) => state.projects);
  const project = projects.find((project) => project._id === projectId);
  const projectOwnerId = project?.userId;
  const loggedInUserId = useSelector((state) => state.user?._id);
  const userRole = useSelector((state) => state.user?.role);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentMemberRole, setCurrentMemberRole] = useState('');

  const fetchMembers = async () => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project members');
      }

      const data = await response.json();
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching project members:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [projectId, token]);

  const isAdmin = members.find((member) => member.userId === loggedInUserId && member.role === 'Admin');
  const isOwner = loggedInUserId === projectOwnerId;

  const handleRemoveMember = async (userId) => {
    try {
      const memberToRemove = members.find((member) => member.userId === userId);
  
      if (!memberToRemove) {
        throw new Error('Member not found in the project.');
      }
  
      // Check if current user is removing another member (not themselves)
      const canRemoveMember = userId !== loggedInUserId;
  
      if (canRemoveMember) {
        const deleteUrl = `http://localhost:3001/projects/${projectId}/members/${userId}`;
        const requestOptions = {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        const response = await fetch(deleteUrl, requestOptions);
  
        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.message || 'Failed to remove member.';
          throw new Error(`Failed to remove member: ${errorMessage}`);
        }
  
        // Update frontend state after successful removal
        setMembers((prevMembers) => prevMembers.filter((member) => member.userId !== userId));
        console.log(`Member with ID ${userId} successfully removed.`);
      } else {
        console.log('Unauthorized to remove this member.');
      }
    } catch (error) {
      console.error('Error removing member:', error.message);
    }
  };
  
  

  const handleRoleButtonClick = (userId, memberRole) => (event) => {
    setCurrentUserId(userId);
    setCurrentMemberRole(memberRole);
    setAnchorEl(event.currentTarget);
  };

  const handleRoleMenuItemClick = async (role) => {
    try {
      // Check if the logged-in user is an admin or project owner
      if (isAdmin || isOwner) {
        const memberToUpdate = members.find((member) => member.userId === currentUserId);
  
        // Ensure the member to update exists and is not the project owner
        if (memberToUpdate && memberToUpdate.userId !== projectOwnerId) {
          const updateRoleUrl = `http://localhost:3001/projects/${projectId}/members/${currentUserId}/updateRole`;
          const requestOptions = {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ newRole: role }),
          };
  
          const response = await fetch(updateRoleUrl, requestOptions);
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to update member role: ${errorData.message}`);
          }
  
          // Refresh the member list after successful role update
          fetchMembers();
          setAnchorEl(null);
  
          console.log(`Member role updated successfully. Member ID: ${currentUserId}, New Role: ${role}`);
        } else {
          console.log('Cannot update role for project owner.');
        }
      } else {
        console.log('Unauthorized to change role.');
      }
    } catch (error) {
      console.error('Error updating member role:', error.message);
    }
  };
  

  return (
    <Box>
      <Navbar />
      <Box m="2rem 0" />
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Box sx={{ width: '100%', minWidth: '500px', maxWidth: '1000px', marginBottom: '20px' }}>
          <ProjectProfileWidget project={project} userId={loggedInUserId} />
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
                  {((isOwner && member.userId !== projectOwnerId) || (isAdmin && member.userId !== projectOwnerId && member.role !== 'Admin')) && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleRemoveMember(member.userId)}
                      >
                        Remove
                      </Button>
                    )}
                    {((isOwner && member.userId !== projectOwnerId) || (isAdmin && member.userId !== projectOwnerId && member.role !== 'Admin')) && (
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: '10px' }}
                        onClick={handleRoleButtonClick(member.userId, member.role)}
                      >
                        Role
                      </Button>
                    )}
                    <Menu
                      anchorEl={anchorEl}
                      open={currentUserId === member.userId && Boolean(anchorEl)}
                      onClose={() => setAnchorEl(null)}
                    >
                      {/* Display role change options based on user permissions */}
                      {((isAdmin || isOwner) && member.userId !== loggedInUserId && member.userId !== projectOwnerId) && (
                        <div>
                          {/* Display "Admin" option if user is admin or project owner and member is not already an admin */}
                          {(isAdmin || isOwner) && member.role !== 'Admin' && (
                            <MenuItem onClick={() => handleRoleMenuItemClick('Admin')}>Admin</MenuItem>
                          )}

                          {/* Display "Moderator" option if user is admin or project owner and member is not already a moderator */}
                          {(isAdmin || isOwner) && member.role !== 'Moderator' && (
                            <MenuItem onClick={() => handleRoleMenuItemClick('Moderator')}>Moderator</MenuItem>
                          )}

                          {/* Display "Member" option if user is admin or project owner and member is not already a member */}
                          {(isAdmin || isOwner) && member.role !== 'Member' && (
                            <MenuItem onClick={() => handleRoleMenuItemClick('Member')}>Member</MenuItem>
                          )}
                        </div>
                      )}

                      
                    </Menu>

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