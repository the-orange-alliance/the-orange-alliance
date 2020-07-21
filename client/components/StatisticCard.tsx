import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

interface IProps {
  title: string;
  subtitle: string;
  icon: React.ReactElement;
}

class StatisticCard extends React.Component<IProps> {
  public constructor(props: IProps) {
    super(props);
  }

  public render() {
    const { title, subtitle, icon } = this.props;
    return (
      <Card>
        <CardHeader
          avatar={<Avatar className="primary-bg secondary">{icon}</Avatar>}
          title={title}
          subheader={subtitle}
        />
      </Card>
    );
  }
}

export default StatisticCard;
