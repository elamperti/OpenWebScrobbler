import { Trans } from 'react-i18next';

export default function WelcomeBlock() {
  return (
    <>
      <h1 className="display-5">
        <Trans i18nKey="welcomeToTheScrobbler">
          Welcome to the <span className="ows-Home-title">Open Scrobbler</span>!
        </Trans>
      </h1>
      <p className="lead mb-4">
        <Trans i18nKey="purpose" />
      </p>
    </>
  );
}
