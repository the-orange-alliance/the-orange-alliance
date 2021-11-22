import TOAProvider from "../../providers/TOAProvider";
import {CURRENT_SEASON} from "../../constants";
import {undefinedToNull} from "../../util/common-utils";
import Team from "@the-orange-alliance/api/lib/cjs/models/Team";

interface IRawTeamsProps {
  teams: any
}

interface ITeamsProps {
  teams: Team[]
}

const parseTeamsProps = (props: IRawTeamsProps): ITeamsProps => {
  return {
    teams: props.teams.map((t: any) => new Team().fromJSON(t))
  }
}

const getTeamsData = async (): Promise<IRawTeamsProps> => {
  const data = await TOAProvider.getAPI().getTeams({last_active: CURRENT_SEASON})

  return {
    teams: data.map(t =>undefinedToNull( t.toJSON())),
  }
}

export {parseTeamsProps, getTeamsData};
export type {IRawTeamsProps, ITeamsProps}