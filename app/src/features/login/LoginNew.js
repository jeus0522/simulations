import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Button, Container, TextField, Typography, makeStyles } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loginUser, getDs } from '../../actions/authActions';
import { red } from '@material-ui/core/colors';

import Page from '../../app/Page';

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		height: '100%',
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3)
	},
	errorMessage: {
		textAlign: 'center',
		color: red[500]
	}
}));

const Login = (props) => {
	const classes = useStyles();
	const [ redirect, setRedirect ] = useState(null);

	const { loggedIn, statusText, actions, history } = props;

	useEffect(
		() => {
			if (loggedIn) {
				setRedirect('/caseDetails');
			}
		},
		[ loggedIn ]
	);

	const handleLogin = async (email, password) => {
		await actions.loginUser(email, password, history);
		await actions.getDs();
		// if (loggedIn) {
		// 	setRedirect('/caseDetails');
		// }
	};

	if (redirect) {
		history.push(redirect);
	}
	return (
		<Page className={classes.root} title="KB Creator - Login">
			<Box display="flex" flexDirection="column" height="100%" justifyContent="center">
				<Container maxWidth="sm">
					<Formik
						initialValues={{
							email: 'francisco@quark.ai',
							password: 'rotring2433'
						}}
						validationSchema={Yup.object().shape({
							email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
							password: Yup.string().max(255).required('Password is required')
						})}
						onSubmit={(values) => handleLogin(values.email, values.password)}
					>
						{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
							<form onSubmit={handleSubmit}>
								<Box mb={3}>
									<Typography color="textPrimary" variant="h2">
										Sign in
									</Typography>
									<Typography color="textSecondary" gutterBottom variant="body2">
										Sign in on the internal platform
									</Typography>
								</Box>
								<TextField
									error={Boolean(touched.email && errors.email)}
									fullWidth
									helperText={touched.email && errors.email}
									label="Email Address"
									margin="normal"
									name="email"
									onBlur={handleBlur}
									onChange={handleChange}
									type="email"
									value={values.email}
									variant="outlined"
								/>
								<TextField
									error={Boolean(touched.password && errors.password)}
									fullWidth
									helperText={touched.password && errors.password}
									label="Password"
									margin="normal"
									name="password"
									onBlur={handleBlur}
									onChange={handleChange}
									type="password"
									value={values.password}
									variant="outlined"
								/>
								{statusText && (
									<Box mb={3}>
										<Typography
											color="textSecondary"
											gutterBottom
											variant="h6"
											className={classes.errorMessage}
										>
											{statusText}
										</Typography>
									</Box>
								)}
								<Box my={2}>
									<Button
										color="primary"
										disabled={isSubmitting}
										fullWidth
										size="large"
										type="submit"
										variant="contained"
									>
										Sign in now
									</Button>
								</Box>
							</form>
						)}
					</Formik>
				</Container>
			</Box>
		</Page>
	);
};

const mapStateToProps = (state) => ({
	loggedIn: state.auth.loggedIn,
	statusText: state.auth.statusText
});

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(
			{
				loginUser,
				getDs
			},
			dispatch
		)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
