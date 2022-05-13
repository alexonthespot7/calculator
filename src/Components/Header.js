import '../App.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppBar, Typography, Toolbar, Box } from '@mui/material';

function Header() {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
    },
  });

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static" color="primary" style={{marginBottom: 50}}>
          <Toolbar>
            <Box sx={{ flexGrow: 0.5 }} />
            <Typography variant="h6" noWrap component="div" >
              Calculator
            </Typography>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </div>
  );
}

export default Header;
