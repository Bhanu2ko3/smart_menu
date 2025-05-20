import "@google/model-viewer";

export default function ModelViewerInner({ src }) {
  return (
    <model-viewer
      src={src}
      ar
      ar-modes="scene-viewer webxr"
      environment-image="neutral"
      auto-rotate
      camera-controls
      className="w-full max-w-md h-[400px] bg-white rounded-lg shadow-md"
    />
  );
}
