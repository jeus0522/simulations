import React, { Fragment } from 'react';
import clsx from 'clsx';
import 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Grid, List, ListItem, ListItemText, Typography, TextField } from '@material-ui/core';

import ContextMenu from '../../app/ContextMenu';

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStylesCaseDetailsForm = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		height: '100%'
	},
	listRoot: {
		width: '100%',
		overflowY: 'scroll',
		backgroundColor: theme.palette.background.paper
	},
	gridHeight: {
		height: '100%'
	},
	gridItemWidth: {
		width: '100%'
	},
	gridFormHeight: {
		height: '90%'
	},
	gridTextMargin: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(1)
	},
	gridEndAlign: {
		textAlign: 'end'
	},
	caseIdIcon: {
		fontSize: 10,
		marginRight: 5
	},
	commentsTitle: {
		backgroundColor: theme.palette.divider,
		padding: theme.spacing(1),
		marginTop: theme.spacing(1)
	}
}));

const CaseDetailsForm = ({ caseID, dateCreated, dateResolved, caseSubject, caseDescription, originalCase }) => {
	const classes = useStylesCaseDetailsForm();

	return (
		<div className={classes.root}>
			<Grid container direction="row" justify="flex-start" alignItems="flex-start" className={classes.gridHeight}>
				<Grid item xs={12} className={clsx(classes.gridItemWidth, classes.gridFormHeight)}>
					<Grid
						container
						direction="row"
						justify="flex-start"
						alignItems="center"
						style={{ paddingLeft: 10 }}
					>
						<Grid item xs={12}>
							<Typography color="textPrimary" variant="button" display="block">
								<FiberManualRecordIcon className={classes.caseIdIcon} />CASE ID: {caseID}
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography color="textPrimary" variant="body2" className={classes.fontWeightSubtitles}>
								<FiberManualRecordIcon className={classes.caseIdIcon} />Date Created:{' '}
								{dateCreated ? dateCreated : '-'}
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography color="textPrimary" variant="body2" className={classes.fontWeightSubtitles}>
								<FiberManualRecordIcon className={classes.caseIdIcon} />Date Resolved:{' '}
								{dateResolved ? dateResolved : '-'}
							</Typography>
						</Grid>
					</Grid>
					<Grid item xs={12} className={classes.gridTextMargin}>
						<ContextMenu usedOn={'caseDetails'}>
							<TextField
								disabled
								id="outlined-disabled"
								label="Subject"
								value={caseSubject}
								variant="outlined"
								size="small"
								fullWidth
							/>
						</ContextMenu>
					</Grid>
					<Grid item xs={12}>
						<ContextMenu usedOn={'caseDetails'}>
							<TextField
								disabled
								id="outlined-disabled-desc"
								label="Description"
								value={caseDescription}
								variant="outlined"
								size="small"
								fullWidth
								multiline
								rowsMax={30}
							/>
						</ContextMenu>
					</Grid>
					{originalCase.comments && (
						<Fragment>
							<Grid item xs={12} className={classes.commentsTitle}>
								<Typography variant="h6">Comments</Typography>
							</Grid>
							<Grid item xs={12}>
								<ContextMenu usedOn={'caseDetails'}>
									<List className={classes.listRoot}>
										{originalCase.comments.map((comment, index) => (
											<Fragment>
												<ListItem alignItems="flex-start">
													<ListItemText
														primary={`Comment #${index + 1}`}
														secondary={comment.context.text.replace('Comment ', '')}
													/>
												</ListItem>
												<Divider component="li" />
											</Fragment>
										))}
									</List>
								</ContextMenu>
							</Grid>
						</Fragment>
					)}
				</Grid>
			</Grid>
		</div>
	);
};

export default CaseDetailsForm;
