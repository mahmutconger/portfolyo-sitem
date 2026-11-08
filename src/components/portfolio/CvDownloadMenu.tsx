import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDownToLine, ChevronDown, FileText } from "../ui/icons";
import type { CvDocument, Language } from "../../content/types";

interface CvDownloadMenuProps {
  documents: CvDocument[];
  language: Language;
  /** "hero": ana sayfadaki düğme; "tile": iletişim bölümündeki kutu. */
  variant: "hero" | "tile";
  onDownload?: (cv: CvDocument) => void;
}

/**
 * Bölünmüş düğme: sol taraf varsayılan CV'yi indirir, sağdaki ok bütün CV
 * seçeneklerini (varsayılan ilk sırada) bir menüde açar.
 */
export default function CvDownloadMenu({
  documents,
  language,
  variant,
  onDownload,
}: CvDownloadMenuProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const ordered = [...documents].sort(
    (a, b) => Number(b.isDefault) - Number(a.isDefault),
  );
  const primary = ordered[0];

  useEffect(() => {
    if (!open) return;
    root.current
      ?.querySelector<HTMLAnchorElement>('[role="menuitem"]')
      ?.focus();
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setOpen(false);
      toggle.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!primary) return null;

  const moveFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const items = Array.from(
      root.current?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]') ?? [],
    );
    const index = items.indexOf(document.activeElement as HTMLAnchorElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    items[(index + step + items.length) % items.length]?.focus();
  };

  const download = (cv: CvDocument) => {
    onDownload?.(cv);
    setOpen(false);
  };

  return (
    <div className={`cv-menu cv-menu-${variant}`} ref={root}>
      <div className="cv-menu-split">
        <a
          className={variant === "hero" ? "button secondary cv-menu-main" : "cv-menu-main"}
          href={primary.href}
          download
          onClick={() => onDownload?.(primary)}
        >
          {variant === "tile" ? (
            <span className="cv-menu-tile-icon">
              <FileText size={16} />
            </span>
          ) : (
            <ArrowDownToLine size={16} />
          )}
          <span className="cv-menu-main-copy">
            {t("cv.download")}
            {variant === "tile" && (
              <small>
                {primary.label[language]} · {t("cv.format")}
              </small>
            )}
          </span>
        </a>
        <button
          ref={toggle}
          type="button"
          className={variant === "hero" ? "button secondary cv-menu-toggle" : "cv-menu-toggle"}
          aria-label={t("cv.more_options")}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          <ChevronDown size={14} />
        </button>
      </div>
      {open && (
        <div
          className="cv-menu-list"
          id={menuId}
          role="menu"
          aria-label={t("cv.menu_label")}
          onKeyDown={moveFocus}
        >
          {ordered.map((cv) => (
            <a
              key={cv.variant}
              role="menuitem"
              href={cv.href}
              download
              onClick={() => download(cv)}
            >
              <FileText size={15} />
              <span>{cv.label[language]}</span>
              {cv.isDefault && (
                <small className="cv-menu-badge">{t("cv.default_badge")}</small>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
