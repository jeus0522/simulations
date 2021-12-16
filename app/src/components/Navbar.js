import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logoutUser } from '../actions/authActions';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { AppBar, Grid, IconButton, Menu, MenuItem, Toolbar, Typography, Tooltip } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import logo from '../assets/logo.png';

const useStyles = makeStyles((theme) =>
	createStyles({
		root: {
			flexGrow: 1
		},
		appBar: {
			zIndex: theme.zIndex.drawer + 1,
			boxShadow: 'unset'
		},
		title: {
			flexGrow: 1
		},
		toolbar: {
			background: '#000000',
			minHeight: 48
		},
		rootGrid: {
			flexGrow: 1
		},
		centeredGrid: {
			textAlign: 'center'
		},
		rightCenteredGrid: {
			textAlign: 'end'
		},
		clickableImage: {
			cursor: 'pointer'
		}
	})
);

const Navbar = (props) => {
	const classes = useStyles();
	const { loggedIn, userName, handleThemeChange, darkState, actions } = props;
	const history = useHistory();
	const [ anchorEl, setAnchorEl ] = useState(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogOut = () => {
		actions.logoutUser();
		handleClose();
		history.push('/login');
	};

	const handleRedirect = (whereToRedirect) => {
		handleClose();
		history.push(whereToRedirect);
	};

	return (
		<div>
			<div className={classes.root}>
				<AppBar position="fixed" className={classes.appBar}>
					<Toolbar className={classes.toolbar}>
						<div className={classes.root}>
							<Grid container direction="row" justify="space-between" alignItems="center" spacing={3}>
								<Grid item xs={2} sm={3}>
									<img
										src={logo}
										alt="logo"
										height="30"
										onClick={() => history.push('/caseDetails')}
										className={classes.clickableImage}
									/>
								</Grid>
								<Grid item xs={1} sm={2} className={classes.centeredGrid}>
									<Typography variant="h4" className={classes.title}>
										KB Creator
									</Typography>
								</Grid>
								<Grid item xs={3}>
									{loggedIn && (
										<div>
											<div className={classes.root}>
												<Grid
													container
													direction="row"
													justify="space-between"
													alignItems="center"
												>
													<Grid item xs={3} className={classes.rightCenteredGrid}>
														<Tooltip title="Toggle light/dark theme">
															<IconButton
																aria-label="toggle light/dark theme"
																aria-controls="menu-appbar"
																aria-haspopup="true"
																onClick={handleThemeChange}
																color="inherit"
															>
																{darkState ? <Brightness7Icon /> : <Brightness4Icon />}
															</IconButton>
														</Tooltip>
													</Grid>
													<Grid item xs={6} className={classes.rightCenteredGrid}>
														<Typography variant="subtitle2">{userName}</Typography>
													</Grid>
													<Grid item xs={3}>
														<IconButton
															aria-label="account of current user"
															aria-controls="menu-appbar"
															aria-haspopup="true"
															onClick={handleMenu}
															color="inherit"
														>
															<AccountCircle />
														</IconButton>
													</Grid>
												</Grid>
											</div>

											<Menu
												id="menu-appbar"
												anchorEl={anchorEl}
												anchorOrigin={{
													vertical: 'top',
													horizontal: 'right'
												}}
												keepMounted
												transformOrigin={{
													vertical: 'top',
													horizontal: 'right'
												}}
												open={open}
												onClose={handleClose}
											>
												<MenuItem onClick={handleClose}>Profile</MenuItem>
												<MenuItem onClick={() => handleRedirect('/articleLayout')}>
													Editor Layout Settings
												</MenuItem>
												<MenuItem onClick={handleLogOut}>Log Out</MenuItem>
											</Menu>
										</div>
									)}
								</Grid>
							</Grid>
						</div>
					</Toolbar>
				</AppBar>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	loggedIn: state.auth.loggedIn,
	userName: state.auth.userName
});

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(
			{
				logoutUser
			},
			dispatch
		)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

//export default connect(mapStateToProps)(Navbar);
