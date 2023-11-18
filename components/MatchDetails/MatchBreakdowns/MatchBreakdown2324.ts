import Match from '@the-orange-alliance/api/lib/cjs/models/Match';
import {
  MatchBreakdownBoolField,
  MatchBreakdownField,
  MatchBreakdownBoolFieldVariable,
  MatchBreakdownRow,
  MatchBreakdownTitle,
  MatchBreakdownCenterstageParking,
  MatchBreakdownStringField
} from '../MatchBreakdownRow';
import MatchDetails from '@the-orange-alliance/api/lib/cjs/models/game-specifics/2324/MatchDetails';
import AllianceDetails from '@the-orange-alliance/api/lib/cjs/models/game-specifics/2324/AllianceDetails';

export default class MatchBreakdown2324 {
  calcBonus(prop: boolean, scored: boolean): number {
    return prop && scored ? 20 : scored ? 10 : 0;
  }

  calcDrone(zone: number): string {
    const points = (4 - zone) * 10;
    return zone === 0 ? `0` : `Zone ${zone}+(${points}))`;
  }

  getRows(match: Match): MatchBreakdownRow[] {
    const details: MatchDetails = match.details as MatchDetails;
    const red: AllianceDetails = details.redDtls;
    const blue: AllianceDetails = details.blueDtls;

    // TODO: Replace team 1 and 2 with actual team numbers?
    return [
      MatchBreakdownTitle('Autonomous', red.auto_points, blue.auto_points),
      MatchBreakdownBoolField('Team 1 Prop', red.init_team_prop_1, blue.init_team_prop_1, 0),
      MatchBreakdownBoolField('Team 2 Prop', red.init_team_prop_2, blue.init_team_prop_2, 0),
      MatchBreakdownBoolField('Robot 1 Navigated', red.auto_robot_1, blue.auto_robot_1, 5),
      MatchBreakdownBoolField('Robot 2 Navigated', red.auto_robot_2, blue.auto_robot_2, 5),
      MatchBreakdownField('Backdrop Pixels', red.auto_backdrop, blue.auto_backdrop, 5),
      MatchBreakdownField('Backstage Pixels', red.auto_backstage, blue.auto_backstage, 5),
      MatchBreakdownBoolFieldVariable(
        'Robot 1 Purple Bonus',
        red.spike_mark_pixel_1,
        blue.spike_mark_pixel_1,
        this.calcBonus(red.init_team_prop_1, red.spike_mark_pixel_1),
        this.calcBonus(blue.init_team_prop_1, blue.spike_mark_pixel_1)
      ),
      MatchBreakdownBoolFieldVariable(
        'Robot 2 Purple Bonus',
        red.spike_mark_pixel_2,
        blue.spike_mark_pixel_2,
        this.calcBonus(red.init_team_prop_2, red.spike_mark_pixel_2),
        this.calcBonus(blue.init_team_prop_2, blue.spike_mark_pixel_2)
      ),
      MatchBreakdownBoolFieldVariable(
        'Robot 1 Yellow Bonus',
        red.target_backdrop_pixel_1,
        blue.target_backdrop_pixel_1,
        this.calcBonus(red.init_team_prop_1, red.target_backdrop_pixel_1),
        this.calcBonus(blue.init_team_prop_1, blue.target_backdrop_pixel_1)
      ),
      MatchBreakdownBoolFieldVariable(
        'Robot 2 Yellow Bonus',
        red.target_backdrop_pixel_2,
        blue.target_backdrop_pixel_2,
        this.calcBonus(red.init_team_prop_2, red.target_backdrop_pixel_2),
        this.calcBonus(blue.init_team_prop_2, blue.target_backdrop_pixel_2)
      ),
      MatchBreakdownTitle('Driver-Controlled', red.tele_points, blue.tele_points),
      MatchBreakdownField(
        'Backstage Pixels',
        red.tele_backstage_points,
        blue.tele_backstage_points,
        1
      ),
      MatchBreakdownField('Backdrop Pixels', red.tele_backdrop, blue.tele_backdrop, 3),
      MatchBreakdownField('Completed Mosaics', red.mosaics, blue.mosaics, 10),
      MatchBreakdownField('Set Line Bonus', red.max_set_line, blue.max_set_line, 10),
      MatchBreakdownTitle('End Game', red.end_points, red.end_points),
      MatchBreakdownCenterstageParking('Robot 1 Parking', red.end_robot_1, blue.end_robot_1),
      MatchBreakdownCenterstageParking('Robot 2 Parking', red.end_robot_2, blue.end_robot_2),
      MatchBreakdownStringField(
        'Robot 1 Drone Launch',
        this.calcDrone(red.drone_1),
        this.calcDrone(blue.drone_1)
      ),
      MatchBreakdownStringField(
        'Robot 2 Drone Launch',
        this.calcDrone(red.drone_2),
        this.calcDrone(blue.drone_2)
      ),

      MatchBreakdownTitle(
        'Penalty',
        details.blueMinPen * 10 + details.blueMajPen * 30,
        details.redMinPen * 10 + details.redMajPen * 30
      ),
      MatchBreakdownField('Minor Penalty', details.blueMinPen, details.redMinPen, 10),
      MatchBreakdownField('Major Penalty', details.blueMajPen, details.redMajPen, 30),

      MatchBreakdownTitle('Final', match.redScore, match.blueScore)
    ];
  }
}
