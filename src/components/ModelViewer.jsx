import dynamic from "next/dynamic";

const ModelViewer = dynamic(() => import("./ModelViewerInner"), {
  ssr: false,
});

export default ModelViewer;
