import '../css_files/Headers.css';
import bcground2 from '../assets/bcground2.mp4';
import lightbg from '../assets/lightbg.mp4';

import { useContext } from 'react';

import { AppBar, Typography, Toolbar, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import LightMenu from './LightMenu';
import ThemeContext from '../contexts/ThemeContext';
import DarkMenu from './DarkMenu';
import useMediaQuery from '../Hooks/useMediaQuery';

//creating custom theme for the light header
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#f7f9ff',
      contrastText: '#3d69ef'
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

function Header() {
  const { theme } = useContext(ThemeContext);
  const isPC = useMediaQuery("(min-width: 950px)");

  const isDark = theme === 'dark';
  return (
    <>
      {isDark && isPC
        && <video autoPlay loop muted>
          <source src={bcground2} type='video/mp4' />
        </video>
      }
      {!isDark && isPC
        && <video autoPlay loop muted>
          <source src={lightbg} type='video/mp4' />
        </video>
      }
      <div className={isDark ? 'App-header' : 'App-light-header'}></div>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <AppBar position="static" style={{ marginBottom: isDark ? 50 : 70 }} color='primary'>
          <Toolbar>
            <Typography variant="h6" noWrap component="div" color={isDark ? '#82de13' : ''}>
              Calculator
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            {!isDark && <LightMenu />}
            {isDark && <DarkMenu />}
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </>
  );
}

export default Header;
