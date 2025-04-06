import Match from '@the-orange-alliance/api/lib/cjs/models/Match';
import {
  MatchBreakdownField,
  MatchBreakdownRow,
  MatchBreakdownTitle,
  MatchBreakdownStringField
} from '../match-breakdown-row';
import MatchDetails from '@the-orange-alliance/api/lib/cjs/models/game-specifics/2425/MatchDetails';
import AllianceDetails from '@the-orange-alliance/api/lib/cjs/models/game-specifics/2425/AllianceDetails';

export default class MatchBreakdown2425 {
  calcAutoLocation(
    robot: 'NONE' | 'OBSERVATION_ZONE' | 'ASCENT_1' | 'ASCENT_2' | 'ASCENT_3' | 'ASCENT'
  ): string {
    switch (robot) {
      case 'ASCENT':
      case 'ASCENT_1':
        return 'Ascent (+3)';
      case 'ASCENT_2':
        return 'Ascent (+15)';
      case 'ASCENT_3':
        return 'Ascent (+30)';
      case 'OBSERVATION_ZONE':
        return 'Observation (+3)';
      default:
        return 'None';
    }
  }

  getRows(match: Match): MatchBreakdownRow[] {
    const details: MatchDetails = match.details as MatchDetails;
    const red: AllianceDetails = details.redDtls;
    const blue: AllianceDetails = details.blueDtls;

    // TODO: Replace team 1 and 2 with actual team numbers?
    return [
      MatchBreakdownTitle('Autonomous', red.autoPoints, blue.autoPoints),
      MatchBreakdownField('Samples Net', red.autoSampleNet, blue.autoSampleNet, 2),
      MatchBreakdownField('Samples Low', red.autoSampleLow, blue.autoSampleLow, 4),
      MatchBreakdownField('Samples High', red.autoSampleHigh, blue.autoSampleHigh, 8),
      MatchBreakdownField('Specimens Low', red.autoSpecimenLow, blue.autoSpecimenLow, 6),
      MatchBreakdownField('Specimens High', red.autoSpecimenHigh, blue.autoSpecimenHigh, 10),
      MatchBreakdownStringField(
        'Robot 1',
        this.calcAutoLocation(red.robot1Auto),
        this.calcAutoLocation(blue.robot1Auto)
      ),
      MatchBreakdownStringField(
        'Robot 2',
        this.calcAutoLocation(red.robot2Auto),
        this.calcAutoLocation(blue.robot2Auto)
      ),
      MatchBreakdownTitle('Teleop', red.teleopPoints, blue.teleopPoints),
      MatchBreakdownField('Samples Net', red.teleopSampleNet, blue.teleopSampleNet, 2),
      MatchBreakdownField('Samples Low', red.teleopSampleLow, blue.teleopSampleLow, 4),
      MatchBreakdownField('Samples High', red.teleopSampleHigh, blue.teleopSampleHigh, 8),
      MatchBreakdownField('Specimens Low', red.teleopSpecimenLow, blue.teleopSpecimenLow, 6),
      MatchBreakdownField('Specimens High', red.teleopSpecimenHigh, blue.teleopSpecimenHigh, 10),
      MatchBreakdownStringField(
        'Robot 1',
        this.calcAutoLocation(red.robot1Teleop),
        this.calcAutoLocation(blue.robot1Teleop)
      ),
      MatchBreakdownStringField(
        'Robot 2',
        this.calcAutoLocation(red.robot2Teleop),
        this.calcAutoLocation(blue.robot2Teleop)
      ),
      MatchBreakdownField('Minor Fouls', red.minorFouls, blue.minorFouls, 5),
      MatchBreakdownField('Major Fouls', red.majorFouls, blue.majorFouls, 15)
    ];
  }
}
