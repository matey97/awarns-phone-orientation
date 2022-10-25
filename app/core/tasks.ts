import { Task } from '@awarns/core/tasks';
import {
  PhoneSensor,
  startDetectingPhoneSensorChangesTask,
  stopDetectingPhoneSensorChangesTask
} from "@awarns/phone-sensors";
import { OrientationStatusCheckerTask } from "~/core/orientation-status-checker";
import { writeRecordsTask } from "@awarns/persistence";
import { PrepareNotificationTask } from "~/core/prepare-notification-task";
import { sendNotificationTask } from "@awarns/notifications";

export const tasks: Array<Task> = [
  startDetectingPhoneSensorChangesTask(PhoneSensor.ACCELEROMETER, { sensorDelay: 10, batchSize: 50 }),
  stopDetectingPhoneSensorChangesTask(PhoneSensor.ACCELEROMETER),

  new OrientationStatusCheckerTask(),

  writeRecordsTask(),

  new PrepareNotificationTask(),
  sendNotificationTask(),
];
