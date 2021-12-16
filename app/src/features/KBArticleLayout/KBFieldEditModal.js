import React, { useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import {
	Button,
	Checkbox,
	FormGroup,
	FormControlLabel,
	Grid,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Slide
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	gridItem: {
		display: 'flex'
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function KBFieldEditModal(props) {
	const classes = useStyles();
	const { openEditModal, handleCloseEditModal, handleSaveEditField, fieldToEdit } = props;
	const [ newFieldValues, setNewFieldValues ] = useState({
		label: '',
		multiline: false,
		numberOfLines: 1
	});

	useDeepCompareEffect(
		() => {
			setNewFieldValues(fieldToEdit);
		},
		[ fieldToEdit ]
	);

	const handleChangeNewFieldValues = (prop) => (event) => {
		if (event.target.checked) {
			setNewFieldValues({ ...newFieldValues, [prop]: event.target.checked });
		} else {
			setNewFieldValues({ ...newFieldValues, [prop]: event.target.value });
		}
	};
	return (
		<Dialog
			open={openEditModal}
			TransitionComponent={Transition}
			keepMounted
			onClose={handleCloseEditModal}
			aria-labelledby="form-dialog-title"
		>
			<DialogTitle id="form-dialog-title">Edit Article Field</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							label="Label"
							variant="outlined"
							size="small"
							value={newFieldValues.label}
							fullWidth
							onChange={handleChangeNewFieldValues('label')}
							autoFocus
						/>
					</Grid>
					<Grid item xs={8} className={classes.gridItem}>
						<FormGroup row>
							<FormControlLabel
								control={
									<Checkbox
										checked={newFieldValues.multiline}
										onChange={handleChangeNewFieldValues('multiline')}
									/>
								}
								label="Multiline"
							/>
						</FormGroup>
						<TextField
							label="Rows"
							variant="outlined"
							size="small"
							value={newFieldValues.numberOfLines}
							onChange={handleChangeNewFieldValues('numberOfLines')}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseEditModal} color="primary" variant="contained">
					Cancel
				</Button>
				<Button onClick={() => handleSaveEditField(newFieldValues)} color="primary" variant="contained">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
