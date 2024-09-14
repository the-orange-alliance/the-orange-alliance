import { Event } from '@the-orange-alliance/api/lib/cjs/models';
import MatchTable from '@/components/ui/match-table';

interface IProps {
  event: Event;
}

const MatchesTab = (props: IProps) => {
  return <MatchTable event={props.event} allowSelection />;
};

export default MatchesTab;
