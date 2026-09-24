import { useEffect, useState } from 'react';
import { PLACEHOLDER_IMAGE } from '../../utils/helpers.js';

export default function SmartImage({ images, alt = '', className = '', ...rest }) {
  const sources = typeof images === 'string'
    ? [images]
    : Array.isArray(images) && images.length
      ? images
      : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [sources[0]]);

  const src = sources[index] || PLACEHOLDER_IMAGE;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setIndex((i) => Math.min(i + 1, sources.length))}
      {...rest}
    />
  );
}