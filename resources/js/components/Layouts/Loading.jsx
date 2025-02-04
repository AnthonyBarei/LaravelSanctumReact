import React from 'react';
import { CircularProgress, LinearProgress, Skeleton } from '@mui/material';

const Loading = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <CircularProgress />
      {/* <LinearProgress style={{ width: '100%', marginTop: '20px' }} /> */}
      <Skeleton variant="rectangular" width={210} height={118} style={{ marginTop: '20px' }} />
    </div>
  );
};

export default Loading;
