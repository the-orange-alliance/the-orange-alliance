import { useMemo } from 'react';
import Team from '@the-orange-alliance/api/lib/cjs/models/Team';
import TOAProvider from '../../providers/toa-provider';
import { CURRENT_SEASON } from '../../constants';
import { undefinedToNull } from '../utils/common';

export interface IRawTeamsProps {
  teams: any;
}

export interface ITeamsProps {
  teams: Team[];
}

export const parseTeamsProps = (props: IRawTeamsProps): ITeamsProps => {
  return {
    teams: props.teams.map((t: any) => new Team().fromJSON(t))
  };
};

export const useTeamsData = (props: IRawTeamsProps): ITeamsProps =>
  useMemo(() => parseTeamsProps(props), [props]);

export const fetchTeamsData = async (): Promise<IRawTeamsProps> => {
  const data = await TOAProvider.getAPI().getTeams({ last_active: CURRENT_SEASON });

  return {
    teams: data.map(t => undefinedToNull(t.toJSON()))
  };
};
