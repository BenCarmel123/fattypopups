import React from 'react';
import { useEventIndex } from 'pages/home/context/EventIndexContext.js';

export function useEventImage(event, imgRef, onMeasure) {
  const index = useEventIndex();
  const [src, setSrc] = React.useState(index === 0 ? event.poster : null);

  React.useEffect(() => {
    if (index === 0) return;
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSrc(event.poster);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(img);
    return () => observer.disconnect();
  }, [index, event.poster]);

  React.useEffect(() => {
    const img = imgRef.current;
    if (!img || !onMeasure) return;

    const measure = () => onMeasure(img.clientHeight);
    if (img.complete) measure();

    const onLoad = () => measure();
    img.addEventListener('load', onLoad);

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => measure());
      ro.observe(img);
    }

    const onResize = () => measure();
    window.addEventListener('resize', onResize);

    return () => {
      img.removeEventListener('load', onLoad);
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
    };
  }, [onMeasure]);

  return { src, index };
}
