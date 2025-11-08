import { Check, Close } from '@mui/icons-material';

export class MatchBreakdownConstants {
  trueValue = -1000;
  falseValue = -2000;
  stringPassthrough = -2;
  null = -1;
  velocityVortexParking = 1;
  velocityVortexCapBall = 2;
  ultimateGoalWobble = 3;
  freightFrenzyParking = 4;
  freightFrenzyBarcodeElement = 5;
  powerPlayParking = 6;
  centerstageParking = 7;
}

export class MatchBreakdownRow {
  isTitle: boolean;
  name: string;
  red: number | string;
  blue: number | string;
  redPoints: number;
  bluePoints: number;
  gameType: number;
  isRp: boolean = false;

  redIcon: JSX.Element | null;
  blueIcon: JSX.Element | null;

  constructor(
    isTitle: boolean,
    name: string,
    red: number | string,
    blue: number | string,
    redPoints: number,
    bluePoints: number,
    gameType: number = -1,
    isRp: boolean = false
  ) {
    this.isTitle = isTitle;
    this.name = name;
    this.red = red;
    this.blue = blue;
    this.redPoints = redPoints;
    this.bluePoints = bluePoints;
    this.gameType = gameType;
    this.isRp = isRp;

    const constants = new MatchBreakdownConstants();
    this.redIcon =
      this.red === constants.trueValue ? (
        <Check />
      ) : this.red === constants.falseValue ? (
        <Close />
      ) : null;
    this.blueIcon =
      this.blue === constants.trueValue ? (
        <Check />
      ) : this.blue === constants.falseValue ? (
        <Close />
      ) : null;
  }

  getRedPoints(): string {
    if (this.isRp) {
      return this.red ? '(+1 RP)' : '';
    } else if (this.isTitle) {
      return `${this.red} Points`;
    } else {
      return this.getString(this.red, 'red');
    }
  }

  getBluePoints(): string {
    if (this.isRp) {
      return this.red ? '(+1 RP)' : '';
    } else if (this.isTitle) {
      return `${this.blue} Points`;
    } else {
      return this.getString(this.blue, 'blue');
    }
  }

  getString(s: number | string, alliance: 'red' | 'blue'): string {
    const constants = new MatchBreakdownConstants();
    if (this.gameType === constants.velocityVortexParking && typeof s === 'number') {
      return this.getVelocityVortexParkingString(s);
    } else if (this.gameType === constants.velocityVortexCapBall && typeof s === 'number') {
      return this.getVelocityVortexCapBallString(s);
    } else if (this.gameType === constants.ultimateGoalWobble && typeof s === 'number') {
      return this.getUltimateGoalWobbleString(s);
    } else if (this.gameType === constants.freightFrenzyParking && typeof s === 'string') {
      return this.getFreightFrenzyParking(s);
    } else if (this.gameType === constants.freightFrenzyBarcodeElement && typeof s === 'string') {
      return this.getFreightFrenzyBarcodeElement(s);
    } else if (this.gameType === constants.powerPlayParking && typeof s === 'string') {
      return this.getPowerPlayParking(s);
    } else if (this.gameType === constants.centerstageParking && typeof s === 'string') {
      return this.getCenterstageParking(s);
    } else if (this.gameType === constants.stringPassthrough && typeof s === 'string') {
      return s;
    } else {
      const isTrue = s === constants.trueValue;
      const isFalse = s === constants.falseValue;
      const isTrueFalse = isTrue || isFalse;

      const name = !isTrueFalse ? s : '';
      let pts;
      if (alliance === 'red') {
        pts =
          !isTrueFalse && typeof s === 'number' ? s * this.redPoints : isTrue ? this.redPoints : 0;
      } else {
        pts =
          !isTrueFalse && typeof s === 'number' ? s * this.redPoints : isTrue ? this.redPoints : 0;
      }
      return s !== 0 && !isFalse ? `${name} (${pts > 0 ? '+' : ''}${pts})` : isFalse ? '' : '0';
    }
  }

  getVelocityVortexParkingString(key: number) {
    switch (key) {
      case 1:
        return 'On Center Vortex (+5)';
      case 2:
        return 'Completely On Center Vortex (+10)';
      case 3:
        return 'On Corner Ramp (+5)';
      case 4:
        return 'Completely On Corner Ramp (+10)';
    }
    return 'Not Parked';
  }

  getVelocityVortexCapBallString(key: number) {
    switch (key) {
      case 1:
        return 'Low (+10)';
      case 2:
        return 'High (+20)';
      case 3:
        return 'Capping (+40)';
    }
    return 'Not Scored';
  }

  getUltimateGoalWobbleString(key: number) {
    switch (key) {
      case 1:
        return 'Start Line (+5)';
      case 2:
        return 'Drop Zone (+20)';
      case 0:
        return 'Not Scored';
    }
    return 'Not Scored';
  }

  getFreightFrenzyBarcodeElement(key: string) {
    switch (key) {
      case 'DUCK':
        return 'Duck';
      case 'TEAM_SHIPPING_ELEMENT':
        return 'Team Shipping Element';
    }
    return 'Not Scored';
  }

  getFreightFrenzyParking(key: string) {
    switch (key) {
      case 'NONE':
        return 'None';
      case 'IN_WAREHOUSE':
        return 'Partially in Warehouse';
      case 'COMPLETELY_IN_WAREHOUSE':
        return 'Completely in Warehouse';
      case 'IN_STORAGE':
        return 'Partially in Storage';
      case 'COMPLETELY_IN_STORAGE':
        return 'Completely in Storage';
    }
    return 'Not Scored';
  }

  getPowerPlayParking(key: string) {
    switch (key) {
      case 'NONE':
        return 'None';
      case 'SUBSTATION_TERMINAL':
        return 'Substation Terminal (+2)';
      case 'SIGNAL_ZONE':
        return 'Signal Zone (+10)';
      case 'CUSTOM_SIGNAL_ZONE':
        return 'Custom Sleeve Signal Zone (+20)';
    }
    return 'Not Scored';
  }

  getCenterstageParking(key: string) {
    switch (key) {
      case 'NONE':
        return 'None';
      case 'BACKSTAGE':
        return 'Backstage (+5)';
      case 'RIGGING':
        return 'Rigging (+20)';
    }
    return 'Not Scored';
  }
}

export function MatchBreakdownTitle(name: string, redScore: number, blueScore: number) {
  return new MatchBreakdownRow(true, name, redScore, blueScore, -1, -1);
}

export function MatchBreakdownField(name: string, red: number, blue: number, points: number) {
  return new MatchBreakdownRow(false, name, red, blue, points, points);
}

export function MatchBreakdownCenterstageParking(name: string, red: string, blue: string) {
  return new MatchBreakdownRow(
    false,
    name,
    red,
    blue,
    -1,
    -1,
    new MatchBreakdownConstants().centerstageParking
  );
}

export function MatchBreakdownPowerPlayParking(name: string, red: string, blue: string) {
  return new MatchBreakdownRow(
    false,
    name,
    red,
    blue,
    -1,
    -1,
    new MatchBreakdownConstants().powerPlayParking
  );
}

export function MatchBreakdownFreightFrenzyParkingLocation(
  name: string,
  red: string,
  blue: string
) {
  return new MatchBreakdownRow(
    false,
    name,
    red,
    blue,
    -1,
    -1,
    new MatchBreakdownConstants().freightFrenzyParking
  );
}

export function MatchBreakdownFreightFrenzyBarcodeElement(name: string, red: string, blue: string) {
  return new MatchBreakdownRow(
    false,
    name,
    red,
    blue,
    -1,
    -1,
    new MatchBreakdownConstants().freightFrenzyBarcodeElement
  );
}

export function MatchBreakdownUltimateGoalWobbleField(name: string, red: number, blue: number) {
  return new MatchBreakdownRow(
    false,
    name,
    red,
    blue,
    -1,
    -1,
    new MatchBreakdownConstants().ultimateGoalWobble
  );
}

export function MatchBreakdownVelocityVortexParkingField(name: string, red: number, blue: number) {
  return new MatchBreakdownRow(
    false,
    name,
    red,
    blue,
    -1,
    -1,
    new MatchBreakdownConstants().velocityVortexParking
  );
}

export function MatchBreakdownVelocityVortexCapBallField(name: string, red: number, blue: number) {
  return new MatchBreakdownRow(
    false,
    name,
    red,
    blue,
    -1,
    -1,
    new MatchBreakdownConstants().velocityVortexCapBall
  );
}

export function MatchBreakdownBoolField(
  name: string,
  red: boolean,
  blue: boolean,
  points: number,
  isRp: boolean = false
) {
  const constants = new MatchBreakdownConstants();
  return new MatchBreakdownRow(
    false,
    name,
    red ? constants.trueValue : constants.falseValue,
    blue ? constants.trueValue : constants.falseValue,
    points,
    points,
    undefined,
    isRp
  );
}

export function MatchBreakdownBoolFieldVariable(
  name: string,
  red: boolean,
  blue: boolean,
  redPoint: number,
  bluePoint: number
) {
  const constants = new MatchBreakdownConstants();
  return new MatchBreakdownRow(
    false,
    name,
    red ? constants.trueValue : constants.falseValue,
    blue ? constants.trueValue : constants.falseValue,
    redPoint,
    bluePoint
  );
}

export function MatchBreakdownStringField(name: string, red: string, blue: string) {
  return new MatchBreakdownRow(
    false,
    name,
    red,
    blue,
    -1,
    -1,
    new MatchBreakdownConstants().stringPassthrough
  );
}
