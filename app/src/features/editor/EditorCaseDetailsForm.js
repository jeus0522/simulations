import React from 'react';
import clsx from 'clsx';
import 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, TextField } from '@material-ui/core';

import ContextMenu from '../../app/ContextMenu';

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStylesCaseDetailsForm = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		height: '100%'
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
	button: {
		margin: theme.spacing(1)
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
	}
}));

const EditorCaseDetailsForm = ({ caseID, dateCreated, dateResolved, caseSubject, caseDescription }) => {
	const classes = useStylesCaseDetailsForm();

	return (
		<div className={classes.root}>
			<Grid container direction="row" justify="flex-start" alignItems="flex-start" className={classes.gridHeight}>
				<Grid item xs={12} className={clsx(classes.gridItemWidth, classes.gridFormHeight)}>
					<Grid
						container
						direction="row"
						justify="flex-start"
						alignItems="flex-start"
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
						<ContextMenu usedOn={'editor'}>
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
						<ContextMenu usedOn={'editor'}>
							<TextField
								disabled
								id="outlined-disabled-desc"
								label="Description"
								value={caseDescription}
								variant="outlined"
								size="small"
								fullWidth
								multiline
								rowsMax={12}
							/>
						</ContextMenu>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default EditorCaseDetailsForm;
