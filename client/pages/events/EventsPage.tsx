import * as React from 'react';
import Event from '@the-orange-alliance/api/lib/models/Event';
import {
  IApplicationState,
  IEventsProps,
  getEventsData,
  ISetEvents,
  ApplicationActions,
  setEvents
} from 'shared';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

interface IProps {
  events: Event[];
  setEvents: (events: Event[]) => ISetEvents;
}

class EventsPage extends React.Component<IProps> {
  public constructor(props: IProps) {
    super(props);
  }

  public componentDidMount(): void {
    const { events, setEvents } = this.props;

    getEventsData({ events }).then((props: IEventsProps) => {
      setEvents(props.events);
    });
  }

  public render() {
    return <div>Hello World!</div>;
  }
}

function mapStateToProps(state: IApplicationState) {
  return {
    events: state.events
  };
}

function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setEvents: (events: Event[]) => dispatch(setEvents(events))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsPage);
