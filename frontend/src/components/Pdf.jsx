import { pdfjs, Document, Page } from "react-pdf";
import { useEffect, useState } from "react";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Pdf({ src, onPageUpdate }) {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function nextPage() {
    setPageNumber((v) => ++v);
  }

  function prevPage() {
    setPageNumber((v) => --v);
  }

  useEffect(() => {
    onPageUpdate(pageNumber);
  }, [pageNumber]);

  return (
    <div className="w-fit h-full">
      <div className="flex flex-row justify-center gap-x-2 mb-0.5">
        <button onClick={prevPage} disabled={pageNumber <= 1}>
          Previous
        </button>
        <button onClick={nextPage} disabled={pageNumber >= (numPages ?? -1)}>
          Next
        </button>
      </div>
      <Document
        file={src}
        onLoadSuccess={onDocumentLoadSuccess}
        className="my-react-pdf"
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p className="font-medium">
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
}
