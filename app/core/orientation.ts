import { Change, Record } from "@awarns/core/entities";

export const OrientationChangeRecordType = 'orientation-change';

export class Orientation extends Record {
  constructor(public orientationType: OrientationType, change: Change) {
    super(OrientationChangeRecordType, new Date(), change);
  }
}

export enum OrientationType {
  PORTRAIT = 'PORTRAIT', LANDSCAPE = 'LANDSCAPE', IDLE = 'IDLE'
}
