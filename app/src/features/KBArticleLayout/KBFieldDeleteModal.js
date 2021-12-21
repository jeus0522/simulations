import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@material-ui/core';
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
	const { openDeleteModal, handleCloseDeleteModal, handleDeleteField, fieldToEdit } = props;

	return (
		<div>
			<Dialog
				open={openDeleteModal}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleCloseDeleteModal}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Delete Article Field</DialogTitle>
				<DialogContent>
					<DialogContentText
					>{`Do you want to the delete the field ${fieldToEdit.label} ?`}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDeleteModal} color="primary" variant="contained">
						Cancel
					</Button>
					<Button onClick={() => handleDeleteField(fieldToEdit)} color="primary" variant="contained">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
