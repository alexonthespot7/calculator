import * as React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ThemeContext from '../contexts/ThemeContext';

const theme = createTheme({
    palette: {
      secondary: {
        main: '#82de13',
        contrastText: '#000' 
      },
    },
});

export default function DarkMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { setTheme } = React.useContext(ThemeContext);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeD = () => {
    setTheme('dark');
    setAnchorEl(null);
  };

  const handleThemeL = () => {
    setTheme('light');
    setAnchorEl(null);
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Button
            id="basic-button"
            color='secondary'
            variant='text'
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
        >
            Theme
        </Button>
      </ThemeProvider>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
            'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleThemeD}>
          Dark
        </MenuItem>
        <MenuItem onClick={handleThemeL}>
          Light
        </MenuItem>
      </Menu>
    </div>
  );
}