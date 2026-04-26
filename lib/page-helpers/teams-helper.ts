import { useMemo } from 'react';
import Team from '@the-orange-alliance/api/lib/cjs/models/Team';
import TOAProvider from '@/providers/toa-provider';
import { CURRENT_SEASON } from '@/constants';
import { undefinedToNull } from '@/lib/utils/common';

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

const getApiBase = () =>
  typeof window === 'undefined' && process.env.INTERNAL_API_URL
    ? process.env.INTERNAL_API_URL
    : (process.env.NEXT_PUBLIC_API_URL || 'https://api.theorangealliance.org');

export const fetchTeamsData = async (): Promise<IRawTeamsProps> => {
  try {
    const res = await fetch(
      `${getApiBase()}/team`,
      { headers: { 'x-application-origin': 'TOA-WebApp-1920' } }
    );
    const data = await res.json();
    if (!Array.isArray(data)) return { teams: [] };
    const teams = data.map((t: any) => new Team().fromJSON(t));
    teams.sort((a, b) => a.teamNumber - b.teamNumber);
    return { teams: teams.map(t => undefinedToNull(t.toJSON())) };
  } catch {
    return { teams: [] };
  }
};
