import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Pagination from '@material-ui/lab/Pagination';
import Typography from '@material-ui/core/Typography';

import SimpleTeamPaper from "../../components/SimpleTeamPaper";

class TeamsPage extends React.Component {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div>
        <Typography variant='h4' gutterBottom>Teams</Typography>
        <Card>
          <CardContent>
            <Grid container>
              <Grid item xs={12} sm={12} md={6}>
                <List>
                  {this.renderList(10)}
                </List>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <List>
                  {this.renderList(10)}
                </List>
              </Grid>
            </Grid>
            <Pagination count={10} color="primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  private renderList(count: number) {
    const items: any[] = [];
    for (let i = 0; i < count; i++) {
      items.push(<SimpleTeamPaper key={count}/>);
    }
    return items;
  }
}

export default TeamsPage;