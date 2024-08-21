export type Settings = {
  catchPaste: boolean;
  hasActiveSubscription: boolean;
  keepOriginalTimestamp: boolean;
  lang: string; // ToDo: coordinate this value with i18n.ts? (do we need that?)
  showTrackNumbers: boolean;
  use12Hours: boolean;
};
