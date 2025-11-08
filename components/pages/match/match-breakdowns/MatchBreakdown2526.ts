import Match from '@the-orange-alliance/api/lib/cjs/models/Match';
import {
  MatchBreakdownBoolField,
  MatchBreakdownField,
  MatchBreakdownRow,
  MatchBreakdownTitle,
  MatchBreakdownStringField
} from '../match-breakdown-row';
import MatchDetails from '@the-orange-alliance/api/lib/cjs/models/game-specifics/2526/MatchDetails';
import AllianceDetails2526 from '@the-orange-alliance/api/lib/cjs/models/game-specifics/2526/AllianceDetails';

export default class MatchBreakdown2526 {
  calcParkLocation(robot: 'NONE' | 'PARTIAL' | 'FULL'): string {
    switch (robot) {
      case 'NONE':
        return 'None';
      case 'PARTIAL':
        return 'Partial (+5)';
      case 'FULL':
        return 'Full (+10)';
      default:
        return 'None';
    }
  }

  calcTotalRp(alliance: AllianceDetails2526): number {
    let totalRp = 0;
    if (alliance.movementRP) {
      totalRp += 1;
    }
    if (alliance.goalRP) {
      totalRp += 1;
    }
    if (alliance.patternRP) {
      totalRp += 1;
    }
    return totalRp;
  }

  getRows(match: Match): MatchBreakdownRow[] {
    const details: MatchDetails = match.details as MatchDetails;
    const red: AllianceDetails2526 = details.redDtls;
    const blue: AllianceDetails2526 = details.blueDtls;

    // TODO: Replace team 1 and 2 with actual team numbers?
    return [
      MatchBreakdownTitle('Autonomous', red.autoPoints, blue.autoPoints),
      MatchBreakdownField(
        'Classified Artifacts',
        red.autoClassifiedArtifacts,
        blue.autoClassifiedArtifacts,
        3
      ),
      MatchBreakdownField(
        'Overflow Artifacts',
        red.autoOverflowArtifacts,
        blue.autoOverflowArtifacts,
        1
      ),
      MatchBreakdownField('Artifact Points', red.autoArtifactPoints, blue.autoArtifactPoints, 1),
      MatchBreakdownField('Pattern Matches', red.autoPatternPoints, blue.autoPatternPoints, 2),
      MatchBreakdownField('Leave (Auto)', red.autoLeavePoints, blue.autoLeavePoints, 3),
      MatchBreakdownBoolField('Robot 1 Auto Leave', red.robot1Auto, blue.robot1Auto, 0),
      MatchBreakdownBoolField('Robot 2 Auto Leave', red.robot2Auto, blue.robot2Auto, 0),
      MatchBreakdownTitle('Teleop', red.teleopPoints, blue.teleopPoints),
      MatchBreakdownField(
        'Classified Artifacts',
        red.teleopClassifiedArtifacts,
        blue.teleopClassifiedArtifacts,
        3
      ),
      MatchBreakdownField(
        'Overflow Artifacts',
        red.teleopOverflowArtifacts,
        blue.teleopOverflowArtifacts,
        1
      ),
      MatchBreakdownField(
        'Depot Artifacts',
        red.teleopDepotArtifacts,
        blue.teleopDepotArtifacts,
        1
      ),
      MatchBreakdownField(
        'Artifact Points',
        red.teleopArtifactPoints,
        blue.teleopArtifactPoints,
        1
      ),
      MatchBreakdownField('Depot Points', red.teleopDepotPoints, blue.teleopDepotPoints, 1),
      MatchBreakdownField('Pattern Matches', red.teleopPatternPoints, blue.teleopPatternPoints, 2),
      MatchBreakdownField('Base Points', red.teleopBasePoints, blue.teleopBasePoints, 1),
      MatchBreakdownStringField(
        'Robot 1 Teleop',
        this.calcParkLocation(red.robot1Teleop as any),
        this.calcParkLocation(blue.robot1Teleop as any)
      ),
      MatchBreakdownStringField(
        'Robot 2 Teleop',
        this.calcParkLocation(red.robot2Teleop as any),
        this.calcParkLocation(blue.robot2Teleop as any)
      ),
      MatchBreakdownTitle(
        'Penalty',
        details.blueMinPen * 5 + details.blueMajPen * 15,
        details.redMinPen * 5 + details.redMajPen * 15
      ),
      MatchBreakdownField('Minor Penalties', red.minorFouls, blue.minorFouls, 5),
      MatchBreakdownField('Major Penalties', red.majorFouls, blue.majorFouls, 15),
      MatchBreakdownTitle('Ranking Points', this.calcTotalRp(red), this.calcTotalRp(blue)),
      MatchBreakdownBoolField('Movement', red.movementRP, blue.movementRP, 0, true),
      MatchBreakdownBoolField('Goal', red.goalRP, blue.goalRP, 1, true),
      MatchBreakdownBoolField('Pattern', red.patternRP, blue.patternRP, 1, true),
      MatchBreakdownTitle('Final', match.redScore, match.blueScore)
    ];
  }
}
