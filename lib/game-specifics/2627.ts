import MatchDetails from '@the-orange-alliance/api/lib/cjs/models/MatchDetails';

/**
 * 2627 (BIOBUZZ) match details. @the-orange-alliance/api stops at 2526 and
 * its npm maintainers are the original TOA team, so this season's models live
 * here until the package catches up. Fields are the FTC Events API 2026
 * alliance breakdown, the same whitelist TOA-API stores
 * (2627AllianceDetails.ts).
 */
export class AllianceDetails2627 {
  alliance = '';
  team = 0;

  autoHiveTips = 0;
  autoRobot1Leave = false;
  autoRobot2Leave = false;
  autoRobot1Park = false;
  autoRobot2Park = false;
  autoLeavePoints = 0;
  autoParkPoints = 0;
  autoHivePoints = 0;

  teleopHiveTips = 0;
  teleopHivePollenNectar = 0;
  redAllianceFlower: string[] = [];
  scoringFlower: string[] = [];
  blueAllianceFlower: string[] = [];
  audienceFlower: string[] = [];
  teleopGardenPollenNectar = 0;
  teleopRobot1Park = false;
  teleopRobot2Park = false;
  teleopHivePoints = 0;
  teleopFlowerPoints = 0;
  teleopGardenPoints = 0;
  teleopParkPoints = 0;

  autoPoints = 0;
  teleopPoints = 0;
  foulPointsCommitted = 0;
  preFoulTotal = 0;
  swarmRP = false;
  pollinator1RP = false;
  pollinator2RP = false;
  totalPoints = 0;
  majorFouls = 0;
  minorFouls = 0;

  toJSON(): object {
    return { ...this };
  }

  fromJSON(json: any): AllianceDetails2627 {
    for (const key of Object.keys(this) as (keyof this)[]) {
      const value = json?.[key];
      if (value !== undefined && value !== null) this[key] = value;
    }
    return this;
  }
}

export class MatchDetails2627 extends MatchDetails {
  redDtls = new AllianceDetails2627();
  blueDtls = new AllianceDetails2627();

  toJSON(): object {
    return { ...super.toJSON(), red: this.redDtls.toJSON(), blue: this.blueDtls.toJSON() };
  }

  fromJSON(json: any): MatchDetails2627 {
    super.fromJSON(json);
    this.redDtls = new AllianceDetails2627().fromJSON(json?.red);
    this.blueDtls = new AllianceDetails2627().fromJSON(json?.blue);
    return this;
  }
}
