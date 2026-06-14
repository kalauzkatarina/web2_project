import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function generateTravelPlanPdf(
    elementId: string,
    fileName: string
): Promise<void> {
    const element = document.getElementById(elementId);

    if (!element) {
        console.error(`Element with id '${elementId}' not found.`);
        return;
    }

    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fafaf9"
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);

    heightLeft -= pageHeight;

    while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
    }

    pdf.save(`${fileName}.pdf`);
}