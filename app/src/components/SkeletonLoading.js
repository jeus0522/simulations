import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';

export default function SkeletonLoading() {
	return (
		<Grid container>
			<Grid item xs>
				<Skeleton
					variant="rect"
					height={44}
					width="100%"
					style={{ marginBottom: 1, borderRadius: '4px 4px 0 0' }}
				/>
				<Skeleton
					variant="rect"
					height={123}
					width="100%"
					style={{ marginBottom: 8, borderRadius: '0 0 4px 4px' }}
				/>
			</Grid>
		</Grid>
	);
}
