import React from "react";
import { styled } from "@mui/material/styles";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";
import LocalFloristRoundedIcon from "@mui/icons-material/LocalFloristRounded";
import { fontSize } from "@mui/system";

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

const CustomListItem = styled(ListItem)(() => ({
  padding: 0,
}));

const Agent = (props) => {
  const { agentData } = props;

  return (
    <HtmlTooltip
      title={
        <React.Fragment>
          <div style={{ width: "100%", textAlign: "center" }}>
            <Typography color="inherit">Agent</Typography>
          </div>
          <Divider />
          <List dense>
            <CustomListItem>
              <ListItemAvatar>
                <Avatar>
                  <DirectionsRunRoundedIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Reaction Speed"
                secondary={agentData.reaction_speed}
                secondaryTypographyProps={{ fontSize: 12 }}
              />
            </CustomListItem>
            <CustomListItem>
              <ListItemAvatar>
                <Avatar>
                  <LocalFloristRoundedIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Life Expectancy"
                secondary={agentData.life_expectancy}
                secondaryTypographyProps={{ fontSize: 12 }}
              />
            </CustomListItem>
          </List>
        </React.Fragment>
      }
    >
      <div
        style={{
          margin: "0px auto",
          height: "90%",
          width: "90%",
          backgroundColor: `rgb(67,125,${
            agentData.reaction_speed * 255
          })`.toString(),
          borderRadius: "50%",
        }}
      />
    </HtmlTooltip>
  );
};

export default Agent;
