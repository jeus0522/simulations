import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { basicConfig } from '../../utils/config';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
	AppBar,
	Button,
	CircularProgress,
	Grid,
	FormControl,
	InputLabel,
	InputAdornment,
	OutlinedInput,
	Tabs,
	Tab,
	Box
} from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getAnswers, getComments, actionSelectedCase } from '../../actions/caseDetailsActions';
import CaseDetailsCard from './CaseDetailsCard';

import SkeletonLoading from '../../app/SkeletonLoading';

import SearchIcon from '@material-ui/icons/Search';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={2}>
					<div>{children}</div>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired
};

function a11yProps(index) {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`
	};
}

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		height: '100%'
	},
	tabPanelContainer: {
		height: '100%',
		overflowY: 'scroll',
		border: '1px solid',
		borderColor: theme.palette.background.default,
		marginTop: '10px',
		borderRadius: '4px',
		backgroundColor: theme.palette.background.paper,
		padding: 10
	},
	tabPanelHeightWithSearch: {
		height: '70%'
	},
	tabPanelHeightWithoutSearch: {
		height: '70%'
	},
	gridMargin: {
		marginTop: theme.spacing(2),
		paddingLeft: theme.spacing(3),
		paddingRight: theme.spacing(3)
	},
	searchButton: {
		backgroundColor: '#f2711c',
		'&:hover': {
			backgroundColor: '#f2711c'
		}
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
	gridTextMargin: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2)
	},
	navbarPosition: {
		position: 'sticky',
		top: 48
	}
}));

function CaseDetailsTabs(props) {
	const classes = useStyles();
	const theme = useTheme();
	const {
		loadingAnswers,
		loadingSimilarAnswers,
		answers,
		similarAnswers,
		actions,
		ds,
		copiedSearchText,
		loadingComments
	} = props;
	const [ value, setValue ] = useState(0);
	const [ values, setValues ] = useState({
		keywords: ''
	});
	const emptyArray = Array.from(Array(10).keys());

	useEffect(
		() => {
			setValues({ ...values, keywords: copiedSearchText });
		},
		[ copiedSearchText ]
	);

	const handleChangeSearchKeywords = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const handleSearchAnswers = () => {
		actions.getAnswers(
			values.keywords, //question
			'', //convid
			'', //queryid
			basicConfig.tabForSimilarCasesSearch, //tab,
			ds //ds
		);
	};

	const handleAddSelectedCase = (caseObject) => {
		actions.actionSelectedCase(caseObject, 'ADD');
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleKeyPress = (e) => {
		if (e.keyCode === 13) {
			handleSearchAnswers();
		}
	};

	const handleFetchComments = (caseID, commentsFor) => {
		const findFieldToUpdate = (element) => element.parsedCaseId === caseID;

		if (commentsFor === 'answers') {
			const fieldToUpdate = answers.findIndex(findFieldToUpdate);
			if (!answers[fieldToUpdate].comments) {
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

		if (commentsFor === 'similarAnswers') {
			const fieldToUpdate = similarAnswers.findIndex(findFieldToUpdate);
			if (!similarAnswers[fieldToUpdate].comments) {
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

	return (
		<div className={classes.root}>
			<AppBar position="static" color="default" className={classes.navbarPosition}>
				<Tabs
					value={value}
					onChange={handleChange}
					indicatorColor="primary"
					textColor="primary"
					aria-label="full width tabs example"
				>
					<Tab label="Search" {...a11yProps(0)} />
					<Tab label="Automated" {...a11yProps(1)} />
				</Tabs>
			</AppBar>
			{value === 0 && (
				<div>
					<Grid
						container
						direction="row"
						justify="flex-start"
						alignItems="center"
						spacing={1}
						className={classes.gridMargin}
					>
						<Grid item xs={10}>
							<div className={classes.rootSearch}>
								<FormControl fullWidth className={classes.margin} variant="outlined">
									<InputLabel htmlFor="outlined-adornment-search-keywords">Search</InputLabel>
									<OutlinedInput
										id="outlined-adornment-search-keywords"
										value={values.keywords}
										onChange={handleChangeSearchKeywords('keywords')}
										placeholder="Enter Keywords..."
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
						<Grid item xs={2}>
							<div className={classes.rootSearchButton}>
								<div className={classes.wrapper}>
									<Button
										variant="contained"
										color="primary"
										disabled={loadingAnswers}
										fullWidth
										onClick={() => handleSearchAnswers()}
										className={classes.searchButton}
									>
										Search
									</Button>
									{loadingAnswers && (
										<CircularProgress size={24} className={classes.buttonProgress} />
									)}
								</div>
							</div>
						</Grid>
					</Grid>
				</div>
			)}
			<TabPanel value={value} index={0} dir={theme.direction}>
				{answers &&
					answers.map((row) => {
						return (
							<CaseDetailsCard
								key={row.answerid}
								record={row}
								handleAddSelectedCase={handleAddSelectedCase}
								handleFetchComments={handleFetchComments}
								loadingComments={loadingComments}
								commentsFor="answers"
							/>
						);
					})}
				{loadingAnswers &&
					emptyArray.map((index) => {
						return <SkeletonLoading key={index} />;
					})}
			</TabPanel>
			<TabPanel value={value} index={1} dir={theme.direction}>
				{similarAnswers &&
					similarAnswers.map((row) => {
						return (
							<CaseDetailsCard
								key={row.answerid}
								record={row}
								handleAddSelectedCase={handleAddSelectedCase}
								handleFetchComments={handleFetchComments}
								loadingComments={loadingComments}
								commentsFor="similarAnswers"
							/>
						);
					})}
				{loadingSimilarAnswers &&
					emptyArray.map((index) => {
						return <SkeletonLoading key={index} />;
					})}
			</TabPanel>
		</div>
	);
}

const mapStateToProps = (state) => ({
	loadingAnswers: state.caseDetails.loadingAnswers,
	loadingSimilarAnswers: state.caseDetails.loadingSimilarAnswers,
	loadingComments: state.caseDetails.loadingComments,
	answers: state.caseDetails.answers,
	similarAnswers: state.caseDetails.similarAnswers,
	ds: state.auth.ds
});

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(
			{
				getAnswers,
				getComments,
				actionSelectedCase
			},
			dispatch
		)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CaseDetailsTabs);
