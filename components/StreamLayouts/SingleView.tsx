import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import LiveStreamPanel from '../LiveStreamPanel';

const SingleView = ({ streams }: { streams: EventLiveStream[] }) => {
  return <LiveStreamPanel streams={streams} />;
};

export default SingleView;
