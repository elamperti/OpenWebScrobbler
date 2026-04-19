import { useContext, useEffect, useMemo, useState } from 'react';
import Turnstile from 'react-turnstile';

import { tweak } from 'utils/tweaks/Tweaks';

import { CaptchaContext } from './CaptchaContext';

import { getTurnstileSiteKey } from 'Constants';

import type { BoundTurnstileObject, TurnstileProps } from 'react-turnstile';

import './TurnstileWrapper.scss';

import { useFeatureIsOn } from '@growthbook/growthbook-react';

interface TurnstileWrapperProps extends Partial<TurnstileProps> {
  action: string;
}
export const TurnstileWrapper = (props: TurnstileWrapperProps) => {
  const turnstileSiteKey = useMemo<string>(() => (window.getTurnstileSiteKey ?? getTurnstileSiteKey)(), []);
  const bypassTurnstile = useFeatureIsOn('bypass-turnstile');
  const { captchaToken, setCaptchaToken } = useContext(CaptchaContext);
  const [reset, setReset] = useState(null);

  useEffect(() => {
    if (!captchaToken && reset) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captchaToken]);

  if (!turnstileSiteKey || bypassTurnstile) {
    return null;
  }

  const readyFn = (token: string, clearenceObtained: boolean, turnstileInstance: BoundTurnstileObject) => {
    setCaptchaToken(token);
    if (!reset) {
      setReset(() => turnstileInstance.reset);
    }
  };

  const resetCaptcha = () => {
    setCaptchaToken('');
  };

  return (
    <Turnstile
      {...props}
      className={`text-center${props.className ? ' ' + props.className : ''}`}
      id="turnstile-container"
      sitekey={turnstileSiteKey}
      onSuccess={readyFn}
      onTimeout={resetCaptcha}
      appearance={tweak(false, 'Turnstile', 'Visible') ? 'always' : 'interaction-only'}
      theme="dark"
      data-cy="turnstile-container"
      refreshExpired="auto"
    />
  );
};
