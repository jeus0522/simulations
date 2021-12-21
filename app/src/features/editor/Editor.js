import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Drawer, CssBaseline, Toolbar, Typography, List, ListItem } from '@material-ui/core';
import { copyTextToEditor } from '../../actions/editorActions';
import { getComments, getDataQueryByCaseId } from '../../actions/caseDetailsActions';

import Page from '../../app/Page';
import KBArticle from './KBArticle';
import EditorSelectedCases from './EditorSelectedCases';
import { Accordion, AccordionSummary, AccordionDetails } from '../../app/CustomAccordion';
import DrawerFooter from '../../app/DrawerFooter';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const drawerWidth = '35%';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth
	},
	drawerContainer: {
		overflow: 'auto',
		paddingBottom: 100
	},
	content: {
		flexGrow: 1,
		padding: 0
	},
	rootSearch: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	listPadding: {
		paddingTop: 0,
		paddingBottom: 0
	},
	listItemPadding: {
		paddingTop: 0,
		paddingBottom: 0
	},
	accordion: {
		overflow: 'hidden'
	},
	toolbar: {
		minHeight: 48
	},
	accoridionTitleDivContainer: {
		width: '100%',
		textAlign: 'center'
	},
	addMoreCasesContainer: {
		width: '100%',
		height: 60,
		position: 'absolute',
		bottom: 30,
		padding: 1,
		display: 'flex',
		backgroundColor: theme.palette.background.paper
	},
	paddingGridButtonContainer: {
		margin: theme.spacing(1),
		width: '90%',
		marginLeft: '5%'
	}
}));

const Editor = (props) => {
	const classes = useStyles();
	const { selectedCases, originalCase, loadingComments, history, actions, ds } = props;

	const [ expandedValues, setExpandedValues ] = useState({
		editorCaseDetails: true,
		editorSelectedCases: true
	});
	const handleChangeAccordion = (prop) => {
		const expandedState = !expandedValues[prop];
		setExpandedValues({ ...expandedValues, [prop]: expandedState });
	};
	let selectedCasesWithOriginal = [];

	if (originalCase && Object.keys(originalCase).length === 0) {
		selectedCasesWithOriginal = [ ...selectedCases ];
	} else {
		selectedCasesWithOriginal = [ originalCase, ...selectedCases ];
	}

	const handleFetchComments = (caseID, commentsFor) => {
		const findFieldToUpdate = (element) => element.parsedCaseId === caseID;

		if (commentsFor === 'selectedCases') {
			const fieldToUpdate = selectedCasesWithOriginal.findIndex(findFieldToUpdate);
			if (!selectedCasesWithOriginal[fieldToUpdate].comments) {
				actions.getComments(
					'ask:163bd34cabf24775b4661bc697164e81',
					ds,
					caseID,
					'ntnx_sandbox',
					'internal',
					{
						forum: 'score, id'
					},
					commentsFor
				);
			}
		}
	};

	const handleFetchDataQuery = (caseID) => {
		const findFieldToUpdate = (element) => element.parsedCaseId === caseID;
		const fieldToUpdate = selectedCasesWithOriginal.findIndex(findFieldToUpdate);

		if (!selectedCasesWithOriginal[fieldToUpdate].dataQuery) {
			actions.getDataQueryByCaseId(ds, 465);
		}
	};

	return (
		<Page title="KB Creator - Editor">
			<div className={classes.root}>
				<CssBaseline />
				<Drawer
					className={classes.drawer}
					variant="permanent"
					classes={{
						paper: classes.drawerPaper
					}}
				>
					<Toolbar className={classes.toolbar} />
					<div className={classes.drawerContainer}>
						<List className={classes.listPadding}>
							<ListItem disableGutters className={classes.listItemPadding}>
								<Accordion
									square
									expanded={expandedValues.editorSelectedCases}
									onChange={() => handleChangeAccordion('editorSelectedCases')}
									className={classes.accordion}
								>
									<AccordionSummary
										aria-controls="panel1d-content"
										id="panel1d-header"
										expandIcon={<ExpandMoreIcon />}
									>
										<div className={classes.accoridionTitleDivContainer}>
											<Typography>Selected Cases</Typography>
										</div>
									</AccordionSummary>
									<AccordionDetails>
										<EditorSelectedCases
											selectedCases={selectedCasesWithOriginal}
											loadingComments={loadingComments}
											handleFetchComments={handleFetchComments}
											handleFetchDataQuery={handleFetchDataQuery}
										/>
									</AccordionDetails>
								</Accordion>
							</ListItem>
						</List>
					</div>
					<div className={classes.addMoreCasesContainer}>
						<Button
							size="small"
							variant="contained"
							color="primary"
							onClick={() => history.push('/caseDetails')}
							className={classes.paddingGridButtonContainer}
							fullWidth
						>
							Add more cases
						</Button>
					</div>
					<DrawerFooter />
				</Drawer>
				<main className={classes.content}>
					<Toolbar />
					<KBArticle history={history} />
				</main>
			</div>
		</Page>
	);
};

const mapStateToProps = (state) => ({
	selectedCases: state.caseDetails.selectedCases,
	caseID: state.caseDetails.caseID,
	caseSubject: state.caseDetails.caseSubject,
	caseDescription: state.caseDetails.caseDescription,
	dateCreated: state.caseDetails.dateCreated,
	dateResolved: state.caseDetails.dateResolved,
	loadingCaseDetails: state.caseDetails.loadingCaseDetails,
	loadingComments: state.caseDetails.loadingComments,
	loadingDataQuery: state.caseDetails.loadingDataQuery,
	originalCase: state.caseDetails.originalCase,
	ds: state.auth.ds
});

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(
			{
				copyTextToEditor,
				getComments,
				getDataQueryByCaseId
			},
			dispatch
		)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
