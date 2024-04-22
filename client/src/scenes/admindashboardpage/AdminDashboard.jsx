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
  TextField,
  Pagination,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from 'scenes/navbar';
import UserImage from 'components/UserImage';
import RoleMenu from 'components/RoleMenu';

const AdminDashboard = () => {
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.userId);
  const [users, setUsers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const usersPerPage = 30;

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
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleRemoveUser = async (userId) => {
    try {
      const userToRemove = users.find(user => user._id === userId);
      if (!userToRemove || userToRemove._id === loggedInUserId || userToRemove.role === 'admin') {
        return;
      }

      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove user');
      }

      setUsers(users.filter(user => user._id !== userId));
      console.log(`User with ID ${userId} removed successfully`);
    } catch (error) {
      console.error('Error removing user:', error.message);
    }
  };

  const updateRole = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      const updatedUserIndex = users.findIndex(user => user._id === userId);
      if (updatedUserIndex !== -1) {
        const updatedUser = { ...users[updatedUserIndex], role: newRole };
        const updatedUsers = [...users];
        updatedUsers[updatedUserIndex] = updatedUser;
        setUsers(updatedUsers);
      }
      console.log(`User with ID ${userId} role updated successfully`);
    } catch (error) {
      console.error('Error updating user role:', error.message);
    }
  };

  const handleRoleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRoleMenuItemClick = (role) => {
    setFilterRole(role);
    setAnchorEl(null);
  };

  const filteredUsers = users.filter((user) => {
    const roleMatch = filterRole ? user.role === filterRole : true;
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const nameMatch = fullName.includes(query);

    return roleMatch && nameMatch;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  return (
    <Box>
      <Navbar />
      <Box m="2rem 0" />

      <Box sx={{ maxWidth: '1500px', margin: '0 auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '20px' }}>
          <TextField
            label="Search..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: '300px' }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRoleButtonClick}
            >
              Filter By Role
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => handleRoleMenuItemClick('')}>All</MenuItem>
              <MenuItem onClick={() => handleRoleMenuItemClick('admin')}>Admins</MenuItem>
              <MenuItem onClick={() => handleRoleMenuItemClick('moderator')}>Moderators</MenuItem>
              <MenuItem onClick={() => handleRoleMenuItemClick('user')}>Users</MenuItem>
            </Menu>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/dashboard')}
              sx={{ marginLeft: '10px' }}
            >
              Go to Dashboard
            </Button>
          </Box>
        </Box>
        <Box sx={{ marginBottom: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Total: {filteredUsers.length}
          </Typography>
        </Box>
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
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
              {paginatedUsers.map((user) => (
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
                    {user._id !== loggedInUserId && user.role !== 'admin' && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleRemoveUser(user._id)}
                          sx={{ marginRight: '15px' }}
                        >
                          Remove
                        </Button>
                        {user._id !== loggedInUserId && (
                          <RoleMenu onSelectRole={(role) => updateRole(user._id, role)} />
                        )}
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt="20px" sx={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
          <Box m="2rem 0" />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
