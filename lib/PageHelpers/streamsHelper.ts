import {
  Match,
  Event,
  MatchParticipant,
  EventLiveStream
} from '@the-orange-alliance/api/lib/cjs/models';
import TOAProvider from '../../providers/TOAProvider';
import { CURRENT_SEASON } from '../../constants';
import { undefinedToNull } from '../../util/common-utils';

interface IRawStreamsProps {
  streams: any[];
}

interface IStreamsProps {
  streams: EventLiveStream[];
}

const parseStreamsProps = (props: IRawStreamsProps): IStreamsProps => {
  return {
    streams: props.streams.map((s: any) => new EventLiveStream().fromJSON(s))
  };
};

const getStreamsData = async (): Promise<IRawStreamsProps> => {
  const data = await Promise.all([TOAProvider.getAPI().getStreams()]);

  return {
    streams: data[0].map(s => undefinedToNull(s.toJSON()))
  };
};

export { parseStreamsProps, getStreamsData };
export type { IStreamsProps, IRawStreamsProps };
