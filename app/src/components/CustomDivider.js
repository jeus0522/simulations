import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	divider: {
		marginLeft: -8,
		marginRight: -8,
		marginBottom: 5
	}
}));

const CustomDivider = () => {
	const classes = useStyles();

	return (
		<Grid item xs={12}>
			<Divider className={classes.divider} />
		</Grid>
	);
};

export default CustomDivider;
