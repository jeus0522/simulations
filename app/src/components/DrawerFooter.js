import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		zIndex: 100,
		width: '100%',
		height: 30,
		textAlign: 'center',
		padding: 5
	},
	text: {
		fontSize: 13
	}
}));

const DrawerFooter = () => {
	const classes = useStyles();

	return (
		<Box className={classes.root} bgcolor="primary.main" color="primary.contrastText" p={2}>
			<Typography variant="caption" display="block" gutterBottom className={classes.text}>
				Quark.ai® 2021
			</Typography>
		</Box>
	);
};

export default DrawerFooter;
