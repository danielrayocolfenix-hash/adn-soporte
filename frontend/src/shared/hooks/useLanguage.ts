import { useTranslation } from "react-i18next";

import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/i18n/config";

export function useLanguage() {
  const { i18n } = useTranslation();

  const language = (i18n.resolvedLanguage ?? "es") as SupportedLanguage;
  const setLanguage = (lang: SupportedLanguage) => {
    void i18n.changeLanguage(lang);
  };

  return { language, setLanguage, languages: SUPPORTED_LANGUAGES };
}
