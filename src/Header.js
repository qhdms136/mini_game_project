import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DrawerButton from './DrawerButton';


function appBarLabel() {
    return (
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          <Link to='/'><img className='Logo' alt='미니게임천국' src='/img/mini_game.png'/></Link>
        </Typography>
        <DrawerButton/>
      </Toolbar>
    );
  }
  
  const darkTheme = createTheme({
      palette: {
        mode: 'dark',
        primary: {
          main: '#fff',
        },
      },
    });
function Header(){

    return(    
        <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <ThemeProvider theme={darkTheme}>
            <AppBar position="static" color="primary">
            {appBarLabel()}
            </AppBar>
        </ThemeProvider>
        </Stack>
    )
}

export default Header;