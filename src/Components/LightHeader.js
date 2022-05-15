import '../App.css';

import { AppBar, Typography, Toolbar, Box, Button, Stack } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import lightbg from '../assets/lightbg.mp4';
import LightMenu from './LightMenu';

const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#f7f9ff',
        contrastText: '#3d69ef' 
      },
    },
});

function LightHeader({ setTheme }) {

  return (
    <>
      <video autoPlay loop muted>
        <source src={lightbg} type='video/mp4' />
      </video>
      <div className='App-light-header'></div>
      <ThemeProvider theme={lightTheme}>
        <div className="App">
          <AppBar position="static" style={{marginBottom: 50}} color='primary'>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                Calculator
                </Typography>
                <Box sx={{flexGrow: 1}} />
                <LightMenu setThemes={setTheme} />
            </Toolbar>
          </AppBar>
        </div>
      </ThemeProvider>
    </>
  );
}

export default LightHeader;
