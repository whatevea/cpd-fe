import { useEffect, useRef } from "react";

const DESCRIPTION_SELECTOR = 'meta[name="description"]';

export function usePageMetadata({ title, description }) {
  const previousDescriptionRef = useRef("");

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const previousTitle = document.title;
    if (title) {
      document.title = `${title} • CPD2`;
    }

    let metaDescriptionTag = document.querySelector(
      DESCRIPTION_SELECTOR
    );
    if (!metaDescriptionTag && description) {
      metaDescriptionTag = document.createElement("meta");
      metaDescriptionTag.setAttribute("name", "description");
      document.head.appendChild(metaDescriptionTag);
    }

    if (metaDescriptionTag) {
      previousDescriptionRef.current =
        metaDescriptionTag.getAttribute("content") || "";
      if (description) {
        metaDescriptionTag.setAttribute("content", description);
      }
    }

    return () => {
      document.title = previousTitle;
      if (metaDescriptionTag) {
        metaDescriptionTag.setAttribute(
          "content",
          previousDescriptionRef.current
        );
      }
    };
  }, [title, description]);
}
