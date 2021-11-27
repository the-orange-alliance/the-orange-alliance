import { useMemo } from 'react';
import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import TOAProvider from '../../providers/TOAProvider';
import { undefinedToNull } from '../utils/common';

export interface IRawStreamsProps {
  streams: any[];
}

export interface IStreamsProps {
  streams: EventLiveStream[];
}

export const parseStreamsProps = (props: IRawStreamsProps): IStreamsProps => {
  return {
    streams: props.streams.map((s: any) => new EventLiveStream().fromJSON(s))
  };
};

export const useStreamsData = (props: IRawStreamsProps): IStreamsProps =>
  useMemo(() => parseStreamsProps(props), [props]);

export const fetchStreamsData = async (): Promise<IRawStreamsProps> => {
  const data = await Promise.all([TOAProvider.getAPI().getStreams()]);

  return {
    streams: data[0].map(s => undefinedToNull(s.toJSON()))
  };
};
