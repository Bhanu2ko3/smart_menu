import "@google/model-viewer";
import { forwardRef } from "react";

const ModelViewerInner = forwardRef(({ src }, ref) => {
  return (
    <model-viewer
      ref={ref}
      src={src}
      ar
      ar-modes="scene-viewer webxr"
      environment-image="neutral"
      auto-rotate
      camera-controls
      className="w-full max-w-md h-[400px] bg-white rounded-lg shadow-md"
    />
  );
});

export default ModelViewerInner;
