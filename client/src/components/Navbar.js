import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box } from '@material-ui/core';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Online Auction
        </Typography>
        <Box mx={1}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
        </Box>
        <Box mx={1}>
          <Button color="inherit" component={Link} to="/auctions">
            Auctions
          </Button>
        </Box>
        {auth.isAuthenticated ? (
          <>
            {auth.user.role === 'admin' && (
              <Box mx={1}>
                <Button color="inherit" component={Link} to="/admin">
                  Admin
                </Button>
              </Box>
            )}
            {auth.user.role === 'seller' && (
              <Box mx={1}>
                <Button color="inherit" component={Link} to="/seller">
                  Seller
                </Button>
              </Box>
            )}
            {auth.user.role === 'buyer' && (
              <Box mx={1}>
                <Button color="inherit" component={Link} to="/buyer">
                  Buyer
                </Button>
              </Box>
            )}
            <Box mx={1}>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box mx={1}>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            </Box>
            <Box mx={1}>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;