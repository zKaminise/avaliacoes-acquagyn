
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ActivityType, LevelType, ActivityRatingType, StudentInfoType } from "@/contexts/EvaluationContext";
import { levelImages } from "./levelImages";


export const generatePDF = async (
  level: LevelType,
  studentInfo: StudentInfoType,
  activityRatings: ActivityRatingType[],
  activitiesMap: Record<LevelType, ActivityType[]>
) => {
  // Create a temporary div to render the PDF content
  const element = document.createElement("div");
  element.className = "pdf-container";
  element.style.width = "795px"; // A4 width in pixels at 96 DPI
  element.style.padding = "40px";
  element.style.backgroundColor = "white";
  element.style.fontFamily = "Arial, sans-serif";
  element.style.position = "absolute";
  element.style.left = "-9999px";
  document.body.appendChild(element);

  // Get the activities for this level
  const levelActivities = activitiesMap[level];

  // Current date
  const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  // Create the HTML content
  element.innerHTML = `
    <div style="padding: 20px; border: 2px solid #0ea5e9;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
        <div style="display: flex; align-items: center;">
          <img src="/lovable-uploads/0d85c0da-2aab-4954-9e10-99368ef81b4e.png" alt="Acquagyn Logo" style="height: 100px; width: auto;" />
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; font-size: 14px;">Data: ${currentDate}</p>
        </div>
      </div>
      
      <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #0284c7; margin: 0 0 10px 0; font-size: 18px;">Avaliação de Desempenho - Nível ${level}</h2>
        
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 15px;">
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <p style="margin: 0; font-size: 14px;"><strong>Nome:</strong> ${studentInfo.name}</p>
            <p style="margin: 0; font-size: 14px;"><strong>Idade:</strong> ${studentInfo.age}</p>
            <p style="margin: 0; font-size: 14px;"><strong>Professor:</strong> ${studentInfo.teacher}</p>
          </div>
          <div>
            <img src="${levelImages[level]}" alt="Nível ${level}" style="width: 80px; height: 80px; object-fit: contain;" />
          </div>
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #0284c7; color: white;">
            <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1;">Atividade</th>
            <th style="padding: 10px; text-align: center; border: 1px solid #cbd5e1; width: 120px;">Avaliação</th>
          </tr>
        </thead>
        <tbody>
          ${levelActivities.map((activity, index) => {
            const rating = activityRatings.find(r => r.activityId === activity.id);
            let bgColor = "#ffffff";
            let textColor = "#000000";
            
            if (rating) {
              switch(rating.rating) {
                case "Não Atingido": 
                  bgColor = "#fee2e2"; 
                  textColor = "#dc2626"; 
                  break;
                case "Parcialmente Atingido": 
                  bgColor = "#fef9c3"; 
                  textColor = "#ca8a04"; 
                  break;
                case "Totalmente Atingido": 
                  bgColor = "#dbeafe"; 
                  textColor = "#2563eb"; 
                  break;
              }
            }
            
            return `
              <tr style="background-color: ${index % 2 === 0 ? '#f8fafc' : '#ffffff'};">
                <td style="padding: 10px; border: 1px solid #cbd5e1;">
                  <p style="margin: 0; font-weight: bold;">${activity.name}</p>
                  <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b;">${activity.description}</p>
                  ${rating?.observation ? `<p style="margin: 5px 0 0 0; font-style: italic; font-size: 12px;">Obs: ${rating.observation}</p>` : ''}
                </td>
                <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: center; background-color: ${bgColor}; color: ${textColor}; font-weight: bold;">
                  ${rating?.rating || ''}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
      
      <div style="display: flex; justify-content: space-between; margin-top: 40px;">
        <div style="width: 45%; text-align: center;">
          <p style="margin: 0; font-size: 14px;">${studentInfo.teacher}</p>
          <div style="border-top: 1px solid #64748b; margin-top: 5px;"></div>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Professor</p>
        </div>
        <div style="width: 45%; text-align: center;">
          <p style="margin: 0; font-size: 14px;">Ciente e de acordo com as avaliações acima</p>
          <div style="border-top: 1px solid #64748b; margin-top: 5px;"></div>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Responsável</p>
        </div>
      </div>
      
      <div style="margin-top: 30px; border-top: 1px dashed #cbd5e1; padding-top: 15px; text-align: center; font-size: 12px; color: #64748b;">
        <p style="margin: 0;">Academia Acquagyn - Excelência em natação desde 2005</p>
        <p style="margin: 5px 0 0 0;">www.acquagyn.com.br | contato@acquagyn.com.br | (00) 0000-0000</p>
      </div>
    </div>
  `;

  try {
    // Convert the HTML to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Download the PDF
    pdf.save(`avaliacao_${level.replace(/\s+/g, '_').toLowerCase()}_${studentInfo.name.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  } finally {
    // Remove the temporary element
    document.body.removeChild(element);
  }
};