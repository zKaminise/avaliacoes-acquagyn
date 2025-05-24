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
  const element = document.createElement("div");
  element.className = "pdf-container";
  element.style.width = "795px"; 
  element.style.padding = "40px";
  element.style.backgroundColor = "white";
  element.style.fontFamily = "Arial, sans-serif";
  element.style.position = "absolute";
  element.style.left = "-9999px";
  document.body.appendChild(element);

  const levelActivities = activitiesMap[level];

  const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const activitiesPerPage = levelActivities.length > 7 ? Math.ceil(levelActivities.length / 2) : levelActivities.length;
  const needsPagination = levelActivities.length > 7;

  console.log(`Generating PDF with ${levelActivities.length} activities. Needs pagination: ${needsPagination}`);

  const createHeader = () => `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
      <div style="display: flex; align-items: center;">
        <img src="/lovable-uploads/0d85c0da-2aab-4954-9e10-99368ef81b4e.png" alt="Acquagyn Logo" style="height: 100px; width: auto;" />
      </div>
      <div style="text-align: right;">
        <p style="margin: 0; font-size: 14px;">${currentDate}</p>
      </div>
    </div>
  `;

  const createStudentInfo = () => `
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
  `;

  const createActivitiesTable = (activities: ActivityType[], startIndex: number = 0) => {
    return `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #0284c7; color: white;">
            <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1;">Atividade</th>
            <th style="padding: 10px; text-align: center; border: 1px solid #cbd5e1; width: 120px;">Avaliação</th>
          </tr>
        </thead>
        <tbody>
          ${activities.map((activity, index) => {
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
              <tr style="background-color: ${(startIndex + index) % 2 === 0 ? '#f8fafc' : '#ffffff'};">
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
    `;
  };

  const createSignatures = () => `
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
  `;

  const createFooter = () => `
    <div style="margin-top: 30px; border-top: 1px dashed #cbd5e1; padding-top: 15px; text-align: center; font-size: 12px; color: #64748b;">
      <p style="margin: 0;">Academia Acquagyn - Excelência em natação desde 2005</p>
      <p style="margin: 5px 0 0 0;">www.acquagyn.com.br | contato@acquagyn.com.br | (00) 0000-0000</p>
    </div>
  `;

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let pageNumber = 1;

    if (!needsPagination) {
      element.innerHTML = `
        <div style="padding: 20px; border: 2px solid #0ea5e9;">
          ${createHeader()}
          ${createStudentInfo()}
          ${createActivitiesTable(levelActivities)}
          ${createSignatures()}
          ${createFooter()}
        </div>
      `;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        height: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      console.log(`Single page - Canvas: ${canvas.width}x${canvas.height}, PDF: ${pdfWidth}x${pdfHeight}mm`);
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    } else {
      const firstPageActivities = levelActivities.slice(0, activitiesPerPage);
      const secondPageActivities = levelActivities.slice(activitiesPerPage);

      element.innerHTML = `
        <div style="padding: 20px; border: 2px solid #0ea5e9;">
          ${createHeader()}
          ${createStudentInfo()}
          ${createActivitiesTable(firstPageActivities, 0)}
          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #64748b;">
            Página 1 de 2
          </div>
        </div>
      `;

      let canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        height: element.scrollHeight
      });

      let imgData = canvas.toDataURL('image/png');
      let imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      console.log(`Page 1 - Canvas: ${canvas.width}x${canvas.height}, PDF: ${pdfWidth}x${pdfHeight}mm`);
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      pdf.addPage();
      pageNumber++;

      element.innerHTML = `
        <div style="padding: 20px; border: 2px solid #0ea5e9;">
          ${createHeader()}
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #0284c7; margin: 0; font-size: 16px;">Continuação - Avaliação de ${studentInfo.name}</h3>
          </div>
          ${createActivitiesTable(secondPageActivities, activitiesPerPage)}
          ${createSignatures()}
          ${createFooter()}
          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #64748b;">
            Página 2 de 2
          </div>
        </div>
      `;

      canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        height: element.scrollHeight
      });

      imgData = canvas.toDataURL('image/png');
      imgProps = pdf.getImageProperties(imgData);
      pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      console.log(`Page 2 - Canvas: ${canvas.width}x${canvas.height}, PDF: ${pdfWidth}x${pdfHeight}mm`);
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }
    
    console.log(`PDF generation completed with ${pageNumber} page(s)`);
    
    pdf.save(`avaliacao_${level.replace(/\s+/g, '_').toLowerCase()}_${studentInfo.name.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  } finally {
    document.body.removeChild(element);
  }
};
