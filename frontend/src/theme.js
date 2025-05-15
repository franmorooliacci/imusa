import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      // default: '#f5f5f5',
      default: '#eeeeee',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
  },
});

export default theme;
