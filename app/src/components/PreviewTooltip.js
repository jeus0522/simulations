import * as React from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { IconButton, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip placement="right" {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "grey",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    maxHeight: "768px",
    maxWidth: "1366px",
    minHeight: "768px",
    minWidth: "1366px",
    overflow: "auto",
  },
}));

export default function PreviewTooltip(props) {
  return (
    <div>
      <HtmlTooltip
        placement="right-end"
        title={<div style={{}}>{props.children}</div>}
      >
        <IconButton aria-label="preview" color="success">
          <VisibilityIcon />
        </IconButton>
      </HtmlTooltip>
    </div>
  );
}
