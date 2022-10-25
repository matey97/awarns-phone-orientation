import { DispatchableEvent, Task, TaskOutcome, TaskParams } from "@awarns/core/tasks";
import { Orientation } from "~/core/orientation";

const EVENT = 'notificationPrepared';

export class PrepareNotificationTask extends Task {

  constructor() {
    super('prepareNotificationTask', {
      outputEventNames: ['notificationPrepared']
    });
  }

  protected async onRun(taskParams: TaskParams, invocationEvent: DispatchableEvent): Promise<void | TaskOutcome> {
    const currentOrientation = invocationEvent.data as Orientation;
    if (!currentOrientation) {
      throw new Error('Can\'t send an orientation change notification without knowing the current orientation');
    }

    const notificationBody = `${currentOrientation.orientationType} orientation started at ${currentOrientation.timestamp}`;

    return {
      eventName: EVENT,
      result: {
        body: notificationBody,
      }
    };
  }

}
