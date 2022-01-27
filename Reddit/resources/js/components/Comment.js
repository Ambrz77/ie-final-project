import React, {Component} from 'react'
import Zoom from "@material-ui/core/Zoom";
import {withRouter} from "react-router-dom";
import withStyles from "@material-ui/styles/withStyles";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";


const useStyles = theme => ({
    root: {
        position: 'fixed',
        bottom: theme.spacing(6),
        left: theme.spacing(2),
        zIndex: 10000
    },
    text: {
        padding: theme.spacing(2, 2, 0),
    },
    paper: {
        paddingBottom: 50,
        height: '100%',
        overflow: 'auto',
    },
    list: {
        marginBottom: theme.spacing(1),
    },
    subheader: {
        textAlign: 'center',
        backgroundColor: '#eee',
        lineHeight: '36px'
    },
    bottomAppBar: {
        top: 'auto',
        bottom: 0,
        backgroundColor: theme.palette.background.default
    },
    topAppBar: {
        backgroundColor: theme.palette.background.default
    },
    grow: {
        flexGrow: 1,
    },
    private: {
        position: 'absolute',
        right: 0,
        top: 15,
        backgroundColor: 'red',
        color: 'white',
        borderRadius: 0,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        padding: '2px 6px',
        fontSize: 12
    },
    box: {
        height: 'calc(100vh - 100px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    link: {
        display: 'flex',
        alignItems: 'center'
    },
    archiveItem: {
        display: 'flex',
        alignItems: 'center'
    }
});

function ScrollTop(props) {
    const {children, window, classes} = props;
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = event => {
        const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

        if (anchor) {
            anchor.scrollIntoView({behavior: 'smooth', block: 'center'});
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

class Comment extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isDeleted: false,
            ip: '',
            url: '',
            event: {
                id: '',
                user_id: '',
                title: '',
                username: '',
                description: '',
                date: '',
                status: '',
                like_count: 0,
                dislike_count: 0,
                community: {id: '', name: ''},
                comments: {
                    data: [],
                    total: 0
                },
            },
            openDialog: false,
            isProgress: false,
            addItemId: 0,
            currentPage: 1,
            hasMoreItem: false,
            isLoadMore: false,
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.getData();
    }

}

export default withRouter((withStyles(useStyles)(Comment)));
