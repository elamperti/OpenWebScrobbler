import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { changeLanguage } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useTranslation } from 'react-i18next';

import { useLanguage } from './useLanguage';

vi.mock('i18next', () => ({
  changeLanguage: vi.fn(),
}));
vi.mock('i18next-browser-languagedetector', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      detectors: {
        navigator: {
          lookup: vi.fn().mockReturnValue(['fr']),
        },
      },
    })),
  };
});
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));
vi.mock('utils/i18n', () => ({ fallbackLng: { default: ['en'], fr: ['fr'] } }));

describe('useLanguage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns current language from i18n', () => {
    (useTranslation as any).mockReturnValue({ i18n: { language: 'it' } });
    const { result } = renderHook(() => useLanguage());
    expect(result.current.currentLanguage).toBe('it');
  });

  it('calls changeLanguage when setLanguage is called', () => {
    (useTranslation as any).mockReturnValue({ i18n: { language: 'en' } });
    const { result } = renderHook(() => useLanguage());
    act(() => {
      result.current.setLanguage('es');
    });
    expect(changeLanguage).toHaveBeenCalledWith('es');
  });

  it('detects language when set to auto', () => {
    (useTranslation as any).mockReturnValue({ i18n: { language: 'en' } });
    const { result } = renderHook(() => useLanguage());
    act(() => {
      result.current.setLanguage('auto');
    });
    expect(changeLanguage).toHaveBeenCalledWith('fr'); // 'fr' mocked in i18next-browser-languagedetector
  });

  it('falls back to default language if detection fails', () => {
    (useTranslation as any).mockReturnValue({ i18n: { language: 'en' } });
    // Ensure the mock exists before using mockImplementation
    if (!(LanguageDetector as any).default) {
      (LanguageDetector as any).default = vi.fn();
    }

    (LanguageDetector as any).default.mockImplementation(() => ({
      detectors: {
        navigator: {
          lookup: vi.fn().mockReturnValue([]),
        },
      },
    }));
    const { result } = renderHook(() => useLanguage());
    act(() => {
      result.current.setLanguage('auto');
    });
    expect(changeLanguage).toHaveBeenCalledWith('en');
  });
});
