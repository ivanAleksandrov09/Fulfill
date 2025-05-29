import { pdfjs, Document, Page } from "react-pdf";
import { useEffect, useState, useMemo } from "react";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function Pdf({ src, onPageUpdate }) {
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

export function PdfThumbnail({ src }) {
  // memoise the options because they never change and
  // react kept throwing warnings to do so
  // (they keep causing unnecessary rerenders)
  const options = useMemo(
    () => ({
      disableAutoFetch: true,
      disableStream: true,
      disableRange: true,
    }),
    []
  );

  return (
    <div className="w-fit h-full">
      <div className="flex flex-row justify-center gap-x-2 mb-0.5">
        <Document file={src} options={options}>
          <Page width={150} pageNumber={1} />
        </Document>
      </div>
    </div>
  );
}
