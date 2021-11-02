import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

interface IProps {
  content: React.ReactElement;
}

class AnnouncementCard extends React.Component<IProps> {
  public constructor(props: IProps) {
    super(props);
  }

  public render() {
    const { content } = this.props;
    return (
      <Card className='red-bg'>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }
}

export default AnnouncementCard;
