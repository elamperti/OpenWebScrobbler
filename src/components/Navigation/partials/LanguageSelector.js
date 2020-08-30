import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { languageList } from 'utils/i18n'; // ToDo: remove i18n and get current language from elsewhere
import ReactGA from 'react-ga';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { setSettings } from 'store/actions/settingsActions';

import './LanguageSelector.scss';

export default function LanguageSelector({ className }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const settings = useSelector((state) => state.settings);

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
    <UncontrolledDropdown data-cy="LanguageSelector" className={`ows-LanguageSelector ${className}`} nav inNavbar>
      <DropdownToggle title="Select language" nav caret>
        <FontAwesomeIcon icon={faGlobe} />
        <span className="d-none d-lg-inline">{t('language')}</span>
      </DropdownToggle>
      <DropdownMenu right>
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
          href="https://github.com/elamperti/OpenWebScrobbler/#translations"
        >
          {t('translateYourLanguage')}
        </a>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}

LanguageSelector.propTypes = {
  className: PropTypes.string,
};

LanguageSelector.defaultProps = {
  className: '',
};
