import { DispatchableEvent, Task, TaskOutcome, TaskParams } from "@awarns/core/tasks";
import { recordsStore } from "@awarns/persistence";
import { TriAxial, TriAxialSample } from "@awarns/phone-sensors";
import { Orientation, OrientationChangeRecordType, OrientationType } from "~/core/orientation";
import { firstValueFrom } from "rxjs";
import { Change } from "@awarns/core/entities";

const DEFAULT_EVENT = 'orientationStatusCheckerTaskFinished';
const CHANGE_EVENT = 'orientationChangeDetected';

const THRESHOLD = 9.2;

export class OrientationStatusCheckerTask extends Task {

  constructor(
    private statusStore = recordsStore
  ) {
    super('orientationStatusCheckerTask', {
      outputEventNames: [DEFAULT_EVENT, CHANGE_EVENT]
    });
  }

  protected async onRun(
    taskParams: TaskParams,
    invocationEvent: DispatchableEvent
  ): Promise<void | TaskOutcome> {
    const accelerometerRecord = invocationEvent.data as TriAxial;
    const samples = accelerometerRecord.samples;

    const previousOrientation = await firstValueFrom(this.statusStore.listLast(OrientationChangeRecordType)) as Orientation;
    const orientationType: OrientationType = obtainOrientation(samples);
    if (!orientationType) {
      return {
        eventName: DEFAULT_EVENT
      };
    }

    const orientationChange = previousOrientation ? orientationType !== previousOrientation.orientationType : true;
    if (previousOrientation && orientationChange) {
      await this.statusStore.insert(new Orientation(previousOrientation.orientationType, Change.END));
    }

    return {
      eventName: orientationChange ? CHANGE_EVENT : DEFAULT_EVENT,
      result: orientationChange ? new Orientation(orientationType, Change.START) : undefined
    };
  }
}

function obtainOrientation(samples: TriAxialSample[]): OrientationType {
  const meanX = meanFromAxisSamples(samples.map(sample => Math.abs(sample.x)));
  const meanY = meanFromAxisSamples(samples.map(sample => Math.abs(sample.y)));
  const meanZ = meanFromAxisSamples(samples.map(sample => Math.abs(sample.z)));

  if (isOrientationStatusChange(meanX)) {
    return OrientationType.LANDSCAPE;
  } else if (isOrientationStatusChange(meanY)) {
    return OrientationType.PORTRAIT;
  } else if (isOrientationStatusChange(meanZ)) {
    return OrientationType.IDLE;
  }

  return undefined;
}

function meanFromAxisSamples(axisSamples: number[]): number {
  return axisSamples.reduce((prev, curr) => prev + curr) / axisSamples.length;
}

function isOrientationStatusChange(meanAxisValue: number): boolean {
  return meanAxisValue > THRESHOLD;
}
