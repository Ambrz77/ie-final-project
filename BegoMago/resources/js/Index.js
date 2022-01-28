import React, {Component} from 'react';
import { StylesProvider, jssPreset,createMuiTheme} from '@material-ui/core/styles';
import ReactDOM from 'react-dom';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import Main from './Router';
import {ThemeProvider} from "@material-ui/styles";
import { create } from 'jss';
import rtl from 'jss-rtl';


const theme = createMuiTheme({
    direction: 'rtl',
    palette: {
        type: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
    },
    typography: {
        fontFamily: [
            'Shabnam',
            'sans-serif'
        ].join(','),
    }
});
// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
class Index extends Component {

    constructor(props){
        super(props);
    }
    render() {
        return (
            <StylesProvider jss={jss}>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <Route component={Main}/>
                </BrowserRouter>
            </ThemeProvider>
            </StylesProvider>
        );
    }
}

ReactDOM.render(<Index/>, document.getElementById('index'));
