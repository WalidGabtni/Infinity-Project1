import { useState, useEffect } from "react";
import React, { useRef } from 'react';
import {
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery,
} from "@mui/material"
import {
    Message,
    DarkMode,
    LightMode,
    Notifications,
    Help,
    Menu,
    Close
} from "@mui/icons-material"

import SearchIcon from "@mui/icons-material/Search";
import NotificationMenu from 'components/NotificationMenu';
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout} from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween"
import { Link } from "react-router-dom";
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';



const Navbar = ({ updateSearchResults }) => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;
    const [allPosts, setAllPosts] = useState([]);
    const token = useSelector((state) => state.token);
    
    const [popoverAnchor, setPopoverAnchor] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const notificationButtonRef = useRef(null);
    const [rejectedNotificationId, setRejectedNotificationId] = useState(null);

    const userRole = useSelector((state) => state.role);

    /*SEARCH*/
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const handleMenuClose = () => {
        setPopoverAnchor(null);
      };
    const handlePopoverOpen = (event) => {
        setPopoverAnchor(event.currentTarget);
      };
      
      const handlePopoverClose = () => {
        setPopoverAnchor(null);
      };
      
      const openPopover = Boolean(popoverAnchor);

    const fullName = user ? `${user.firstName} ${user.lastName}` : '';
    const handleNotification = async () => {
        try {
          const response = await fetch(`http://localhost:3001/notifications/${user._id}/notifications`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (response.ok) {
            const result = await response.json();
            setNotifications(result);
          } else {
            console.error(
              'Failed to fetch notifications:',
              response.status,
              response.statusText
            );
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      const handleAccept = async (notificationId, projectId) => {
        try {
            // Check if the notification recipient ID matches the logged-in user ID
            if (notifications.some(notification => notification._id === notificationId && notification.recipient === user._id)) {
                const response = await fetch(`http://localhost:3001/notifications/${notificationId}/accept`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ projectId }), // Assuming projectId needs to be sent in the body
                });
    
                if (response.ok) {
                    // Handle success response
                } else {
                    console.error('Failed to accept notification request:', response.status, response.statusText);
                }
            } else {
                console.error('User does not have permission to accept this notification.');
            }
        } catch (error) {
            console.error('Failed to accept notification request:', error);
        }
    };

    const handleRefuse = async (notificationId, projectId) => {
      try {
        const response = await fetch(`http://localhost:3001/notifications/${notificationId}/refuse`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
    
        if (response.ok) {
          // Handle success response
          // For example, you can remove the notification from the UI
          setNotifications(prevNotifications => prevNotifications.filter(notification => notification._id !== notificationId));
          
          // Show snackbar for rejected notification
          setRejectedNotificationId(notificationId);
        } else {
          console.error('Failed to refuse notification request:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Failed to refuse notification request:', error);
      }
    };
    


      const handleNotificationClick = async () => {
        // Call handleNotification to fetch notifications
        await handleNotification();
      
        // Get the DOM element of the notification button using the ref
        const buttonEl = notificationButtonRef.current;
      
        // Check if the button element exists before updating the anchorEl state
        if (buttonEl) {
          // Set the anchor element for the popover to the notification button element
          setAnchorEl(buttonEl);
      
          // Open the popover
          setIsPopoverOpen(true);
        }
      };


    const handleClose = () => {
      setAnchorEl(null);
      setIsPopoverOpen(false); // Set 'isPopoverOpen' to false when the popover is closed
  };

    const handleLogout = () => {
        dispatch(setLogout());
        navigate('/');
    };

    useEffect(() => {
        const fetchAllPosts = async () => {
          try {
            const response = await fetch('http://localhost:3001/posts', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
    
            if (response.ok) {
              const result = await response.json();
              setAllPosts(result);
            } else {
              console.error('Failed to fetch all posts:', response.status, response.statusText);
            }
          } catch (error) {
            console.error('Error fetching all posts:', error);
          }
        };
    
        fetchAllPosts();
      }, [token]);

    const handleSearch = () => {
        console.log("Searching with term:", searchTerm);
        const results = allPosts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()));
        setSearchResults(results);
        updateSearchResults(results);
      };
    
      const handleKeyPress = (event) => {
        if (event.key === "Enter") {
          handleSearch();
        }
      };

    return <FlexBetween padding="1rem 6%" backgroundColor={alt}>
        <FlexBetween gap="1.75rem">
            <Typography
            fontWeight ="bold"
            fontSize = "clamp(1rem, 2rem, 2.25rem)"
            color="primary"
            onClick={()=> navigate("/home")}
            sx={{
                "&:hover": {
                    color: primaryLight,
                    cursor: "pointer",
                },
            }}
            >
                Infinity
            </Typography>
            {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <IconButton onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          </FlexBetween>
        )}

        </FlexBetween>

        { /*DESKTOP NAV */}
        {isNonMobileScreens ? (
        
        <FlexBetween gap="2rem">
                            <Link to="/about-us" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography sx={{ fontSize: '18px' }}>À propos de nous</Typography>
                </Link>
                <Link to="/support" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography sx={{ fontSize: '18px' }}>Support</Typography>
                </Link>
                <Link to="/events" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography sx={{ fontSize: '18px' }}>Événements</Typography>
                </Link>

        { /* BROWSE MENU */} 

        <PopupState variant="popover" popupId="browse-popover">
  {(popupState) => (
    <div>
      <Typography
        sx={{
          fontSize: '18px',
          cursor: 'pointer',
        }}
        {...bindTrigger(popupState)}
      >
        Parcourir
      </Typography>
        <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
            }}
            transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
            }}
            PaperProps={{
            sx: {
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                borderRadius: '0px', // No border radius
                width: '50%', // Full width
                marginTop: '25px',
            },
            }}
        >
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'column', // Vertical arrangement
            }}
            >
            <MenuItem
                onClick={()=> navigate("/projects")}
                sx={{
                fontSize: '16px', // Font size
                padding: '10px 50px', // Padding
                '&:hover': {
                    backgroundColor: primaryLight,
                },
                }}
            >
                Projets
            </MenuItem>
            <MenuItem
                onClick={popupState.close}
                sx={{
                fontSize: '16px',
                padding: '10px 50px',
                '&:hover': {
                    backgroundColor: primaryLight,
                },
                }}
            >
                Nouvelles et Annonces
            </MenuItem>
            <MenuItem
                onClick={popupState.close}
                sx={{
                fontSize: '16px',
                padding: '10px 50px',
                '&:hover': {
                    backgroundColor: primaryLight,
                },
                }}
            >
                Statistiques Web
            </MenuItem>
            </Box>
        </Popover>
    </div>
  )}
</PopupState>



            <IconButton onClick={()=> dispatch(setMode())}>
               {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
               ):(
                <LightMode sx={{ Color: dark, fontSize: "25px" }} />
               )} 
            </IconButton>
            <Message sx={{ fontSize: "25px" }} />
            {/* Notification icon */}
            <IconButton
              ref={notificationButtonRef} // Assign the ref to the IconButton
              onClick={handleNotificationClick}
            >
              <Notifications sx={{ fontSize: '25px' }} />
            </IconButton>
            <Popover
              open={isPopoverOpen}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
               vertical: 'top',
                horizontal: 'right',
              }}
              >
              <NotificationMenu
                notifications={notifications}
                setNotifications={setNotifications}
                handleAccept={handleAccept}
                handleRefuse={handleRefuse} // Add handleRefuse prop
                loggedInUserId={user._id}
              />
            </Popover>
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
                <Select
                    value={fullName}
                    sx={{
                        backgroundColor: neutralLight,
                        width: "150px",
                        borderRadius: "0.25rem",
                        p: "0.25 rem 1rem",
                        "& .MuiSvgIcon-root": {
                            pr: "0.25rem",
                            width: "3rem"
                        },
                        "& .MuiSelect-select:focus":{
                            backgroundColor: neutralLight
                        }
                    }}
                    input={<InputBase />}
                >    

                <MenuItem value ={fullName}>
                    <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem>
                    {userRole === 'admin' && (
                      <Typography onClick={() => navigate("/admindashboard")}>
                        Admin Dashboard
                      </Typography>
                    )}
                  </MenuItem>
                <MenuItem>
                    <Typography onClick={()=> navigate("/bookmarks")}>Bookmarks</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                </Select>
            </FormControl>
        </FlexBetween>
        ) : (
        <IconButton
        onClick={()=> setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
            <Menu />
        </IconButton>
        )}

        { /* MOBILE NAV */}

        {!isMobileMenuToggled && isMobileMenuToggled && (
            <Box
                position="fixed"
                right="0"
                bottom="0"
                height="100%"
                zIndex="10"
                maxWidth="500px"
                minWidth="300px"
                backgroundColor={background}
            >
            { /* CLOSE ICON */ }
             <Box display="flex" justifyContent="flex-end" p="1rem">
                <IconButton
                    onClick={()=> setIsMobileMenuToggled(!isMobileMenuToggled)}
                >
                    <Close />

                </IconButton>
             </Box>
            { /* MENU ITEMS */ }
            <FlexBetween display="flex" flexDirection="column" justifyContent="center" alightItems="center" gap="3rem">
            <IconButton onClick={()=> dispatch(setMode())}>
               {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
               ):(
                <LightMode sx={{ Color: dark, fontSize: "25px" }} />
               )} 
            </IconButton>
            <Message sx={{ fontSize: "25px" }} />
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
                <Select
                    value={fullName}
                    sx={{
                        backgroundColor: neutralLight,
                        width: "150px",
                        borderRadius: "0.25rem",
                        p: "0.25 rem 1rem",
                        "& .MuiSvgIcon-root": {
                            pr: "0.25rem",
                            width: "3rem"
                        },
                        "& .MuiSelect-select:focus":{
                            backgroundColor: neutralLight
                        }
                    }}
                    input={<InputBase />}
                >    

                <MenuItem value ={fullName}>
                    <Typography>{fullName}</Typography>
                </MenuItem>
                
                <MenuItem onClick= {()=> dispatch(setLogout())}>Log Out</MenuItem>
                </Select>
            </FormControl>
        </FlexBetween>
            
            </Box>
        )}

            
    </FlexBetween>;
};

export default Navbar;