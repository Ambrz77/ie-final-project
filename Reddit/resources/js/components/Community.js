import React, {Component} from 'react'
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import List from "@material-ui/core/List";
import AutorenewIcon from '@material-ui/icons/Autorenew';
import Zoom from "@material-ui/core/Zoom";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {withRouter} from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Header from "./Header";

const useStyles = theme => ({
    root: {
        position: 'fixed',
        bottom: theme.spacing(2),
        left: theme.spacing(2),
        zIndex:10000
    },
    paper: {
        paddingBottom: 50,
        height: '100%',
        overflow: 'auto',
    },
    search: {
        paddingTop: 8,
    },
    bottomAppBar: {
        top: 'auto',
        bottom: 0,
    },
    dateEvent:{
      padding:8,
      fontSize:12,
      textAlign: 'end'
    },
    searchItem: {
        paddingLeft: 2,
        paddingRight: 2,
    },
    gutters:{
        paddingRight: 0
    },
    subheader: {
        textAlign: 'center',
        backgroundColor: '#eee',
        lineHeight: '36px'
    },
    inline: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    box: {
        height: 'calc(100vh - 100px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    primary: {
        paddingRight: 24
    }
});
function ScrollTop (props){
    const { children, window,classes } = props;
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = community => {
        const anchor = (community.target.ownerDocument || document).querySelector('#back-to-top-anchor');

        if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <Zoom in={trigger}>
            <div onClick={handleClick} role="presentation" className={classes.root}>
                {children}
            </div>
        </Zoom>
    );
}
class Home extends Component {
    _isMounted = false;
    _timeout = undefined;
    _search = '';
    _height = 0;
    constructor(props) {
        super(props);
        this.state = {
            community: [],
            name: '',
            error: '',
            currentPage: 1,
            hasMoreItem: false,
            isLoading: true,
            isFirstRun: true,
            isLoadMore: false
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.getData();
    }

    getData = () => {
        let {community,currentPage} = this.state;
        axios.get("/api/community?page=" + currentPage + this._search).then(response => {
            return response;
        }).then(json => {
            if (!json.data.error) {
                if (this._isMounted) {
                    let data = json.data;
                    community.push(...data.data);
                    this.setState({
                        community : community,
                        error: '',
                        isFirstRun: false,
                        isLoadMore: false,
                        currentPage: ++currentPage,
                        hasMoreItem: data.meta.current_page !== data.meta.last_page,
                        isLoading: false
                    });
                }
            }
        }).catch(error => {
            let err = error.message;
            if (this._isMounted) {
                this.setState({
                    error: err,
                    isLoadMore: false,
                    isLoading: false
                })
            }
        }).finally(this.setState({error: ''}));
    };
    loadMoreItems = (community) => {
        // let node = event.target;
        // const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
        if (this.state.hasMoreItem) {
            this.setState({isLoadMore:true});
            this.getData();
        }
    };

    handleData = (data) => {
        let {community,hasMoreItem} = this.state;
        if (hasMoreItem)return false;
        community.push(data);
        this.setState({community});
    };

    handleCommunityCreate = () => {
        return this.props.history.push("/community/create");
    };

    handleCommunity = (community) => {
        return this.props.history.push("/community/" + community.id + '/' + community.name);
    };

    handleName = (e) => {
        let value = e.target.value;
        if (this._timeout !== undefined)clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            this.setState({isLoading:true,community: [],currentPage:1},() => {
                if(value)this._search += '&name='+value;
                this.getData();
            });
        },1000)
    };


    render() {
        const {classes} = this.props;
        let {community, isLoading,isFirstRun,isLoadMore} = this.state;
        return (
            <React.Fragment>
                <CssBaseline/>
                <Header title={strings.COMMUNITIES} />
                {!isFirstRun ? <Grid container className={classes.search}>
                    <Grid item xs={12} className={classes.searchItem}>
                        <TextField
                            size="small"
                            id="outlined-name-input"
                            fullWidth
                            label={strings.SEARCH}
                            variant="outlined"
                            onChange={this.handleName}
                        />
                    </Grid>
                </Grid> : null}
                {isLoading ? <Box className={classes.box}>
                    <CircularProgress color="secondary"/>
                </Box> : null}
                {!isLoading && !community.length ? <Box className={classes.box}>
                    <Typography>{strings.CONVERSION_NOT_FOUND}</Typography>
                </Box> : null}
                {/*<Paper onScroll={this.loadMoreItems} className={classes.paper} elevation={0}>*/}
                <List className={classes.paper}>
                    {community.map((item, index) => (
                        <Zoom key={item.id} in={true}>
                            <Paper>
                                <ListItem divider button onClick={() => this.handleCommunity(item)} classes={{gutters: classes.gutters}}>
                                    <ListItemText classes={{secondary: classes.inline}}
                                                  primary={<Typography className={classes.primary} variant={"h6"}>{item.name}</Typography>}/>
                                </ListItem>
                            </Paper>
                        </Zoom>
                    ))}
                    {this.state.hasMoreItem ?  <Box display="flex" justifyContent="center" m={2}>
                        {isLoadMore ? <CircularProgress size={24} color="secondary"/> :
                            <Fab color="secondary" size="small" aria-label="load more item" onClick={this.loadMoreItems}>
                                <AutorenewIcon />
                            </Fab>}
                    </Box> : null}
                </List>
                {!isFirstRun ? <AppBar position="fixed" className={classes.bottomAppBar} color={"default"}>
                    <Toolbar>
                        <Grid container>
                          <Grid item xs={12}>
                              <Button variant="outlined" fullWidth onClick={this.handleCommunityCreate}>
                                  {strings.CREATE_COMMUNITY}
                              </Button>
                          </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar> : null}
                {/*</Paper>*/}
                {isLoading}
                <ScrollTop {...this.props}>
                <Fab color="secondary" size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
                </ScrollTop>
            </React.Fragment>
        )
    }
}

export default withRouter((withStyles(useStyles)(Home)));
