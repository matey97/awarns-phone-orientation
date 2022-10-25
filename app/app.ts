/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import { Application } from '@nativescript/core'
import { awarns } from "@awarns/core";
import { tasks } from "~/core/tasks";
import { taskGraph } from "~/core/graph";
import { registerNotificationsPlugin } from "@awarns/notifications";
import { registerPhoneSensorsPlugin } from "@awarns/phone-sensors";

awarns.init(
  tasks,
  taskGraph,
  [
    registerNotificationsPlugin('AwarNS Phone Orientation Notifications'),
    registerPhoneSensorsPlugin({
      enableVibrationOnStart: false
    }),
  ]
)
  .then(() => console.log('AwarNS framework successfully loaded'))
  .catch((err) => {
    console.error(`Could not load AwarNS framework: ${err.stack ? err.stack : err}`);
  });

Application.run({ moduleName: 'app-root' })

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
