import * as React from 'react';

class App extends React.Component {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <span>I'm a server-rendered page!</span>
    );
  }
}

export default App;