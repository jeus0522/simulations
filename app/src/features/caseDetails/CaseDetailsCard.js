import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
	Button,
	Card,
	CardHeader,
	CardContent,
	CardActions,
	Collapse,
	Divider,
	IconButton,
	Link,
	Typography
} from '@material-ui/core';

import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import CardComments from '../../app/CardComments';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		marginBottom: theme.spacing(1)
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
	caseIdContainer: {
		flexGrow: 1,
		width: '100%'
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
	}
}));

export default function CaseDetailsCard({
	record,
	handleAddSelectedCase,
	handleFetchComments,
	loadingComments,
	commentsFor
}) {
	const classes = useStyles();
	const [ expanded, setExpanded ] = React.useState(false);

	const { parsedCaseId, answer, url, comments } = record;
	const partialRecordDescription = record.context.text.slice(0, 100);

	const handleExpandClick = () => {
		setExpanded(!expanded);
		handleFetchComments(parsedCaseId, commentsFor);
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
					url ? (
						<Typography className={clsx(classes.cardTypographyText, classes.cardHeaderTextMargin)}>
							<Link href={url} target="_blank" rel="noreferrer">
								Go to Original Document
							</Link>
						</Typography>
					) : null
				}
				action={
					<div className={classes.cardActionContainer}>
						<Button
							variant="contained"
							color="primary"
							size="small"
							className={classes.button}
							startIcon={<AddIcon />}
							onClick={() => handleAddSelectedCase(record)}
						>
							Add to Similar Cases
						</Button>
						<IconButton
							className={clsx(classes.expand, {
								[classes.expandOpen]: expanded
							})}
							variant="contained"
							color="secondary"
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
						<Typography variant="subtitle1" color="textSecondary" className={classes.cardTypographyText}>
							{partialRecordDescription} ...
						</Typography>
					</Fragment>
				)}
			</CardContent>
			<CardActions disableSpacing />
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent className={classes.cardContent}>
					<Typography variant="h6" component="p" className={classes.cardTypographyTitle}>
						Description
					</Typography>
					<Typography
						variant="subtitle1"
						color="textSecondary"
						paragraph
						className={clsx(classes.cardTypographyText, classes.cardTypographyTextWhiteSpace)}
					>
						{record.context.html ? record.context.html : record.context.text}
					</Typography>
					<CardComments comments={comments} loadingComments={loadingComments} />
				</CardContent>
			</Collapse>
		</Card>
	);
}
