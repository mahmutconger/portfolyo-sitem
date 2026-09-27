import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import {
  House,
  UserRound,
  Layers3,
  FolderOpen,
  BookOpen,
  Send,
  type PortfolioIcon,
} from "../ui/icons";
import { useTranslation } from "react-i18next";
import { sectionIds, type SectionId } from "./motion";

const icons: PortfolioIcon[] = [
  House,
  UserRound,
  Layers3,
  FolderOpen,
  BookOpen,
  Send,
];
function DockItem({
  mouseX,
  id,
  Icon,
  active,
  onSelect,
}: {
  mouseX: MotionValue<number>;
  id: SectionId;
  Icon: PortfolioIcon;
  active: boolean;
  onSelect: (id: SectionId) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const { t } = useTranslation();
  const distance = useTransform(mouseX, (x) => {
    const bounds = ref.current?.getBoundingClientRect();
    return bounds ? x - bounds.x - bounds.width / 2 : Infinity;
  });
  const targetScale = useTransform(
    distance,
    [-130, 0, 130],
    [1, reduced ? 1 : 1.5, 1],
  );
  const scale = useSpring(targetScale, {
    mass: 0.18,
    stiffness: 260,
    damping: 20,
  });
  const y = useTransform(scale, [1, 1.5], [0, -12]);
  const width = useTransform(scale, [1, 1.5], [45, 62]);
  return (
    <motion.button
      style={{ width }}
      ref={ref}
      className={`dock-item ${active ? "active" : ""}`}
      onClick={() => onSelect(id)}
      aria-label={t(`nav.${id}`)}
      aria-current={active ? "page" : undefined}
      onFocus={() => mouseX.set(Infinity)}
    >
      <span className="dock-tooltip">{t(`nav.${id}`)}</span>
      <motion.span style={{ scale, y }} className={`dock-icon dock-${id}`}>
        <Icon size={23} />
      </motion.span>
      <span className="dock-dot" />
      <span className="dock-mobile-label">{t(`nav.${id}`)}</span>
    </motion.button>
  );
}
export default function Dock({
  active,
  onSelect,
}: {
  active: SectionId;
  onSelect: (id: SectionId) => void;
}) {
  const mouseX = useMotionValue(Infinity);
  const { i18n } = useTranslation();
  return (
    <nav
      aria-label={
        i18n.language.startsWith("tr") ? "Ana gezinme" : "Main navigation"
      }
      className="dock-wrap"
    >
      <div
        className="dock"
        onPointerMove={(e) => {
          if (e.pointerType === "mouse") mouseX.set(e.clientX);
        }}
        onPointerLeave={() => mouseX.set(Infinity)}
      >
        {sectionIds.map((id, i) => (
          <DockItem
            key={id}
            mouseX={mouseX}
            id={id}
            Icon={icons[i]}
            active={id === active}
            onSelect={onSelect}
          />
        ))}
      </div>
      <span className="dock-caption">
        {i18n.language.startsWith("tr")
          ? "Biraz keşfet."
          : "Take a look around."}
      </span>
    </nav>
  );
}
