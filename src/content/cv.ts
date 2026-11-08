import type { CvDocument } from "./types";

// CV dosyaları `public/cv/` altında durur. Eski `/Mahmut_Can_CONGER_CV.pdf`
// adresi `vercel.json` içinde mobil CV'ye yönlendirilir.
export const cvDocuments: CvDocument[] = [
  {
    variant: "mobile",
    label: { tr: "Mobil Geliştirici CV", en: "Mobile Developer CV" },
    href: "/cv/Mahmut_Can_Conger_CV_Mobil.pdf",
    isDefault: true,
  },
  {
    variant: "fullstack",
    label: { tr: "Full Stack CV", en: "Full Stack CV" },
    href: "/cv/Mahmut_Can_Conger_CV_FullStack.pdf",
    isDefault: false,
  },
  {
    variant: "ime",
    label: {
      tr: "İME (Uzun Dönem Staj) CV",
      en: "Long-Term Internship (İME) CV",
    },
    href: "/cv/Mahmut_Can_Conger_CV_IME.pdf",
    isDefault: false,
  },
];

export const defaultCv: CvDocument =
  cvDocuments.find((cv) => cv.isDefault) ?? cvDocuments[0];

export const legacyCvPaths = ["/Mahmut_Can_CONGER_CV.pdf", "/CV_TR.pdf"];
