import { Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import React from 'react';

/**
 * backup:
 * <Button >
              <Link to="/entry" >Data Entry</Link>
            </Button>
            <Button >
              <Link to="/categoryCreator" >Category Creator</Link>
            </Button>
            <Button >
              <Link to="/category" >Category Designer</Link>
            </Button>
            <Button >
              <Link to="/categoryRemover" >Category Remover</Link>
            </Button>
            <Button >
              <Link to="/setCategoryMandatory" >set Categories mandatory</Link>
            </Button>
            <Button >
              <Link to="/search" >Search</Link>
            </Button>
 * @returns 
 */


const Layout = () => {

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" id="appbar">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <Link to="/" ><HomeIcon></HomeIcon></Link>
            </IconButton>
            
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
};

export default Layout;
