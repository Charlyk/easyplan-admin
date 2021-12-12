import { red } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';

// Create a index instance.
const index = createTheme({
  palette: {
    primary: {
      main: '#3A83DC',
    },
    secondary: {
      main: '#3A83DC',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

export default index;
