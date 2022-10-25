import { TaskGraph, EventListenerGenerator, RunnableTaskDescriptor } from '@awarns/core/tasks';

class AwarNSPhoneOrientationTaskGraph implements TaskGraph {
  async describe(on: EventListenerGenerator, run: RunnableTaskDescriptor): Promise<void> {
    on('startMonitoring', run('startDetectingPhoneAccelerometerChanges'));

    on('accelerometerSamplesAcquired', run('orientationStatusCheckerTask'));
    on('orientationChangeDetected', run('writeRecords'));
    on('orientationChangeDetected', run('prepareNotificationTask'));
    on('notificationPrepared', run('sendNotification', {
      title: 'Orientation change'
    }));

    on('stopMonitoring', run('stopDetectingPhoneAccelerometerChanges'));
  }
}

export const taskGraph = new AwarNSPhoneOrientationTaskGraph();
