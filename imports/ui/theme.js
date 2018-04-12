import { createMuiTheme } from "material-ui";

export const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#ff6f60',
            main: '#e53935',
            dark: '#ab000d',
            contrastText: '#fff',
        },
        secondary: {
            light: '#e2f1f8',
            main: '#b0bec5',
            dark: '#808e95',
            contrastText: '#fff',
        },
    },
});