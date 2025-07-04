import React, { useEffect, useRef, useState } from "react";
import "./Scroll.css";

const ScrollAnimado = ({ children, className = "" }) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(entry.target);
      }
    });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-item-derecha ${visible ? "visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollAnimado;
