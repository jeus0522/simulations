import React, { useState } from 'react';
import 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import SearchIcon from '@material-ui/icons/Search';
import IdentifyCasesTable from './IdentifyCasesTable';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		marginTop: 50
	},
	gridHeight: {
		height: '100%'
	},
	button: {
		margin: theme.spacing(1),
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2)
	},
	centeredGrid: {
		textAlign: 'center'
	}
}));

export const IdentifyCases = () => {
	const classes = useStyles();
	const [ selectedDateFrom, setSelectedDateFrom ] = useState(new Date());
	const [ selectedDateTo, setSelectedDateTo ] = useState(new Date());

	const handleDateChangeFrom = (date) => {
		setSelectedDateFrom(date);
	};
	const handleDateChangeTo = (date) => {
		setSelectedDateTo(date);
	};

	return (
		<div className={classes.root}>
			<Grid
				container
				direction="row"
				justify="center"
				alignItems="center"
				spacing={1}
				className={classes.gridHeight}
			>
				<Grid item xs={6} sm={3}>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<Grid container justify="space-around">
							<KeyboardDatePicker
								variant="inline"
								format="MM/dd/yyyy"
								margin="normal"
								id="date-picker-inline"
								label="FROM:"
								value={selectedDateFrom}
								onChange={handleDateChangeFrom}
								KeyboardButtonProps={{
									'aria-label': 'change date'
								}}
							/>
						</Grid>
					</MuiPickersUtilsProvider>
				</Grid>
				<Grid item xs={6} sm={3}>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<Grid container justify="space-around">
							<KeyboardDatePicker
								variant="inline"
								format="MM/dd/yyyy"
								margin="normal"
								id="date-picker-inline"
								label="TO:"
								value={selectedDateTo}
								onChange={handleDateChangeTo}
								KeyboardButtonProps={{
									'aria-label': 'change date'
								}}
							/>
						</Grid>
					</MuiPickersUtilsProvider>
				</Grid>
				<Grid item xs={12} className={classes.centeredGrid}>
					<Button
						variant="contained"
						color="primary"
						size="large"
						className={classes.button}
						startIcon={<SearchIcon />}
					>
						Search
					</Button>
				</Grid>
				<Grid item xs={12}>
					<IdentifyCasesTable />
				</Grid>
			</Grid>
		</div>
	);
};
