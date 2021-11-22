import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

interface IProps {
  title: string;
  subtitle: string;
  icon: React.ReactElement;
}

const StatisticCard = (props: IProps) => {

  const {title, subtitle, icon} = props;

  return (
    <Card>
      <CardHeader
        avatar={<Avatar className='primary-bg secondary'>{icon}</Avatar>}
        title={title}
        subheader={subtitle}
      />
    </Card>
  );
}

export default StatisticCard;
