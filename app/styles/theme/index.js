import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a index instance.
const index = createMuiTheme({
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
