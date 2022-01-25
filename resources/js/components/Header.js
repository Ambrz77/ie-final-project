import React, {Component} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {withRouter} from "react-router-dom";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from "@material-ui/core/IconButton";
import ProgressDialog from "./ProgressDialog";
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {Brightness4, Brightness1, Brightness2} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
}));
class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open : false
        }
    }
    handleTheme = () => {
        let isDark = localStorage.getItem('theme') === 'dark';
        localStorage.setItem('theme',isDark ? 'light': 'dark');
        window.location.reload();
    }
    logOut = () => {
        this.setState({open: true});
        axios.post("/api/logout", []).then(response => {
            return response;
        }).then(json => {
            if (!json.data.error) {
                let appState = {
                    user: null
                };
                localStorage["appState"] = JSON.stringify(appState);
                window.user = null;
                this.setState(appState);
                setTimeout(() => {
                    return this.props.history.push("/login");
                }, 1000);
            } else {
                alert(`Our System Failed To Create Event!`);
            }
        });
    };
    // 1.3
    render() {
        const classes = useStyles;
        const {title,history} = this.props;
        return (
            <Paper square>
                <ProgressDialog open={this.state.open}/>
                <AppBar position="static" color={"default"}>
                    <Toolbar id="back-to-top-anchor">
                        <Grid container justify="space-between">
                            <Grid item style={{display:'flex'}}>
                                {user && title ? <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.props.history.goBack}>
                                    <ArrowForwardIosIcon fontSize="small" />
                                </IconButton> : null}
                                <Button disableRipple>{title || process.env.MIX_APP_NAME}</Button>
                            </Grid>
                            <Grid item>
                                {user && history.location.pathname === '/' ? <IconButton color="inherit" aria-label="menu" onClick={() => this.props.history.push('/community')}>
                                    <FormatListBulletedIcon fontSize="small" />
                                </IconButton> : null}
                                <IconButton color="inherit" aria-label="menu" onClick={this.handleTheme}>
                                    {localStorage.getItem('theme') === 'dark' ? <Brightness4 fontSize="small" /> : <Brightness2 fontSize="small" />}
                                </IconButton>
                                {user ?  <IconButton style={{transform: 'rotate(180deg)'}} color="inherit" aria-label="menu" onClick={this.logOut}>
                                    <ExitToAppIcon fontSize="small" />
                                </IconButton> : null}
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </Paper>
        )
    }
}
export default withRouter(Header);
