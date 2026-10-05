import Match from '@the-orange-alliance/api/lib/cjs/models/Match';
import {
  MatchBreakdownBoolField,
  MatchBreakdownField,
  MatchBreakdownRow,
  MatchBreakdownStringField,
  MatchBreakdownTitle
} from '../match-breakdown-row';
import { AllianceDetails2627, MatchDetails2627 } from '@/lib/game-specifics/2627';

/**
 * BIOBUZZ. Point values are worked out from the first 140 matches of the
 * season (exact fit on every alliance): leave 3, park 5 (auto and teleop),
 * hive tip 20, hive pollen or nectar 2, garden pollen or nectar 1, minor
 * foul 5, major foul 20. Flower points do not split into a per-item value
 * from the API fields, so the row shows the total.
 */
export default class MatchBreakdown2627 {
  calcTotalRp(alliance: AllianceDetails2627): number {
    return [alliance.swarmRP, alliance.pollinator1RP, alliance.pollinator2RP].filter(Boolean)
      .length;
  }

  flowerPoints(points: number): string {
    return points > 0 ? `(+${points})` : '0';
  }

  getRows(match: Match): MatchBreakdownRow[] {
    const details = match.details as MatchDetails2627;
    const red = details.redDtls;
    const blue = details.blueDtls;

    return [
      MatchBreakdownTitle('Autonomous', red.autoPoints, blue.autoPoints),
      MatchBreakdownBoolField('Robot 1 Leave', red.autoRobot1Leave, blue.autoRobot1Leave, 3),
      MatchBreakdownBoolField('Robot 2 Leave', red.autoRobot2Leave, blue.autoRobot2Leave, 3),
      MatchBreakdownField('Hive Tips', red.autoHiveTips, blue.autoHiveTips, 20),
      MatchBreakdownBoolField('Robot 1 Park', red.autoRobot1Park, blue.autoRobot1Park, 5),
      MatchBreakdownBoolField('Robot 2 Park', red.autoRobot2Park, blue.autoRobot2Park, 5),
      MatchBreakdownTitle('Teleop', red.teleopPoints, blue.teleopPoints),
      MatchBreakdownField('Hive Tips', red.teleopHiveTips, blue.teleopHiveTips, 20),
      MatchBreakdownField(
        'Hive Pollen and Nectar',
        red.teleopHivePollenNectar,
        blue.teleopHivePollenNectar,
        2
      ),
      MatchBreakdownField(
        'Garden Pollen and Nectar',
        red.teleopGardenPollenNectar,
        blue.teleopGardenPollenNectar,
        1
      ),
      MatchBreakdownStringField(
        'Flowers',
        this.flowerPoints(red.teleopFlowerPoints),
        this.flowerPoints(blue.teleopFlowerPoints)
      ),
      MatchBreakdownBoolField('Robot 1 Park', red.teleopRobot1Park, blue.teleopRobot1Park, 5),
      MatchBreakdownBoolField('Robot 2 Park', red.teleopRobot2Park, blue.teleopRobot2Park, 5),
      MatchBreakdownTitle('Penalty', blue.foulPointsCommitted, red.foulPointsCommitted),
      MatchBreakdownField('Minor Penalties', red.minorFouls, blue.minorFouls, 5),
      MatchBreakdownField('Major Penalties', red.majorFouls, blue.majorFouls, 20),
      MatchBreakdownTitle('Ranking Points', this.calcTotalRp(red), this.calcTotalRp(blue)),
      MatchBreakdownBoolField('Swarm', red.swarmRP, blue.swarmRP, 1, true),
      MatchBreakdownBoolField('Pollinator 1', red.pollinator1RP, blue.pollinator1RP, 1, true),
      MatchBreakdownBoolField('Pollinator 2', red.pollinator2RP, blue.pollinator2RP, 1, true),
      MatchBreakdownTitle('Final', match.redScore, match.blueScore)
    ];
  }
}
