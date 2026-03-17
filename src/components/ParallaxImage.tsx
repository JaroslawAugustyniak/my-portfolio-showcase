import { useEffect, useRef, useState } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  overlayClassName?: string;
}

const ParallaxImage = ({
  src,
  alt,
  speed = 0.3,
  className = "",
  overlayClassName = "",
}: ParallaxImageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      if (rect.bottom > 0 && rect.top < windowH) {
        setOffset((rect.top - windowH / 2) * speed);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-[120%] object-cover will-change-transform"
        style={{ transform: `translateY(${offset}px)` }}
      />
      {overlayClassName && (
        <div className={`absolute inset-0 ${overlayClassName}`} />
      )}
    </div>
  );
};

export default ParallaxImage;
