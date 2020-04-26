import * as React from 'react';

class App extends React.Component {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    console.log('here');
    return (
      <span>RENDER ON THE SERVER PLEASE</span>
    );
  }
}

export default App;