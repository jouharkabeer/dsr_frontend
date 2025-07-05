import React from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import {
  GridToolbarQuickFilter,
  useGridApiContext,
} from '@mui/x-data-grid';

function CustomToolbar() {
  const apiRef = useGridApiContext();

  return (
    <Box
      sx={{
        p: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Typography variant="subtitle2">🔍 Search</Typography>
        <GridToolbarQuickFilter debounceMs={500} />
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button onClick={() => apiRef.current.showColumnMenu(apiRef.current.getVisibleColumns()[0].field)}>
          📊 Columns
        </Button>
        <Button onClick={() => apiRef.current.exportDataAsCsv()}>
          📥 Export
        </Button>
        {/* Add other buttons or filters as needed */}
      </Box>
    </Box>
  );
}
