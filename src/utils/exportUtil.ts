// 导出工具模块
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportAsPNG(container: HTMLElement, filename: string) {
  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${filename}.png`;
    link.click();
  } catch (error) {
    console.error('导出PNG失败:', error);
    throw error;
  }
}

export async function exportAsPDF(container: HTMLElement, filename: string) {
  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('导出PDF失败:', error);
    throw error;
  }
}
