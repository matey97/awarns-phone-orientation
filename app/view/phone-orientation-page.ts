import { EventData, Page } from '@nativescript/core'
import { PhoneOrientationModel } from './phone-orientation-view-model'

export function navigatingTo(args: EventData) {
  const page = <Page>args.object
  page.bindingContext = new PhoneOrientationModel()
}
