import React from 'react';
import 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

import EditorCard from './EditorCard';

const useStylesEditorSelectedCases = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		height: '100%'
	},
	gridHeight: {
		height: '100%'
	},
	gridTextMargin: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2)
	},
	gridMarginBottom: {
		marginBottom: theme.spacing(2)
	}
}));

const EditorSelectedCases = (props) => {
	const classes = useStylesEditorSelectedCases();

	const { selectedCases, loadingComments, handleFetchComments, handleFetchDataQuery } = props;

	return (
		<div className={classes.root}>
			<Grid container direction="row" justify="flex-start" alignItems="flex-start" className={classes.gridHeight}>
				<Grid item xs={12} className={classes.gridHeight}>
					{selectedCases &&
						selectedCases.map((sc) => {
							return (
								<EditorCard
									key={sc.answerid}
									selectedCase={sc}
									loadingComments={loadingComments}
									handleFetchComments={handleFetchComments}
									handleFetchDataQuery={handleFetchDataQuery}
								/>
							);
						})}
				</Grid>
			</Grid>
		</div>
	);
};

export default EditorSelectedCases;
