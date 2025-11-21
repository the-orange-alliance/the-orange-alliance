import { useMemo } from 'react';
import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import TOAProvider from '@/providers/toa-provider';
import { undefinedToNull } from '@/lib/utils/common';

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

  // Filter out any streams that are over 1 week ago
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const filteredStreams = data[0]
    .sort((sa, sb) => new Date(sb.startDateTime).getTime() - new Date(sa.startDateTime).getTime())
    .filter(s => {
      const streamDate = new Date(s.startDateTime);
      const lessThanAWeekOld = streamDate >= oneWeekAgo;
      const startDateHasPassed = streamDate <= new Date();
      return lessThanAWeekOld && startDateHasPassed;
    });

  return {
    streams: filteredStreams.map(s => undefinedToNull(s.toJSON()))
  };
};
