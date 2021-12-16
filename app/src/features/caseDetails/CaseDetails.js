import React, { useState, useCallback, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import {
	Drawer,
	CssBaseline,
	Toolbar,
	Typography,
	Divider,
	List,
	ListItem,
	CircularProgress,
	Button,
	Grid,
	FormControl,
	InputLabel,
	OutlinedInput,
	InputAdornment
} from '@material-ui/core';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getAnswersByCaseId, getSimilarTickets } from '../../actions/caseDetailsActions';
import { getDs } from '../../actions/authActions';
import { basicConfig } from '../../utils/config';

import Page from '../../app/Page';
import CaseDetailsTabs from './CaseDetailsTabs';
import CaseDetailsForm from './CaseDetailsForm';
import SelectedCases from './SelectedCases';
import { Accordion, AccordionSummary, AccordionDetails } from '../../app/CustomAccordion';
import DrawerFooter from '../../app/DrawerFooter';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import CreateIcon from '@material-ui/icons/Create';

const drawerWidth = '30%';

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
		paddingBottom: 30,
		overflowY: 'clip',
		height: 'calc(100% - 115px)'
	},
	content: {
		flexGrow: 1,
		padding: 0
	},
	rootSearchButton: {
		alignItems: 'center'
	},
	wrapper: {
		position: 'relative'
	},
	buttonProgress: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12
	},
	searchButton: {
		backgroundColor: '#f2711c',
		'&:hover': {
			backgroundColor: '#f2711c'
		}
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
	displayAccordionDetails: {
		display: 'block'
	},
	addMoreCasesContainer: {
		width: '100%',
		height: 60,
		position: 'absolute',
		bottom: 30,
		padding: 1,
		display: 'flex',
		backgroundColor: theme.palette.background.paper,
		zIndex: 99
	},
	createKbButton: {
		margin: theme.spacing(1),
		width: '90%',
		marginLeft: '5%'
	}
}));

const CaseDetails = (props) => {
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();
	const {
		caseID,
		dateCreated,
		dateResolved,
		caseSubject,
		caseDescription,
		loadingCaseDetails,
		originalCase,
		ds,
		actions,
		selectedCases,
		copiedSearchText,
		history
	} = props;
	const [ values, setValues ] = useState({
		caseid: ''
	});

	const [ expandedValues, setExpandedValues ] = useState({
		caseDetails: true,
		selectedCases: true
	});
	const [ redirect, setRedirect ] = useState(null);

	const getDsDispatch = useCallback(async () => {
		await actions.getDs();
	}, []);

	useEffect(
		() => {
			getDsDispatch();
		},
		[ getDsDispatch ]
	);

	useEffect(
		() => {
			if (caseID) {
				const firstCommentPosition = caseDescription.indexOf('# Comment');
				const ticketDescription = caseDescription.substring(0, firstCommentPosition).trim();
				actions.getSimilarTickets(
					caseSubject,
					ticketDescription,
					ds,
					`quark_test`,
					`ticket ${caseID}`,
					basicConfig.automatedDupThreshold,
					basicConfig.automatedsolrNbest
				);
			}
		},
		[ caseID ]
	);

	const handleChangeSearch = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const handleSearch = () => {
		actions.getAnswersByCaseId(
			'ask:163bd34cabf24775b4661bc697164e81',
			ds,
			values.caseid,
			'ntnx_sandbox',
			'internal',
			{ forum: 'score, id' }
		);
	};

	const handleKeyPress = (e) => {
		if (e.keyCode === 13) {
			handleSearch();
		}
	};

	const handleChangeAccordion = (prop) => {
		const expandedState = !expandedValues[prop];
		setExpandedValues({ ...expandedValues, [prop]: expandedState });
	};

	const handleCreateKbClick = (e, variant) => {
		e.stopPropagation();
		if (selectedCases.length === 0 && !caseID) {
			enqueueSnackbar('Please select at least one similar case or enter a Case ID.', { variant });
		} else {
			setRedirect('/editor');
		}
	};

	if (redirect) {
		history.push(redirect);
	}
	return (
		<Page title="KB Creator - Case Details">
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
						<List>
							<ListItem>
								<Grid
									container
									direction="row"
									justify="flex-start"
									alignItems="center"
									spacing={1}
									className={classes.gridHeight}
								>
									<Grid item xs={9}>
										<div className={classes.rootSearch}>
											<FormControl fullWidth className={classes.margin} variant="outlined">
												<InputLabel htmlFor="outlined-adornment-search-case-id">
													Search
												</InputLabel>
												<OutlinedInput
													id="outlined-adornment-search-case-id"
													value={values.caseid}
													onChange={handleChangeSearch('caseid')}
													placeholder="Enter Case ID"
													startAdornment={
														<InputAdornment position="start">
															<SearchIcon />
														</InputAdornment>
													}
													labelWidth={50}
													margin="dense"
													fullWidth
													onKeyDown={(e) => handleKeyPress(e)}
												/>
											</FormControl>
										</div>
									</Grid>
									<Grid item xs={3}>
										<div className={classes.rootSearchButton}>
											<div className={classes.wrapper}>
												<Button
													variant="contained"
													color="primary"
													disabled={loadingCaseDetails}
													fullWidth
													onClick={() => handleSearch()}
													className={classes.searchButton}
												>
													Search
												</Button>
												{loadingCaseDetails && (
													<CircularProgress size={24} className={classes.buttonProgress} />
												)}
											</div>
										</div>
									</Grid>
								</Grid>
							</ListItem>
						</List>
						<Divider />
						<SplitPane split="horizontal">
							<Pane>
								<div style={{ height: '100%', overflowY: 'scroll' }}>
									<List className={classes.listPadding}>
										<ListItem disableGutters className={classes.listItemPadding}>
											<Accordion
												square
												expanded={expandedValues.caseDetails}
												onChange={() => handleChangeAccordion('caseDetails')}
												className={classes.accordion}
											>
												<AccordionSummary
													aria-controls="panel1d-content"
													id="panel1d-header"
													expandIcon={<ExpandMoreIcon />}
												>
													<Typography>Case Details</Typography>
												</AccordionSummary>
												<AccordionDetails className={classes.displayAccordionDetails}>
													<CaseDetailsForm
														setRedirect={setRedirect}
														caseID={caseID}
														dateCreated={dateCreated}
														dateResolved={dateResolved}
														caseSubject={caseSubject}
														caseDescription={caseDescription}
														loadingCaseDetails={loadingCaseDetails}
														selectedCases={selectedCases}
														originalCase={originalCase}
													/>
												</AccordionDetails>
											</Accordion>
										</ListItem>
									</List>
								</div>
							</Pane>
							<Pane initialSize="535px" maxSize="535px" minSize="116px">
								<List className={classes.listPadding}>
									<ListItem disableGutters className={classes.listItemPadding}>
										<Accordion
											square
											expanded={expandedValues.selectedCases}
											className={classes.accordion}
										>
											<AccordionSummary
												aria-controls="panel1d-content"
												id="panel1d-header"
												style={{ cursor: 'unset' }}
											>
												<Typography>Selected Cases</Typography>
											</AccordionSummary>
											<AccordionDetails>
												<SelectedCases />
											</AccordionDetails>
										</Accordion>
									</ListItem>
								</List>
							</Pane>
						</SplitPane>
					</div>
					<div className={classes.addMoreCasesContainer}>
						<Button
							variant="contained"
							color="primary"
							size="medium"
							startIcon={<CreateIcon />}
							onClick={(e) => handleCreateKbClick(e, 'info')}
							className={classes.createKbButton}
						>
							CREATE KB
						</Button>
					</div>
					<DrawerFooter />
				</Drawer>
				<main className={classes.content}>
					<Toolbar />
					<CaseDetailsTabs copiedSearchText={copiedSearchText} />
				</main>
			</div>
		</Page>
	);
};

const mapStateToProps = (state) => ({
	caseID: state.caseDetails.caseID,
	caseSubject: state.caseDetails.caseSubject,
	caseDescription: state.caseDetails.caseDescription,
	dateCreated: state.caseDetails.dateCreated,
	loadingCaseDetails: state.caseDetails.loadingCaseDetails,
	selectedCases: state.caseDetails.selectedCases,
	copiedSearchText: state.caseDetails.copiedSearchText,
	originalCase: state.caseDetails.originalCase,
	ds: state.auth.ds
});

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(
			{
				getAnswersByCaseId,
				getSimilarTickets,
				getDs
			},
			dispatch
		)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CaseDetails);
