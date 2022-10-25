import { Dialogs, Observable } from '@nativescript/core'
import { awarns } from "@awarns/core";
import { Orientation } from "~/core/orientation";
import { recordsStore } from "@awarns/persistence";

export class PhoneOrientationModel extends Observable {
  private monitoring: boolean;
  private orientationChanges: Orientation[];

  constructor(
    private statesStore = recordsStore
  ) {
    super()
    this.setMonitoringState(false);
    this.statesStore.list(50).subscribe(records => {
      this.orientationChanges = records as Orientation[];
      this.notifyPropertyChange('orientationChanges', this.orientationChanges);
    });
  }

  setMonitoringState(enabled: boolean) {
    this.monitoring = enabled;
    this.notifyPropertyChange('monitoring', this.monitoring);
  }

  onTapStart() {
    awarns.emitEvent('startMonitoring');
    this.setMonitoringState(true);
  }

  onTapStop() {
    awarns.emitEvent('stopMonitoring');
    this.setMonitoringState(false);
  }

  onClearTap() {
    const confirmOptions = {
      title: 'Clear records',
      message: 'Are you sure you want clear the orientation records?',
      okButtonText: 'Yes',
      cancelButtonText: 'No',
    }

    Dialogs.confirm(confirmOptions).then((remove) => {
      if (remove) this.statesStore.clear();
    })
  }
}
