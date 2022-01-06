import React from "react";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip
    disableFocusListener
    arrow
    placement="right"
    {...props}
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#f5f5f9",
  },
}));

const Food = () => {
  return (
    <HtmlTooltip
      title={
        <React.Fragment>
          <Typography color="inherit">Food</Typography>
        </React.Fragment>
      }
    >
      <div
        style={{
          margin: "0px auto",
          height: "60%",
          width: "60%",
          backgroundColor: "crimson",
          borderRadius: "50%",
          marginTop: "20%",
        }}
      />
    </HtmlTooltip>
  );
};

export default Food;
