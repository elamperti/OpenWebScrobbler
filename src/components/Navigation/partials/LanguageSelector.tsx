import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { languageList } from 'utils/i18n';
import ReactGA from 'react-ga';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { setSettings } from 'store/actions/settingsActions';

import './LanguageSelector.scss';

import type { RootState } from 'store';

export default function LanguageSelector({ className = '' }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const settings = useSelector((state: RootState) => state.settings);

  function changeLanguage(el) {
    const langCode = el.target.dataset.lang;
    ReactGA.event({
      category: 'Language',
      action: 'Change',
      label: langCode,
    });
    setSettings(dispatch)(
      {
        ...settings, // ToDo: remove the need for this
        lang: langCode,
      },
      isLoggedIn,
      true
    );
  }

  return (
    <UncontrolledDropdown data-cy="LanguageSelector" className={`ows-LanguageSelector ${className}`} nav>
      <DropdownToggle title="Select language" nav caret>
        <FontAwesomeIcon icon={faGlobe} />
        <span className="d-none d-lg-inline">{t('language')}</span>
      </DropdownToggle>
      <DropdownMenu end>
        {languageList.map((lang) => (
          <DropdownItem
            key={lang.code}
            active={lang.code === i18n.language.slice(0, 2)}
            data-lang={lang.code}
            onClick={changeLanguage}
          >
            {lang.name}
          </DropdownItem>
        ))}
        <a
          className="px-2 d-none d-sm-block text-center ows-translateCTA"
          href={process.env.REACT_APP_LINK_TO_TRANSLATIONS}
        >
          {t('translateYourLanguage')}
        </a>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}
