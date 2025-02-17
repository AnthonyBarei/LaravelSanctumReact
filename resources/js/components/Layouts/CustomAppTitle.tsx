import React from "react";
import { Stack, Typography, Chip, Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";


export default function CustomAppTitle() {

    return (

      <Stack direction="row" alignItems="center" spacing={2}>
        <img src="/logo.png" alt="logo" style={{ width: 40 }} />
        <Typography variant="h6">My App</Typography>
        <Chip size="small" label="BETA" color="info" />
        <Tooltip title="Connected to production">
          <CheckCircleIcon color="success" fontSize="small" />
        </Tooltip>
      </Stack>
    );
  }
