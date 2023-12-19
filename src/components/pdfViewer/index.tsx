import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
).toString();

const PDFViewer = () => (
    <Document file="/JunctionCert.pdf">
        <Page />
    </Document>
);

export default PDFViewer;
