import Match from '@the-orange-alliance/api/lib/cjs/models/Match';
import {
  MatchBreakdownBoolField,
  MatchBreakdownField,
  MatchBreakdownPowerPlayParking,
  MatchBreakdownRow,
  MatchBreakdownTitle
} from '../MatchBreakdownRow';
import PowerPlayMatchDetails from '@the-orange-alliance/api/lib/cjs/models/game-specifics/2223/PowerPlayMatchDetails';
import PowerPlayAllianceDetails from '@the-orange-alliance/api/lib/cjs/models/game-specifics/2223/PowerPlayAllianceDetails';

/*
Here is the field layout:
G = Ground, L= Low, M = Medium, H = High

*SCORING TABLE*
   0  1  2  3  4
0  G  L  G  L  G
1  L  M  H  M  L
2  G  H  G  H  G
3  L  M  H  M  L
4  G  L  G  L  G
  * AUDIENCE *

Possible Elements on a junction:
"MY_CONE" "OTHER_CONE" "MY_R1_BEACON" "MY_R2_BEACON" "OTHER_R1_BEACON" "OTHER_R2_BEACON"
 */

export default class MatchBreakdown2223 {
  getRows(match: Match): MatchBreakdownRow[] {
    const details: PowerPlayMatchDetails = match.details as PowerPlayMatchDetails;
    const red: PowerPlayAllianceDetails = details.redDtls;
    const blue: PowerPlayAllianceDetails = details.blueDtls;

    // TODO: Replace team 1 and 2 with actual team numbers?
    return [
      MatchBreakdownTitle('Autonomous', match.redAutoScore, match.blueAutoScore),
      MatchBreakdownPowerPlayParking('Robot 1 Navigated', red.autoRobot1, blue.autoRobot1),
      MatchBreakdownPowerPlayParking('Robot 2 Navigated', red.autoRobot2, blue.autoRobot2),
      MatchBreakdownField('Cones Placed in a Terminal', red.autoTerminal, blue.autoTerminal, 1),
      MatchBreakdownField(
        'Cones Secured Ground Junctions',
        red.autoJunctionCones[0],
        blue.autoJunctionCones[0],
        2
      ),
      MatchBreakdownField(
        'Cones Secured Low Junctions',
        red.autoJunctionCones[1],
        blue.autoJunctionCones[1],
        3
      ),
      MatchBreakdownField(
        'Cones Secured Medium Junctions',
        red.autoJunctionCones[2],
        blue.autoJunctionCones[2],
        4
      ),
      MatchBreakdownField(
        'Cones Secured High Junctions',
        red.autoJunctionCones[3],
        blue.autoJunctionCones[3],
        5
      ),
      MatchBreakdownBoolField(
        'Parked Correct Signal Zone',
        red.initSignalSleeve1,
        blue.initSignalSleeve1,
        10
      ),
      MatchBreakdownBoolField(
        'Parked Correct 2 Tiles',
        red.initSignalSleve2,
        blue.initSignalSleve2,
        20
      ),

      MatchBreakdownTitle('Driver-Controlled', red.telePoints, blue.telePoints),

      MatchBreakdownField(
        'Cones Placed in Near Terminal',
        red.teleTerminalNear,
        blue.teleTerminalNear,
        2
      ),

      MatchBreakdownField(
        'Cones Placed in Far Terminal',
        red.teleTerminalFar,
        blue.teleTerminalFar,
        2
      ),

      MatchBreakdownField(
        'Cones Secured Ground Junctions',
        red.teleJunctionCones[0],
        blue.teleJunctionCones[0],
        2
      ),
      MatchBreakdownField(
        'Cones Secured Low Junctions',
        red.teleJunctionCones[1],
        blue.teleJunctionCones[1],
        3
      ),
      MatchBreakdownField(
        'Cones Secured Medium Junctions',
        red.teleJunctionCones[2],
        blue.teleJunctionCones[2],
        4
      ),
      MatchBreakdownField(
        'Cones Secured High Junctions',
        red.teleJunctionCones[3],
        blue.teleJunctionCones[3],
        5
      ),

      MatchBreakdownTitle('End Game', match.redEndScore, match.blueEndScore),
      MatchBreakdownBoolField(
        'Robot 1 Parked in Terminal',
        red.endNavigated1,
        blue.endNavigated1,
        2
      ),
      MatchBreakdownBoolField(
        'Robot 2 Parked in Terminal',
        red.endNavigated2,
        blue.endNavigated2,
        2
      ),
      MatchBreakdownField('Junctions Owned by Cones', red.ownedJunctions, blue.ownedJunctions, 3),
      MatchBreakdownField('Junctions Owned by Beacons', red.beacons, blue.beacons, 10),
      MatchBreakdownBoolField('Completed Circuit', red.circuitExists, blue.circuitExists, 20),

      MatchBreakdownTitle('Penalty', match.redPenalty, match.bluePenalty),
      MatchBreakdownField('Minor Penalty', details.redMinPen, details.blueMinPen, -5),
      MatchBreakdownField('Major Penalty', details.redMajPen, details.blueMajPen, -20),

      MatchBreakdownTitle('Final', match.redScore, match.blueScore)
    ];
  }
}
