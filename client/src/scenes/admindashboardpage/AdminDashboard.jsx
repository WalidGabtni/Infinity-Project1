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
import Navbar from 'scenes/navbar';
import UserImage from 'components/UserImage';

const AdminDashboard = () => {
  const token = useSelector((state) => state.token);
  const [users, setUsers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users/getallusers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data); // Update the local state with fetched users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers(); // Trigger the fetchUsers function when the component mounts or token changes
  }, [token]);

  const handleRemoveUser = async (userId) => {
    try {
      // Implement logic to remove the user with the specified userId
      console.log(`Removing user with ID ${userId}`);
    } catch (error) {
      console.error('Error removing user:', error.message);
    }
  };

  const handleRoleButtonClick = (userId) => (event) => {
    setCurrentUserId(userId);
    setAnchorEl(event.currentTarget);
  };

  const handleRoleMenuItemClick = async (role) => {
    try {
      // Implement logic to update the role of the user with the specified userId
      console.log(`Updating role for user with ID ${currentUserId} to ${role}`);
    } catch (error) {
      console.error('Error updating user role:', error.message);
    }
  };

  return (
    <Box>
      <Navbar />
      <Box m="2rem 0" />
      <Box sx={{ maxWidth: '1500px', margin: '0 auto' }}>
        <TableContainer component={Paper}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Occupation</TableCell>
                <TableCell>Viewed Profile</TableCell>
                <TableCell>Impressions</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <UserImage image={user.picturePath} size="40px" userId={user.userId} />
                      <Typography sx={{ marginLeft: '8px' }}>{`${user.firstName} `}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.location}</TableCell>
                  <TableCell>{user.occupation}</TableCell>
                  <TableCell>{user.viewedProfile}</TableCell>
                  <TableCell>{user.impressions}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleRemoveUser(user._id)}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginLeft: '10px' }}
                      onClick={handleRoleButtonClick(user._id)}
                    >
                      Role
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && currentUserId === user._id}
                      onClose={() => setAnchorEl(null)}
                    >
                      <MenuItem onClick={() => handleRoleMenuItemClick('admin')}>Admin</MenuItem>
                      <MenuItem onClick={() => handleRoleMenuItemClick('user')}>User</MenuItem>
                    </Menu>
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

export default AdminDashboard;
