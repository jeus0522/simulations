import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
	FormControl,
	Grid,
	InputLabel,
	OutlinedInput,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	Typography,
	Paper,
	Link,
	InputAdornment,
	Select,
	MenuItem,
	Divider
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';

function createData(caseid, dateCreated, dateResolved, subject, attachedKB, problemArea) {
	return { caseid, dateCreated, dateResolved, subject, attachedKB, problemArea };
}

const rows = [
	createData('Case 010101', '04/03/2021', '04/03/2021', 'Example Subject 1', 'YES', 'Area 1'),
	createData('Case 010102', '04/03/2021', '04/03/2021', 'Example Subject 2', 'NO', 'Area 4'),
	createData('Case 010103', '04/03/2021', '04/03/2021', 'Example Subject 3', 'YES', 'Area 5'),
	createData('Case 010104', '04/03/2021', '04/03/2021', 'Example Subject 4', 'YES', 'Area 1'),
	createData('Case 010105', '04/03/2021', '04/03/2021', 'Example Subject 5', 'NO', 'Area 6'),
	createData('Case 010106', '04/03/2021', '04/03/2021', 'Example Subject 6', 'YES', 'Area 1'),
	createData('Case 010107', '04/03/2021', '04/03/2021', 'Example Subject 7', 'YES', 'Area 8'),
	createData('Case 010108', '04/03/2021', '04/03/2021', 'Example Subject 8', 'YES', 'Area 1'),
	createData('Case 010109', '04/03/2021', '04/03/2021', 'Example Subject 9', 'NO', 'Area 1'),
	createData('Case 010110', '04/03/2021', '04/03/2021', 'Example Subject 10', 'YES', 'Area 4'),
	createData('Case 010111', '04/03/2021', '04/03/2021', 'Example Subject 11', 'YES', 'Area 1'),
	createData('Case 010112', '04/03/2021', '04/03/2021', 'Example Subject 12', 'NO', 'Area 2'),
	createData('Case 010113', '04/03/2021', '04/03/2021', 'Example Subject 13', 'YES', 'Area 1'),
	createData('Case 010114', '04/03/2021', '04/03/2021', 'Example Subject 14', 'NO', 'Area 4'),
	createData('Case 010115', '04/03/2021', '04/03/2021', 'Example Subject 15', 'YES', 'Area 1')
];

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [ el, index ]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

const headCells = [
	{ id: 'caseid', numeric: false, disablePadding: false, label: 'Case ID' },
	{ id: 'dateCreated', numeric: false, disablePadding: false, label: 'Date Created' },
	{ id: 'dateResolved', numeric: false, disablePadding: false, label: 'Date Resolved' },
	{ id: 'subject', numeric: false, disablePadding: false, label: 'Subject' },
	{ id: 'attachedKB', numeric: false, disablePadding: false, label: 'Attached KB' },
	{ id: 'problemArea', numeric: false, disablePadding: false, label: 'Problem Area' }
];

function EnhancedTableHead(props) {
	const { classes, order, orderBy, onRequestSort } = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox" />
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'default'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<span className={classes.visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</span>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	classes: PropTypes.object.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf([ 'asc', 'desc' ]).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles((theme) => ({
	rootFilterContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		'& > *': {
			margin: theme.spacing(1),
			width: '100%',
			height: theme.spacing(7)
		}
	},
	rootGridSearch: {
		flexGrow: 1
	},
	margin: {
		margin: theme.spacing(1)
	},
	formControl: {
		minWidth: 120,
		width: '90%',
		textAlign: 'initial'
	},
	rootDivider: {
		width: '100%',
		backgroundColor: theme.palette.background.paper,
		height: theme.spacing(0),
		margin: 0
	},
	rootSearch: {
		display: 'flex',
		flexWrap: 'wrap'
	}
}));

const EnhancedTableToolbar = ({ values, kbFilter, handleChangeKbFilter, handleChangeSearch }) => {
	const classes = useToolbarStyles();

	return (
		<div className={classes.rootFilterContainer}>
			<Paper elevation={0}>
				<div className={classes.rootGridSearch}>
					<Grid container direction="row" justify="space-between" alignItems="center">
						<Grid item xs={6} sm={3}>
							<div className={classes.rootSearch}>
								<FormControl fullWidth className={classes.margin} variant="outlined">
									<InputLabel htmlFor="outlined-adornment-search-id-keyword">Search</InputLabel>
									<OutlinedInput
										id="outlined-adornment-search-id-keyword"
										value={values.search}
										onChange={handleChangeSearch('search')}
										placeholder="Search by Case ID or Keyword"
										startAdornment={
											<InputAdornment position="start">
												<SearchIcon />
											</InputAdornment>
										}
										labelWidth={50}
										margin="dense"
										fullWidth
									/>
								</FormControl>
							</div>
						</Grid>
						<Grid item xs={4} sm={2}>
							<Grid container direction="row" justify="space-between" alignItems="center">
								<Grid item xs={3}>
									<Typography variant="h6">Show:</Typography>
								</Grid>
								<Grid item xs={9}>
									<FormControl variant="outlined" className={classes.formControl}>
										<InputLabel id="demo-simple-select-filled-label">KB Filter</InputLabel>
										<Select
											labelId="demo-simple-select-filled-label"
											id="demo-simple-select-filled"
											value={kbFilter}
											onChange={handleChangeKbFilter}
											margin="dense"
											labelWidth={60}
										>
											<MenuItem value={10}>All</MenuItem>
											<MenuItem value={20}>With KB</MenuItem>
											<MenuItem value={30}>Without KB</MenuItem>
										</Select>
									</FormControl>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</div>
			</Paper>
			<div className={classes.rootDivider}>
				<Divider />
			</div>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		marginLeft: theme.spacing(4),
		marginRight: theme.spacing(4)
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2)
	},
	table: {
		minWidth: 750
	},
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1
	},
	withoutLabel: {
		marginTop: theme.spacing(3)
	}
}));

export default function EnhancedTable() {
	const classes = useStyles();
	const [ order, setOrder ] = useState('asc');
	const [ orderBy, setOrderBy ] = useState('caseid');
	const [ selected, setSelected ] = useState([]);
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(15);
	const [ kbFilter, setkbFilter ] = React.useState(10);
	const preventDefault = (event) => event.preventDefault();

	const [ values, setValues ] = useState({
		search: ''
	});

	const handleChangeSearch = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = rows.map((n) => n.name);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleChangeKbFilter = (event) => {
		setkbFilter(event.target.value);
	};

	const handleClick = (event, name) => {
		// const selectedIndex = selected.indexOf(name);
		// let newSelected = [];
		// if (selectedIndex === -1) {
		// 	newSelected = newSelected.concat(selected, name);
		// } else if (selectedIndex === 0) {
		// 	newSelected = newSelected.concat(selected.slice(1));
		// } else if (selectedIndex === selected.length - 1) {
		// 	newSelected = newSelected.concat(selected.slice(0, -1));
		// } else if (selectedIndex > 0) {
		// 	newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		// }
		// setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = (name) => selected.indexOf(name) !== -1;

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<EnhancedTableToolbar
					values={values}
					handleChangeSearch={handleChangeSearch}
					handleChangeKbFilter={handleChangeKbFilter}
					kbFilter={kbFilter}
				/>
				<TableContainer>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size="small"
						aria-label="enhanced table"
					>
						<EnhancedTableHead
							classes={classes}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={rows.length}
						/>

						<TableBody>
							{stableSort(rows, getComparator(order, orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => {
									const isItemSelected = isSelected(row.name);
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow
											hover
											onClick={(event) => handleClick(event, row.name)}
											role="checkbox"
											aria-checked={isItemSelected}
											tabIndex={-1}
											key={row.caseid}
											selected={isItemSelected}
										>
											<TableCell padding="checkbox" />
											<TableCell component="th" id={labelId} scope="row">
												<Link href="caseDetails">{row.caseid}</Link>
											</TableCell>
											<TableCell>{row.dateCreated}</TableCell>
											<TableCell>{row.dateResolved}</TableCell>
											<TableCell>{row.subject}</TableCell>
											<TableCell>{row.attachedKB}</TableCell>
											<TableCell>{row.problemArea}</TableCell>
										</TableRow>
									);
								})}
							{emptyRows > 0 && (
								<TableRow style={{ height: 33 * emptyRows }}>
									<TableCell colSpan={7} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[ 15, 50, 100 ]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
	);
}
