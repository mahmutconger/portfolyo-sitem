import { useTranslation } from "react-i18next";
import { toLanguage } from "../content/format";
import type { Language } from "../content/types";

/** Etkin dili sitenin iki dilinden biri olarak döndürür. */
export function useLanguage(): Language {
  const { i18n } = useTranslation();
  return toLanguage(i18n.resolvedLanguage ?? i18n.language);
}
