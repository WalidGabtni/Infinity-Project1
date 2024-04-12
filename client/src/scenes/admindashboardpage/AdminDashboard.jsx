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
import Navbar from 'scenes/navbar';
import UserImage from 'components/UserImage';

const AdminDashboard = () => {
  const token = useSelector((state) => state.token);
  const [users, setUsers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const usersPerPage = 30; // Number of users per page

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
      console.log(`Removing user with ID ${userId}`);
    } catch (error) {
      console.error('Error removing user:', error.message);
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
    const query = searchQuery.toLowerCase().trim(); // Trim and convert search query to lowercase
  
    // Check if either first name or last name matches the search query
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
        {/* Container for search bar and filter button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '20px' }}>
          {/* Search bar on the top right */}
          <TextField
            label="Search..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: '300px' }}
          />
          <Box mt="20px" sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ mr: '180px' }}> {/* Adjust the left margin */}
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
        </Box>
          {/* Filter button on the top left */}
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
            <MenuItem onClick={() => handleRoleMenuItemClick('user')}>Users</MenuItem>
          </Menu>
        </Box>
        

        {/* User table */}
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
                      onClick={() => setCurrentUserId(user._id)}
                    >
                      Role
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination controls */}
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
