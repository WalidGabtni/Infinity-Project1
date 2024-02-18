import { useState } from "react";
import React from 'react';
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
    Search,
    Message,
    DarkMode,
    LightMode,
    Notifications,
    Help,
    Menu,
    Close
} from "@mui/icons-material"

import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout} from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween"
import { Link } from "react-router-dom";
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';



const Navbar = () => {
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
    
    const [popoverAnchor, setPopoverAnchor] = React.useState(null);

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

    const handleLogout = () => {
        dispatch(setLogout());
        navigate('/');
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
                <FlexBetween backgroundColor={neutralLight} borderRadius="9px" gap="3rem" padding="0.1rem 1.5rem">
                    <InputBase placeholder= "Search..." />
                    <IconButton>
                        <Search />
                    </IconButton>
                </FlexBetween>
            )}

        </FlexBetween>

        { /*DESKTOP NAV */}
        {isNonMobileScreens ? (
        
        <FlexBetween gap="2rem">
                            <Link to="/about-us" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography sx={{ fontSize: '18px' }}>About Us</Typography>
                </Link>
                <Link to="/support" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography sx={{ fontSize: '18px' }}>Support</Typography>
                </Link>
                <Link to="/events" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography sx={{ fontSize: '18px' }}>Events</Typography>
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
        Browse
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
                onClick={popupState.close}
                sx={{
                fontSize: '16px', // Font size
                padding: '10px 50px', // Padding
                '&:hover': {
                    backgroundColor: primaryLight,
                },
                }}
            >
                Projects
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
                News & Announcements
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
                Web Stats
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