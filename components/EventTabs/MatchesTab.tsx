import * as React from 'react';
import { Event } from '@the-orange-alliance/api/lib/cjs/models';
import MatchTable from '../MatchTable/MatchTable';

interface IProps {
  event: Event;
}

const MatchesTab = (props: IProps) => {
  return (
    <>
      <MatchTable event={props.event} />
    </>
  );
};

export default MatchesTab;
