import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: 'center' }}>
            <Typography variant="h6" component="div" sx={{ p: 2 }}>
              <Link to={"/"} style={{ textDecoration: 'none', color: 'white' }}>Home</Link>
            </Typography>
            <Typography variant="h6" component="div" sx={{ p: 2 }} >
              <Link to={"/petitions"} style={{ textDecoration: 'none', color: 'white' }}>Petitions</Link>
            </Typography>
            <Button component={Link} to="/login" sx={{ ml: 'auto' }} color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }

export default Header;