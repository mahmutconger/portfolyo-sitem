import { useEffect, useState } from "react";
import { projects as projectContent } from "../content/projects";
import type { Project } from "../content/types";
import {
  fetchProjectMedia,
  type ProjectMedia,
  type ProjectMediaMap,
} from "../services/portfolioRepository";

export interface ProjectWithMedia extends Project {
  media: ProjectMedia;
}

const MEDIA_TIMEOUT_MS = 8000;
let cachedMedia: ProjectMediaMap | undefined;

export function mergeProjectMedia(
  list: Project[],
  media: ProjectMediaMap | undefined,
): ProjectWithMedia[] {
  return list.map((project) => ({
    ...project,
    media: (project.firestoreId && media?.[project.firestoreId]) || {
      gallery: [],
    },
  }));
}

/**
 * Proje metinleri hemen gösterilir; Firestore'daki görseller geldiğinde
 * eklenir. Görseller alınamazsa kartlar yedek görselle açılır.
 */
export function useProjects(): ProjectWithMedia[] {
  const [media, setMedia] = useState<ProjectMediaMap | undefined>(cachedMedia);
  useEffect(() => {
    if (cachedMedia) return;
    let active = true;
    const timeout = new Promise<never>((_, reject) =>
      window.setTimeout(() => reject(new Error("Zaman aşımı")), MEDIA_TIMEOUT_MS),
    );
    Promise.race([fetchProjectMedia(), timeout])
      .then((result) => {
        cachedMedia = result;
        if (active) setMedia(result);
      })
      .catch(() => {
        // Görseller isteğe bağlıdır; yedek görsel kullanılır.
      });
    return () => {
      active = false;
    };
  }, []);
  return mergeProjectMedia(projectContent, media);
}
