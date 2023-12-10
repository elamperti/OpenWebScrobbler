import { Trans, useTranslation } from 'react-i18next';

export default function WelcomeBlock() {
  const { t } = useTranslation();

  return (
    <>
      <h1 className="display-5">
        <Trans t={t} i18nKey="welcomeToTheScrobbler">
          Welcome to the <span className="ows-Home-title">Open Scrobbler</span>!
        </Trans>
      </h1>
      <p className="lead mb-4">{t('purpose')}</p>
    </>
  );
}
