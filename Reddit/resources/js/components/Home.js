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
import {Chip, FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";

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
    sortSelect: {
    paddingTop: 10.5,
        paddingBottom: 10.5
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

    const handleClick = event => {
        const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

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
            event: [],
            title: '',
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
        this.getCommunity();
    }

    getCommunity = () => {
        let {community} = this.state;
        axios.get("/api/community?hot=1").then(response => {
            return response;
        }).then(json => {
            if (!json.data.error) {
                if (this._isMounted) {
                    let data = json.data;
                    community.push(...data.data);
                    this.setState({
                        community : community,
                    });
                }
            }
        }).catch(error => {

        });
    };

    getData = () => {
        let {event,currentPage} = this.state;
        axios.get("/api/event?page=" + currentPage + '&sort=' + (localStorage.getItem('post_sort') || 'latest') + this._search).then(response => {
            return response;
        }).then(json => {
            if (!json.data.error) {
                if (this._isMounted) {
                    let data = json.data;
                    event.push(...data.data);
                    this.setState({
                        event : event,
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
    loadMoreItems = (event) => {
        // let node = event.target;
        // const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
        if (this.state.hasMoreItem) {
            this.setState({isLoadMore:true});
            this.getData();
        }
    };

    handleData = (data) => {
        let {event,hasMoreItem} = this.state;
        if (hasMoreItem)return false;
        event.push(data);
        this.setState({event});
    };

    handleCommunityCreate = () => {
        return this.props.history.push("/community/create");
    };

    handlePostCreate = () => {
        return this.props.history.push("/event/create");
    };

    handleEdit = (e, event) => {
        e.stopPropagation();
        return this.props.history.push('/editEvent/' + event.id);
    };

    handleEvent = (event) => {
        return this.props.history.push("/event/" + event.id);
    };

    handleTitle = (e) => {
        let value = e.target.value;
        if (this._timeout !== undefined)clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            this.setState({isLoading:true,event: [],currentPage:1},() => {
                if(value)this._search = '&title='+value;
                else this._search = '';
                this.getData();
            });
        },1000)
    };

    handleCommunity = (community) => {
        return this.props.history.push("/community/" + community.id + '/' + community.name);
    }

    handleSort = (e) => {
        localStorage.setItem('post_sort',e.target.value);
        this.setState({event:[],isLoading:true,currentPage:1},() => this.getData())
    }

    render() {
        const {classes} = this.props;
        let {community,event, isLoading,isFirstRun,isLoadMore} = this.state;
        return (
            <React.Fragment>
                <CssBaseline/>
                <Header user={user}/>
                {community.length ? <Box display="flex" style={{marginTop:8}}>
                    {community.map(item => <Chip
                        style={{marginRight:4}}
                        label={item.name}
                        key={item.id}
                        onClick={() => this.handleCommunity(item)}
                        variant="outlined"
                    />)}
                    </Box> : null}
                <Grid container className={classes.search}>
                    <Grid item xs={4} className={classes.searchItem}>
                        <FormControl variant="outlined" fullWidth>
                            <Select
                                classes={{root: classes.sortSelect}}
                                onChange={this.handleSort}
                                label={strings.SORT}
                                value={(localStorage.getItem('post_sort') || 'latest')}
                                inputProps={{
                                    name: 'sort',
                                    id: 'outlined-sort-native-simple',
                                }}>
                                <MenuItem value="latest" key="1">{strings.LATEST}</MenuItem>
                                <MenuItem value="like" key="2">{strings.BIG_LIKE}</MenuItem>
                                <MenuItem value="comment" key="3">{strings.BIG_COMMENT}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={8} className={classes.searchItem}>
                        <TextField
                            size="small"
                            id="outlined-title-input"
                            fullWidth
                            label={strings.SEARCH}
                            variant="outlined"
                            onChange={this.handleTitle}
                        />
                    </Grid>
                </Grid>
                {isLoading ? <Box className={classes.box}>
                    <CircularProgress color="secondary"/>
                </Box> : null}
                {!isLoading && !event.length ? <Box className={classes.box}>
                    <Typography>{strings.CONVERSION_NOT_FOUND}</Typography>
                </Box> : null}
                <List className={classes.paper}>
                    {event.map((item, index) => (
                        <Zoom key={item.id} in={true}>
                            <Paper>
                                <ListItem divider button onClick={() => this.handleEvent(item)} classes={{gutters: classes.gutters}}>
                                    <ListItemText classes={{secondary: classes.inline}}
                                                  primary={<Typography className={classes.primary} variant={"h6"}>{item.title}</Typography>}
                                                  secondary={
                                                      <Box display="flex" flexDirection="column" width="100%" justifyContent="flex-start">
                                                          <Typography variant={"body2"} style={{marginTop:8}}>{item.description}</Typography>
                                                          <Typography variant={"body2"} className={classes.dateEvent}>{item.date}</Typography></Box>}/>
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
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                              <Button variant="outlined" fullWidth onClick={this.handleCommunityCreate}>
                                  {strings.CREATE_COMMUNITY}
                              </Button>
                          </Grid>
                            <Grid item xs={6}>
                                <Button variant="outlined" fullWidth onClick={this.handlePostCreate}>
                                    {strings.CREATE_EVENT}
                                </Button>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar> : null}
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
