import '../css_files/DarkContent.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppBar, Typography, Toolbar, Box, Button, Stack } from '@mui/material';

import bcground2 from '../assets/bcground2.mp4';
import DarkMenu from './DarkMenu';

function DarkHeader() {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
    },
  });

  return (
    <>
      <video autoPlay loop muted>
        <source src={bcground2} type='video/mp4' />
      </video>
      <div className='App-header'></div>

      <div className="App">
        <ThemeProvider theme={darkTheme}>
          <AppBar position="static" color="primary" style={{ marginBottom: 50 }}>
            <Toolbar>
              <Typography variant="h6" noWrap component="div" color="#82de13">
                Calculator
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <DarkMenu />
            </Toolbar>
          </AppBar>
        </ThemeProvider>
      </div>
    </>
  );
}

export default DarkHeader;
