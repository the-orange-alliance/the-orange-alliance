import * as React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar/Avatar";

const SimpleTeamPaper = function () {
  return (
    <ListItem button>
      <ListItemAvatar>
        <Avatar>FIM</Avatar>
      </ListItemAvatar>
      <ListItemText primary={"Team #33"} secondary={"Killer Bees"} />
    </ListItem>
  );
};

export default SimpleTeamPaper;
