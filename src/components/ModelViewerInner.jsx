import "@google/model-viewer";
import { useRef } from "react";

export default function ModelViewerInner({ src }) {
  const modelRef = useRef();

  return (
    <div className="flex flex-col items-center">
      <model-viewer
        ref={modelRef}
        src={src}
        ar
        ar-modes="scene-viewer webxr"
        environment-image="neutral"
        auto-rotate
        camera-controls
        className="w-full max-w-lg h-[390px] rounded-lg"
      />
    </div>
  );
}
