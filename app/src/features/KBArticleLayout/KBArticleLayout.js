import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import {
	Button,
	Card,
	CardActions,
	CardContent,
	Checkbox,
	CssBaseline,
	Container,
	Divider,
	FormGroup,
	FormControlLabel,
	Grid,
	TextField,
	Typography
} from '@material-ui/core';
import { copyTextToEditor, saveLayoutConfig } from '../../actions/editorActions';

import Page from '../../app/Page';
import KBFieldEditModal from './KBFieldEditModal';
import KBFieldDeleteModal from './KBFieldDeleteModal';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
	gridItem: {
		display: 'flex'
	},
	actionButton: {
		margin: theme.spacing(1)
	},
	cardContent: {
		padding: '8px 0px 0px 8px'
	},
	cardTitle: {
		fontWeight: 500
	},
	newFieldPadding: {
		padding: '40px 10px 10px 10px'
	},
	containerDiv: {
		height: '100vh',
		paddingTop: 48
	},
	gridHeight: {
		height: '100%'
	},
	fieldsGridContainer: {
		background: theme.palette.divider
	}
}));

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [ removed ] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle, theme) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: 'none',
	padding: 0,
	margin: `0 0 ${grid}px 0`,

	// styles we need to apply on draggables
	...draggableStyle
});

const getListStyle = (isDraggingOver) => ({
	//background: isDraggingOver ? 'lightblue' : 'lightgrey',
	padding: grid,
	width: '100%'
});

const KBArticleLayout = (props) => {
	const classes = useStyles();
	const { history, editorData, storeEditorFields, actions } = props;
	const [ openEditModal, setOpenEditModal ] = React.useState(false);
	const [ openDeleteModal, setOpenDeleteModal ] = React.useState(false);
	const [ newFieldValues, setNewFieldValues ] = useState({
		label: '',
		multiline: false,
		numberOfLines: 1
	});

	const [ editorFields, setEditorFields ] = useState([ ...storeEditorFields ]);
	const [ fieldToEdit, setFieldToEdit ] = useState({});
	//editorData, setEditorData
	const [ editorFieldValues, setEditorFieldValues ] = useState({
		...editorData
	});

	function onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) {
			return;
		}

		const items = reorder(editorFields, result.source.index, result.destination.index);
		setEditorFields(items);
	}

	const handleSaveEditField = (newEditedFieldValues) => {
		//UPDATE THE DATA AND THE PROPERTIES OF THE EDITED FIELD
		let updatedEditorLayout = [ ...editorFields ];
		const findFieldToUpdate = (element) => element.id === fieldToEdit.id;
		const fieldToUpdate = updatedEditorLayout.findIndex(findFieldToUpdate);

		const id = `kb-${newEditedFieldValues.label.toLowerCase().replaceAll(' ', '')}`;
		const contextMenuText = `Copy to ${newEditedFieldValues.label}`;
		const propertyName = `editorData${newEditedFieldValues.label}`;

		updatedEditorLayout[fieldToUpdate] = {
			id: id,
			label: newEditedFieldValues.label,
			multiline: newEditedFieldValues.multiline,
			numberOfLines: newEditedFieldValues.numberOfLines,
			contextMenuText: contextMenuText,
			whereToCopy: propertyName,
			valueName: propertyName,
			isTextField: true,
			[propertyName]: '',
			editMode: false
		};

		//CHANGE THE editorFieldValues Object with the new changes and order.
		let updatedEditorFieldValues = {};

		updatedEditorLayout.forEach((row) => {
			updatedEditorFieldValues[row.valueName] = '';
		});

		setEditorFields(updatedEditorLayout);
		setEditorFieldValues(updatedEditorFieldValues);
		setOpenEditModal(false);
	};

	const handleNewField = () => {
		const { label, multiline, numberOfLines } = newFieldValues;

		const id = `kb-${label.toLowerCase().replaceAll(' ', '')}`;
		const contextMenuText = `Copy to ${label}`;
		const propertyName = `editorData${label}`;

		let updatedEditorLayout = [ ...editorFields ];
		updatedEditorLayout.push({
			id: id,
			label: label,
			multiline: multiline,
			numberOfLines: numberOfLines,
			contextMenuText: contextMenuText,
			whereToCopy: propertyName,
			valueName: propertyName,
			isTextField: true,
			[propertyName]: '',
			editMode: false
		});

		setEditorFields(updatedEditorLayout);
		setNewFieldValues({
			label: '',
			multiline: false,
			numberOfLines: 1
		});

		let updatedEditorFieldValues = { ...editorFieldValues };
		updatedEditorFieldValues[propertyName] = '';
		setEditorFieldValues(updatedEditorFieldValues);
	};

	const handleDeleteField = (item) => {
		const updatedEditorLayout = editorFields.filter((field) => field.id !== item.id);
		setEditorFields(updatedEditorLayout);
		setOpenDeleteModal(false);
	};

	const handleChangeNewFieldValues = (prop) => (event) => {
		if (event.target.checked) {
			setNewFieldValues({ ...newFieldValues, [prop]: event.target.checked });
		} else {
			setNewFieldValues({ ...newFieldValues, [prop]: event.target.value });
		}
	};

	const handleClickOpenEditModal = (item) => {
		setFieldToEdit(item);
		setOpenEditModal(true);
	};

	const handleCloseEditModal = () => {
		setOpenEditModal(false);
	};

	const handleClickOpenDeleteModal = (item) => {
		setFieldToEdit(item);
		setOpenDeleteModal(true);
	};

	const handleCloseDeleteModal = () => {
		setOpenDeleteModal(false);
	};

	const handleSaveChanges = () => {
		actions.saveLayoutConfig(editorFields, editorFieldValues);
		history.push('/editor');
	};

	return (
		<Page title="KB Creator - Article Layout">
			<React.Fragment>
				<CssBaseline />
				<Container fixed>
					<div className={classes.containerDiv}>
						<Grid
							container
							direction="row"
							justifyContent="center"
							alignItems="stretch"
							className={classes.gridHeight}
						>
							<Grid item xs={4} className={classes.fieldsGridContainer}>
								<DragDropContext onDragEnd={onDragEnd}>
									<Droppable droppableId="droppable">
										{(provided, snapshot) => (
											<div
												{...provided.droppableProps}
												ref={provided.innerRef}
												style={getListStyle(snapshot.isDraggingOver)}
											>
												{editorFields.map((item, index) => (
													<Draggable key={item.id} draggableId={item.id} index={index}>
														{(provided, snapshot) => (
															<Card
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																style={getItemStyle(
																	snapshot.isDragging,
																	provided.draggableProps.style
																)}
																variant="outlined"
															>
																<CardContent className={classes.cardContent}>
																	<Typography
																		className={classes.cardTitle}
																		color="textSecondary"
																	>
																		Label: {item.label}
																	</Typography>
																	<Typography color="textSecondary">
																		{`Multiline: `}
																		{item.multiline ? 'Yes' : 'No'}
																	</Typography>
																	{item.multiline && (
																		<Typography color="textSecondary">
																			{`Rows: ${item.numberOfLines}`}
																		</Typography>
																	)}
																</CardContent>
																<CardActions>
																	<Button
																		variant="contained"
																		startIcon={<DeleteIcon />}
																		size="small"
																		onClick={() => handleClickOpenDeleteModal(item)}
																	>
																		Delete
																	</Button>
																	<Button
																		variant="contained"
																		startIcon={<EditIcon />}
																		size="small"
																		onClick={() => handleClickOpenEditModal(item)}
																	>
																		Edit
																	</Button>
																</CardActions>
															</Card>
														)}
													</Draggable>
												))}
												{provided.placeholder}
											</div>
										)}
									</Droppable>
								</DragDropContext>
							</Grid>
							<Grid item xs={8} className={classes.newFieldPadding}>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<Typography variant="h6">Add new field</Typography>
										<Divider />
									</Grid>
									<Grid item xs={12}>
										<TextField
											label="Label"
											variant="outlined"
											size="small"
											value={newFieldValues.label}
											fullWidth
											onChange={handleChangeNewFieldValues('label')}
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
									<Grid item xs={12} className={classes.gridItem}>
										<Button
											variant="contained"
											color="primary"
											className={classes.actionButton}
											startIcon={<AddIcon />}
											size="small"
											disabled={newFieldValues.label.length === 0}
											onClick={() => handleNewField()}
										>
											Add
										</Button>
									</Grid>
									<Grid item xs={12} className={classes.gridItem}>
										<Button
											variant="contained"
											color="primary"
											className={classes.actionButton}
											startIcon={<SaveIcon />}
											fullWidth
											onClick={() => handleSaveChanges()}
										>
											Save Changes
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</div>
				</Container>
			</React.Fragment>
			{openEditModal && (
				<KBFieldEditModal
					openEditModal={openEditModal}
					handleCloseEditModal={handleCloseEditModal}
					handleSaveEditField={handleSaveEditField}
					fieldToEdit={fieldToEdit}
				/>
			)}
			{openDeleteModal && (
				<KBFieldDeleteModal
					openDeleteModal={openDeleteModal}
					handleCloseDeleteModal={handleCloseDeleteModal}
					handleDeleteField={handleDeleteField}
					fieldToEdit={fieldToEdit}
				/>
			)}
		</Page>
	);
};

const mapStateToProps = (state) => ({
	storeEditorFields: state.editor.editorFields,
	editorData: state.editor.editorData
});

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(
			{
				copyTextToEditor,
				saveLayoutConfig
			},
			dispatch
		)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(KBArticleLayout);
