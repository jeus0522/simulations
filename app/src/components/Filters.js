import React, { useState } from 'react';
import { Box, Grid, Select, MenuItem, FormControl, InputLabel, Slider, Typography, Stack } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';

import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import StaticDatePicker from '@mui/lab/StaticDatePicker';

export default function Filters() {
	const [ options, setOptions ] = React.useState('');
	const [ valueCreate, setValueCreate ] = useState(new Date() - 50);
	const [ valueClose, setValueClose ] = useState(new Date());

	const valueText = (value) => {
		return `${value}/10/2020`;
	};

	const handleChange = (event) => {
		setOptions(event.target.value);
	};

	return (
		<Box sx={{ flexGrow: 1, maxWidth: 320, height: '90vh', overflow: 'clip' }}>
			<Grid container direction="row" justifyContent="center" alignItems="flex-start" spacing={1}>
				<Grid item xs={12} sx={{ paddingLeft: 5, marginTop: 2 }}>
					<Typography variant="h6">Use Options Below to Filter</Typography>
				</Grid>
				<Grid item xs={12} sx={{ marginTop: 2, marginBottom: 2 }}>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker
							label="From"
							value={valueCreate}
							onChange={(newValue) => {
								setValueCreate(newValue);
							}}
							renderInput={(params) => <TextField fullWidth {...params} />}
						/>
					</LocalizationProvider>
				</Grid>
				<Grid item xs={12} sx={{ marginTop: 2, marginBottom: 2 }}>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker
							label="To"
							value={valueClose}
							onChange={(newValue) => {
								setValueClose(newValue);
							}}
							renderInput={(params) => <TextField fullWidth {...params} />}
						/>
					</LocalizationProvider>
				</Grid>
				<Grid item xs={12}>
					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">Product Line</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							defaultValue={10}
							label="Source Page"
							onChange={handleChange}
							size="small"
						>
							<MenuItem value={10}>All</MenuItem>
							<MenuItem value={20}>Networking</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">Product</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							label="Dataset"
							onChange={handleChange}
							size="small"
							defaultValue={20}
						>
							<MenuItem value={10}>All</MenuItem>
							<MenuItem value={20}>Fast Drive</MenuItem>
							<MenuItem value={30}>Geranius</MenuItem>
							<MenuItem value={40}>Reactor</MenuItem>
							<MenuItem value={50}>vNode</MenuItem>
							<MenuItem value={60}>Optiplex</MenuItem>
						</Select>
					</FormControl>
				</Grid>
			</Grid>
		</Box>
	);
}
