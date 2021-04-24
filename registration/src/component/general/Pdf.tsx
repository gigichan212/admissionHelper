//@ts-ignore
import PDFDocument from "@react-pdf/pdfkit";
import blobStream from "blob-stream";

export default function ExportPdfComponent() {
  const jsPdfGenerator = async () => {
    // fetch font and create buffer
    const res = await fetch(
      `${process.env.REACT_APP_FRONTEND_HOST}/fonts/PingFang-Regular.ttf`
    );
    const fontBlob = await res.arrayBuffer();
    const buffer = Buffer.from(fontBlob);

    // create pdf
    const doc = new PDFDocument();
    const stream = doc.pipe(blobStream());
    doc.registerFont("PingFang", buffer);

    // draw some text
    doc.fontSize(25).text("Here is some vector graphics...", 100, 80);

    // some vector graphics
    doc
      .save()
      .moveTo(100, 150)
      .lineTo(100, 250)
      .lineTo(200, 250)
      .fill("#FF3300");
    doc.addPage();

    doc.font("PingFang").text("香港...");

    doc.end();
    stream.on("finish", function () {
      // or get a blob URL for display in the browser
      const url = stream.toBlobURL("application/pdf");
      window.location.href = url;
    });
  };
  return (
    <button
      onClick={() => {
        jsPdfGenerator();
      }}
    >
      {" "}
      Generate PDF{" "}
    </button>
  );
}
