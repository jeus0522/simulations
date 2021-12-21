import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
	Card,
	CardHeader,
	CardContent,
	CardActions,
	Chip,
	Collapse,
	Divider,
	IconButton,
	Link,
	Typography
} from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import ContextMenu from '../../app/ContextMenu';
import CardComments from '../../app/CardComments';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		marginBottom: theme.spacing(1)
	},
	rootTreeView: {
		height: 240,
		flexGrow: 1,
		maxWidth: 400
	},
	media: {
		height: 0,
		paddingTop: '56.25%' // 16:9
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest
		})
	},
	expandOpen: {
		transform: 'rotate(180deg)'
	},
	avatar: {
		backgroundColor: red[500]
	},
	button: {
		marginRight: theme.spacing(2)
	},
	cardContent: {
		marginTop: 0,
		paddingTop: 5,
		paddingBottom: 0
	},
	caseIdIcon: {
		fontSize: 10,
		marginRight: 5
	},
	cardHeader: {
		paddingBottom: 2
	},
	cardHeaderTextMargin: {
		marginTop: -14
	},
	cardTypographyTitle: {
		fontSize: 16
	},
	cardTypographyText: {
		fontSize: 14
	},
	cardTypographyTextWhiteSpace: {
		whiteSpace: 'break-spaces'
	},
	cardActionContainer: {
		paddingBottom: 6
	},
	chipOriginalCase: {
		backgroundColor: theme.palette.divider,
		position: 'absolute',
		right: 60
	}
}));

export default function EditorCard(props) {
	const classes = useStyles();

	const { parsedCaseId, url, answer, originalCase, context, comments } = props.selectedCase;
	const { loadingComments, handleFetchComments, handleFetchDataQuery } = props;
	const partialRecordDescription = context.text.slice(0, 100);

	const [ expanded, setExpanded ] = React.useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
		handleFetchComments(parsedCaseId, 'selectedCases');
		handleFetchDataQuery(parsedCaseId);
	};

	return (
		<Card className={classes.root} variant="outlined">
			<CardHeader
				avatar={
					<Typography variant="button" display="block" className={classes.cardHeaderTextMargin}>
						<FiberManualRecordIcon className={classes.caseIdIcon} />CASE ID: {parsedCaseId}
					</Typography>
				}
				title={
					<Typography className={clsx(classes.cardTypographyText, classes.cardHeaderTextMargin)}>
						<Link href={url} target="_blank" rel="noreferrer">
							Go to Original Document
						</Link>
						{originalCase && (
							<Chip size="small" label="Original Case" className={classes.chipOriginalCase} />
						)}
					</Typography>
				}
				action={
					<div className={classes.cardActionContainer}>
						<IconButton
							className={clsx(classes.expand, {
								[classes.expandOpen]: expanded
							})}
							variant="contained"
							color="primary"
							onClick={handleExpandClick}
							aria-expanded={expanded}
							aria-label="show more"
							size="small"
						>
							<ExpandMoreIcon />
						</IconButton>
					</div>
				}
				className={classes.cardHeader}
			/>
			<Divider />
			<CardContent className={classes.cardContent}>
				<Typography variant="h6" component="p" className={classes.cardTypographyTitle}>
					Subject
				</Typography>
				<ContextMenu usedOn={'editor'}>
					<Typography
						variant="subtitle1"
						color="textSecondary"
						component="p"
						className={classes.cardTypographyText}
					>
						{answer}
					</Typography>
					{!expanded && (
						<Fragment>
							<Typography variant="h6" component="p" className={classes.cardTypographyTitle}>
								Description
							</Typography>
							<Typography
								variant="subtitle1"
								color="textSecondary"
								className={classes.cardTypographyText}
							>
								{partialRecordDescription} ...
							</Typography>
						</Fragment>
					)}
				</ContextMenu>
			</CardContent>
			<CardActions disableSpacing />
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent className={classes.cardContent}>
					<Typography variant="h6" component="p" className={classes.cardTypographyTitle}>
						Description
					</Typography>
					<ContextMenu usedOn={'editor'}>
						<Typography
							variant="subtitle1"
							color="textSecondary"
							paragraph
							className={clsx(classes.cardTypographyText, classes.cardTypographyTextWhiteSpace)}
						>
							{context.text}
						</Typography>
					</ContextMenu>
					<ContextMenu usedOn={'editor'}>
						<CardComments comments={comments} loadingComments={loadingComments} />
					</ContextMenu>
					<TreeView
						className={classes.root}
						defaultCollapseIcon={<ExpandMoreIcon />}
						defaultExpandIcon={<ChevronRightIcon />}
					>
						<TreeItem nodeId="1" label="Query 1 (Subject and Description)">
							<TreeItem nodeId="2" label="Resolution 1">
								<ContextMenu usedOn={'editor'}>
									<Typography variant="body2" gutterBottom>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
										incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
										nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
										Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
										fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
										culpa qui officia deserunt mollit anim id est laborum.
									</Typography>
								</ContextMenu>
							</TreeItem>
							<TreeItem nodeId="3" label="Resolution 2">
								<ContextMenu usedOn={'editor'}>
									<Typography variant="body2" gutterBottom>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
										incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
										nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
										Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
										fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
										culpa qui officia deserunt mollit anim id est laborum.
									</Typography>
								</ContextMenu>
							</TreeItem>
							<TreeItem nodeId="4" label="Resolution 3">
								<ContextMenu usedOn={'editor'}>
									<Typography variant="body2" gutterBottom>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
										incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
										nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
										Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
										fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
										culpa qui officia deserunt mollit anim id est laborum.
									</Typography>
								</ContextMenu>
							</TreeItem>
						</TreeItem>
						<TreeItem nodeId="5" label="Query 2 (Subject and Description)">
							<TreeItem nodeId="6" label="Resolution 1">
								<ContextMenu usedOn={'editor'}>
									<Typography variant="body2" gutterBottom>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
										incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
										nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
										Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
										fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
										culpa qui officia deserunt mollit anim id est laborum.
									</Typography>
								</ContextMenu>
							</TreeItem>
							<TreeItem nodeId="7" label="Resolution 2">
								<ContextMenu usedOn={'editor'}>
									<Typography variant="body2" gutterBottom>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
										incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
										nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
										Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
										fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
										culpa qui officia deserunt mollit anim id est laborum.
									</Typography>
								</ContextMenu>
							</TreeItem>
							<TreeItem nodeId="8" label="Resolution 3">
								<ContextMenu usedOn={'editor'}>
									<Typography variant="body2" gutterBottom>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
										incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
										nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
										Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
										fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
										culpa qui officia deserunt mollit anim id est laborum.
									</Typography>
								</ContextMenu>
							</TreeItem>
						</TreeItem>
					</TreeView>
				</CardContent>
			</Collapse>
		</Card>
	);
}
