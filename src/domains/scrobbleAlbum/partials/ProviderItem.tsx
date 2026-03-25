import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

import { BS_SIZE_MD, useBootstrapBreakpoint } from 'utils/bootstrapBreakpoints';

import { PROVIDER_DISCOGS, PROVIDER_LASTFM, PROVIDER_NAME } from 'Constants';

interface ProviderDropdownProps {
  dataProvider: string;
  showDropdown?: boolean;
}

export default function ProviderItem({ dataProvider, showDropdown }: ProviderDropdownProps) {
  const navigate = useNavigate();
  const bsBreakpoint = useBootstrapBreakpoint();
  const { t } = useTranslation();

  const changeDataProvider = (provider) => {
    navigate('.', {
      replace: true,
      state: { provider },
    });
  };

  if (showDropdown) {
    return (
      <>
        <UncontrolledDropdown data-cy="DataSourceDropdown" nav inNavbar={bsBreakpoint < BS_SIZE_MD}>
          <DropdownToggle nav caret className="ows-dropdown-user" data-cy="DataSourceDropdown-toggle">
            {t('dataProvider')}: <span data-cy="AlbumBreadcrumb-provider">{PROVIDER_NAME[dataProvider]}</span>
          </DropdownToggle>
          <DropdownMenu end data-cy="DataSourceDropdown-menu">
            <DropdownItem
              active={dataProvider === PROVIDER_DISCOGS}
              onClick={() => changeDataProvider(PROVIDER_DISCOGS)}
              data-cy={`DataSourceDropdown-item-${PROVIDER_DISCOGS}`}
            >
              {PROVIDER_NAME[PROVIDER_DISCOGS]}
            </DropdownItem>
            <DropdownItem
              active={dataProvider === PROVIDER_LASTFM}
              onClick={() => changeDataProvider(PROVIDER_LASTFM)}
              data-cy={`DataSourceDropdown-item-${PROVIDER_LASTFM}`}
            >
              {PROVIDER_NAME[PROVIDER_LASTFM]}
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </>
    );
  }
  return (
    <>
      {t('dataProvider')}: <span data-cy="AlbumBreadcrumb-provider">{PROVIDER_NAME[dataProvider]}</span>
    </>
  );
}
