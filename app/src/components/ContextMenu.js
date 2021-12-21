import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Menu, MenuItem } from '@material-ui/core';

import { copyTextToEditor } from '../actions/editorActions';
import { copyTextToSearch } from '../actions/caseDetailsActions';

const useStyles = makeStyles((theme) => ({
	root: {
		cursor: 'context-menu'
	}
}));

const initialState = {
	mouseX: null,
	mouseY: null
};

function ContextMenu(props) {
	const { actions, children, usedOn, editorFields } = props;
	const [ state, setState ] = React.useState(initialState);
	const classes = useStyles();

	const handleClick = (event) => {
		event.preventDefault();
		setState({
			mouseX: event.clientX - 2,
			mouseY: event.clientY - 4
		});
	};

	const handleClose = () => {
		setState(initialState);
	};

	const handleCopy = (whereToCopy) => {
		const selectedText = window.getSelection().toString();
		if (selectedText.length !== 0) {
			if (whereToCopy === 'copy' || whereToCopy === 'search') {
				switch (whereToCopy) {
					case 'search':
						actions.copyTextToSearch(selectedText);
						break;
					case 'copy':
						document.execCommand('copy');
						break;
					default:
						break;
				}
			} else {
				actions.copyTextToEditor(selectedText, whereToCopy);
			}
		}

		handleClose();
	};

	return (
		<div onContextMenu={handleClick} className={classes.root}>
			{children}
			<Menu
				keepMounted
				open={state.mouseY !== null}
				onClose={handleClose}
				anchorReference="anchorPosition"
				anchorPosition={
					state.mouseY !== null && state.mouseX !== null ? (
						{ top: state.mouseY, left: state.mouseX }
					) : (
						undefined
					)
				}
			>
				{usedOn === 'editor' && (
					<div>
						{editorFields.map((field) => (
							<MenuItem onClick={() => handleCopy(field.whereToCopy)}>{field.contextMenuText}</MenuItem>
						))}
					</div>
				)}
				{usedOn === 'caseDetails' && (
					<div>
						<MenuItem onClick={() => handleCopy('search')}>Copy to Search</MenuItem>
					</div>
				)}
				<MenuItem onClick={() => handleCopy('copy')}>Copy</MenuItem>
			</Menu>
		</div>
	);
}

const mapStateToProps = (state) => ({
	editorFields: state.editor.editorFields,
	editorContent: state.editor.editorContent
});

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(
			{
				copyTextToEditor,
				copyTextToSearch
			},
			dispatch
		)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);
