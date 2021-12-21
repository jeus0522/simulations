import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Divider, Grow, Fade, List, ListItem, ListItemText, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	loadingRoot: {
		textAlign: 'center'
	},
	cardTypographyTitle: {
		fontSize: 16
	},
	cardTypographyTextWhiteSpace: {
		whiteSpace: 'break-spaces'
	},
	listRoot: {
		width: '100%',
		maxHeight: 500,
		overflowY: 'scroll',
		backgroundColor: theme.palette.background.paper
	},
	loadingText: {
		fontSize: 14
	}
}));

export default function CardComments({ comments, loadingComments }) {
	const classes = useStyles();

	if (comments === undefined && loadingComments) {
		return (
			<div className={classes.root}>
				<div className={classes.loadingRoot}>
					<div>
						<Typography variant="h6" className={classes.loadingText}>
							Loading comments...
						</Typography>
					</div>
					<div>
						<CircularProgress />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={classes.root}>
			<Typography variant="h6" component="p" className={classes.cardTypographyTitle}>
				Comments
			</Typography>
			<List>
				{comments.map((comment, index) => (
					<Grow in timeout={800 + index * 100} key={`comment-${comment.answerid}`}>
						<div>
							<ListItem alignItems="flex-start">
								<ListItemText
									primary={`Comment #${index + 1}`}
									secondary={comment.context.text.replace('Comment ', '')}
								/>
							</ListItem>
							<Divider component="li" />
						</div>
					</Grow>
				))}
			</List>
		</div>
	);
}
