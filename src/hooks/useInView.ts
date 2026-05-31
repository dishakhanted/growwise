import { useEffect, useRef, useState } from "react";

type UseInViewOptions = IntersectionObserverInit & {
  once?: boolean;
};

export function useInView<T extends HTMLElement = HTMLElement>(options: UseInViewOptions = {}) {
  const { once = true, threshold = 0.15, root = null, rootMargin = "0px" } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, root, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, threshold, root, rootMargin]);

  return { ref, inView };
}
