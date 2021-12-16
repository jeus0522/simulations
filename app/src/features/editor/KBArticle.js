import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import useDeepCompareEffect from 'use-deep-compare-effect';
import 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography } from '@material-ui/core';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { clearEditor } from '../../actions/editorActions';
import { clearCaseDetails } from '../../actions/caseDetailsActions';

import { Accordion, AccordionSummary, AccordionDetails } from '../../app/CustomAccordion';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStylesKBArticle = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		height: '100%'
	},
	gridHeight: {
		height: '100%'
	},
	gridTextMargin: {
		marginTop: theme.spacing(2)
	},
	gridMarginBottom: {
		marginBottom: theme.spacing(2)
	},
	gridMarginBottomBasicInfo: {
		marginBottom: theme.spacing(1)
	},
	gridEditorContainerExpanded: {
		height: '40%'
	},
	gridEditorContainerCollapsed: {
		height: '85%'
	},
	editorTextfields: {
		width: '100%',
		'& > *': {
			margin: 5,
			marginLeft: 0
		}
	},
	paddingGridButtonContainer: {
		padding: theme.spacing(1)
	},
	textEditorContainer: {
		border: 'solid 1px',
		borderRadius: 4,
		borderColor: theme.palette.divider
	}
}));

const KBArticle = (props) => {
	const classes = useStylesKBArticle();
	const { editorData, editorFields, selectedCases, history, actions } = props;
	const [ expandedValues, setExpandedValues ] = useState({
		editorBasicInfo: true,
		editorDocument: true
	});

	const [ values, setValues ] = useState({ ...editorData });
	const [ fields, setFields ] = useState([]);
	useDeepCompareEffect(
		() => {
			const editorDataValues = Object.values(editorData);
			const editorDataKeys = Object.keys(editorData);

			const checkNewValues = (element) => element.length > 0;

			const propertyPosition = editorDataValues.findIndex(checkNewValues);
			if (propertyPosition !== -1) {
				const keyToUpdate = editorDataKeys[propertyPosition];
				const valueToUpdate = editorDataValues[propertyPosition];

				let updatedEditorData = [ ...fields ];
				const findFieldToUpdate = (element) => element.whereToCopy === keyToUpdate;
				const fieldToUpdate = updatedEditorData.findIndex(findFieldToUpdate);
				updatedEditorData[fieldToUpdate][keyToUpdate] += valueToUpdate;
				setValues(updatedEditorData);
			}
		},
		[ editorData ]
	);

	useDeepCompareEffect(
		() => {
			setFields(editorFields);
		},
		[ editorFields ]
	);

	const handleChangeSearchKeywords = (prop) => (event) => {
		let updatedEditorData = [ ...values ];
		const findFieldToUpdate = (element) => element.whereToCopy === prop;
		const fieldToUpdate = updatedEditorData.findIndex(findFieldToUpdate);
		updatedEditorData[fieldToUpdate][prop] = event.target.value;

		setValues(updatedEditorData);
	};

	const handleChangeEditorData = (data) => {
		let updatedEditorData = [ ...values ];
		const findFieldToUpdate = (element) => element.whereToCopy === 'editorDataContent';
		const fieldToUpdate = updatedEditorData.findIndex(findFieldToUpdate);
		updatedEditorData[fieldToUpdate]['editorDataContent'] = data;

		setValues(updatedEditorData);
	};

	const handleChangeAccordion = (prop) => {
		const expandedState = !expandedValues[prop];
		setExpandedValues({ ...expandedValues, [prop]: expandedState });
	};

	const handleSaveArticle = () => {
		actions.clearCaseDetails();
		actions.clearEditor();
		history.push('/caseDetails');
	};

	return (
		<div className={classes.root}>
			<Grid container direction="row" justify="flex-start" alignItems="flex-start" className={classes.gridHeight}>
				<Grid item xs={12} className={classes.paddingGridButtonContainer}>
					<Button
						size="large"
						variant="contained"
						color="primary"
						onClick={() => handleSaveArticle()}
						fullWidth
						disabled={selectedCases.length === 0}
					>
						Save Article
					</Button>
				</Grid>
				<Grid item xs={12}>
					<Accordion
						square
						expanded={expandedValues.editorBasicInfo}
						onChange={() => handleChangeAccordion('editorBasicInfo')}
					>
						<AccordionSummary
							aria-controls="panel1d-content"
							id="panel1d-header"
							expandIcon={<ExpandMoreIcon />}
						>
							<Typography>KB Article</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<form className={classes.editorTextfields} noValidate autoComplete="off">
								{fields.map((field, index, array) => {
									return (
										<div key={field.id}>
											<Typography variant="h6">{field.label}</Typography>
											<div className={classes.textEditorContainer}>
												<CKEditor
													editor={ClassicEditor}
													data={array[index][field.whereToCopy]}
													toolbar={[
														'paragraph',
														'heading1',
														'heading2',
														'bulletedList',
														'numberedList'
													]}
													onReady={(editor) => {
														editor.editing.view.change((writer) => {
															writer.setStyle(
																'height',
																`${40 * field.numberOfLines}px`,
																editor.editing.view.document.getRoot()
															);
														});
													}}
													onChange={(event, editor) => {
														const data = editor.getData();
														//handleChangeEditorData(data);
														handleChangeSearchKeywords(data);
													}}
													onBlur={(event, editor) => {
														//console.log('Blur.', editor);
													}}
													onFocus={(event, editor) => {
														//console.log('Focus.', editor);
													}}
												/>
											</div>
										</div>
									);
								})}
							</form>
						</AccordionDetails>
					</Accordion>
				</Grid>

				<Grid item xs={12} className={classes.paddingGridButtonContainer}>
					<Button
						size="large"
						variant="contained"
						color="primary"
						onClick={() => handleSaveArticle()}
						fullWidth
						disabled={selectedCases.length === 0}
					>
						Save Article
					</Button>
				</Grid>
			</Grid>
		</div>
	);
};

const mapStateToProps = (state) => ({
	selectedCases: state.caseDetails.selectedCases,
	editorData: state.editor.editorData,
	editorFields: state.editor.editorFields
});

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(
			{
				clearCaseDetails,
				clearEditor
			},
			dispatch
		)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(KBArticle);
