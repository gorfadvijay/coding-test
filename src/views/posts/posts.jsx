import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {
  fetchPostsStart,
  deletePostStart,
  clearPostMessages,
} from "../../redux/posts/posts.actions";
import { connect } from "react-redux";
import Pagination from "@material-ui/lab/Pagination";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Box from "@material-ui/core/Box";
import TransitionsModal from "../../containers/posts/components/edit-modal";
import AddItemModal from "../../containers/posts/components/add-modal";
import DeleteForeverRounded from "@material-ui/icons/DeleteForeverRounded";
import blue from "@material-ui/core/colors/blue";
import SkeletonComponent from "../../containers/components/skeleton.component";
import { useSnackbar } from "notistack";
import { createStructuredSelector } from "reselect";
import {
  selectPostsData,
  selectPostsErrorMessage,
  selectPostsFetchStatus,
} from "../../redux/posts/posts.selectors";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
  },
  postImage: {
    height: "20vmin",
    pointerEvents: "none",
  },
  card: {
    padding: theme.spacing(2),
    position: "relative",
  },
  delete: {
    position: "absolute",
    top: "10px",
    left: "10px",
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginLeft: "auto",
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  length: {
    fontSize: "16px",
    color: blue,
  },
}));

const PostContainer = ({
  fetchPostsStart,
  deletePostStart,
  posts,
  clearPostMessages,
  errorMessage,
  isFetching,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [pagePosts, setPagePosts] = useState([]);
  const classes = useStyles();
  useEffect(() => {
    if (posts.length < 1) fetchPostsStart();
  }, [fetchPostsStart, posts]);

  useEffect(() => {
    if (errorMessage) {
      enqueueSnackbar(errorMessage, { variant: "error" });
      clearPostMessages();
    }
  }, [errorMessage, clearPostMessages, enqueueSnackbar]);

  useEffect(() => {
    setPagePosts(posts);
  }, [isFetching, posts]);

  return (
    <Box className={classes.root}>
      <Typography variant={"h2"} component={"h1"}>
        Posts <strong className={classes.length}> [{posts.length}]</strong>
      </Typography>
      <AddItemModal />

      <Grid container justify={"center"} alignItems={"center"} spacing={4}>
        {pagePosts.length > 1 ? (
          pagePosts.map((each) => (
            <Grid item xs={10} sm={5} md={3} key={each.id}>
              <Paper className={classes.card} elevation={10}>
                id: {each.id} UserId: {each.userId}
                <DeleteForeverRounded
                  color={"primary"}
                  className={classes.delete}
                  onClick={() => deletePostStart(each.id)}
                />
                <Typography>Title: {each.title}</Typography>
                <Typography>Body: {each.body}</Typography>
                <Box>
                  <TransitionsModal key={each.id} post={each} />
                </Box>
              </Paper>
            </Grid>
          ))
        ) : (
          <SkeletonComponent />
        )}
      </Grid>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => ({
  fetchPostsStart: () => dispatch(fetchPostsStart()),
  clearPostMessages: () => dispatch(clearPostMessages()),
  deletePostStart: (id) => dispatch(deletePostStart(id)),
});

const mapStateToProps = createStructuredSelector({
  posts: selectPostsData,
  isFetching: selectPostsFetchStatus,
  errorMessage: selectPostsErrorMessage,
});

export default connect(mapStateToProps, mapDispatchToProps)(PostContainer);
