import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	IconButton,
	Paper,
	Table,
	TableCell,
	TableBody,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow
} from '@material-ui/core';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionSelectedCase } from '../../actions/caseDetailsActions';

import DeleteIcon from '@material-ui/icons/Delete';

const columns = [
	{ id: 'caseid', label: 'Case ID', minWidth: 90 },
	{ id: 'subject', label: 'Subject', minWidth: 150 }
];

const useStyles = makeStyles({
	root: {
		width: '100%'
	},
	container: {
		minHeight: 350,
		height: 350
	},
	iconButton: {
		padding: 6
	}
});

function CaseDetailsTable(props) {
	const classes = useStyles();
	const { selectedCases, actions } = props;
	const [ page, setPage ] = React.useState(0);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(10);
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const handleRemoveSelectedCase = (caseObject) => {
		actions.actionSelectedCase(caseObject, 'REMOVE');
	};

	return (
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table" size="small">
					<TableHead>
						<TableRow>
							<TableCell style={{ width: 20 }} />
							{columns.map((column) => (
								<TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{selectedCases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
							return (
								<TableRow hover role="checkbox" tabIndex={-1} key={row.answerid}>
									<TableCell>
										<IconButton
											aria-label="delete"
											className={classes.iconButton}
											onClick={() => handleRemoveSelectedCase(row.answer)}
										>
											<DeleteIcon fontSize="small" />
										</IconButton>
									</TableCell>
									<TableCell>{row.parsedCaseId}</TableCell>
									<TableCell>{row.answer}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[ 10, 25, 100 ]}
				component="div"
				count={selectedCases.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}

const mapStateToProps = (state) => ({
	selectedCases: state.caseDetails.selectedCases
});

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(
			{
				actionSelectedCase
			},
			dispatch
		)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CaseDetailsTable);
