import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {Link} from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const link = [
    {
        text:'Chess',
        link:'/chess'
    },
    {
        text:'Lotto',
        link:'/lotto'
    },
    {
        text:'Mine',
        link:'/mine'
    },
    {
        text:'ResCheck',
        link:'/rescheck'
    },
    {
        text:'Tetris',
        link:'/tetris'
    },
    {
        text:'TicTacToe',
        link:'/tictactoe'
    },
  ]
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
        <Link to='/'><Button style={{ padding:20 }}><HomeIcon/></Button></Link>
    <Divider />
      <List>
        {link.map(({text, link}) => (
          <ListItem key={text} disablePadding>
            <Link to={link}>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}><MenuIcon /></Button>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        {DrawerList}
      </Drawer>
    </div>
  );
}