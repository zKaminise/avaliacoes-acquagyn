
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LevelType } from "@/contexts/EvaluationContext";

// Map of level-specific images
const levelImages: Record<LevelType, string> = {
  "Baby": "/lovable-uploads/b010b562-710b-4584-ade3-716a6fba794f.png", // Star icon for Baby level
  "Adaptação": "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=100&h=100&fit=crop", 
  "Iniciação": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=100&h=100&fit=crop",
  "Aprendizagem 1": "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=100&h=100&fit=crop",
  "Aprendizagem 2": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=100&h=100&fit=crop",
  "Aprendizagem 3": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=100&h=100&fit=crop"
};

export const generateCertificate = async (
  studentName: string,
  currentLevel: LevelType,
  newLevel: LevelType
) => {
  // Create a temporary div to render the certificate content
  const element = document.createElement("div");
  element.className = "certificate-container";
  element.style.width = "1123px"; // A4 landscape width in pixels at 96 DPI
  element.style.height = "794px"; // A4 landscape height in pixels
  element.style.backgroundColor = "white";
  element.style.fontFamily = "Arial, sans-serif";
  element.style.position = "absolute";
  element.style.left = "-9999px";
  document.body.appendChild(element);

  // Current date
  const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  // Create the HTML content
  element.innerHTML = `
    <div style="width: 100%; height: 100%; position: relative; overflow: hidden;">
      <!-- Background image -->
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;">
        <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1123&h=794" 
             alt="Background" 
             style="width: 100%; height: 100%; object-fit: cover; opacity: 0.2;" />
      </div>
      
      <!-- Certificate border -->
      <div style="position: relative; z-index: 2; border: 12px double #0ea5e9; margin: 20px; height: calc(100% - 40px); 
                  display: flex; flex-direction: column; justify-content: space-between; padding: 30px; background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,249,255,0.9) 100%);">
        
        <!-- Header with logo -->
        <div style="display: flex; justify-content: center; margin-bottom: 20px;">
          <img src="/lovable-uploads/0d85c0da-2aab-4954-9e10-99368ef81b4e.png" alt="Acquagyn Logo" style="height: 80px; width: auto;" />
        </div>
        
        <!-- Title -->
        <div style="text-align: center; margin-bottom: 10px;">
          <h1 style="margin: 0; font-size: 42px; color: #0284c7; text-transform: uppercase; letter-spacing: 2px;">Certificado</h1>
          <div style="width: 200px; height: 3px; background-color: #0284c7; margin: 10px auto;"></div>
          <h2 style="margin: 10px 0; font-size: 22px; color: #0369a1; font-weight: normal;">Aprovação de Nível em Natação</h2>
        </div>
        
        <!-- Main content -->
        <div style="text-align: center; flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
          <p style="font-size: 18px; margin-bottom: 15px;">Certificamos que</p>
          <p style="font-size: 32px; font-weight: bold; color: #0284c7; margin: 15px 0;">${studentName}</p>
          <p style="font-size: 18px; margin: 15px 0;">concluiu com êxito o nível <strong>${currentLevel}</strong> e está aprovado para o nível <strong>${newLevel}</strong></p>
          
          <!-- Level progression visualization with icons and arrow -->
          <div style="display: flex; justify-content: center; align-items: center; margin: 30px 0;">
            <div style="text-align: center; margin-right: 20px;">
              <img src="${levelImages[currentLevel]}" alt="Nível ${currentLevel}" 
                   style="width: 80px; height: 80px; object-fit: contain; border-radius: 50%; border: 3px solid #0ea5e9; padding: 5px; background-color: white;" />
              <p style="margin: 10px 0 0 0; font-size: 16px;">${currentLevel}</p>
            </div>
            
            <div style="margin: 0 20px;">
              <div style="position: relative; width: 120px;">
                <div style="height: 3px; background-color: #0ea5e9; width: 100%;"></div>
                <div style="position: absolute; right: -10px; top: -8px; width: 0; height: 0; 
                            border-top: 10px solid transparent; border-bottom: 10px solid transparent; 
                            border-left: 15px solid #0ea5e9;"></div>
              </div>
            </div>
            
            <div style="text-align: center; margin-left: 20px;">
              <img src="${levelImages[newLevel]}" alt="Nível ${newLevel}" 
                   style="width: 80px; height: 80px; object-fit: contain; border-radius: 50%; border: 3px solid #0ea5e9; padding: 5px; background-color: white;" />
              <p style="margin: 10px 0 0 0; font-size: 16px;">${newLevel}</p>
            </div>
          </div>
          
          <!-- Award icon -->
          <div style="text-align: center; margin: 20px 0;">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
          </div>
        </div>
        
        <!-- Date and signature area -->
        <div style="margin-top: 30px;">
          <p style="text-align: center; font-size: 14px; margin-bottom: 30px;">${currentDate}</p>
          
          <div style="display: flex; justify-content: center;">
            <div style="width: 300px; text-align: center;">
              <div style="border-top: 1px solid #64748b;"></div>
              <p style="margin: 5px 0 0 0; font-size: 14px;">Assinatura do Instrutor</p>
            </div>
          </div>
        </div>
        
        <!-- Footer with serial number -->
        <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #64748b;">
          <p style="margin: 0;">Academia Acquagyn - Excelência em natação desde 2005</p>
          <p style="margin: 5px 0 0 0;">www.acquagyn.com.br | contato@acquagyn.com.br</p>
          <p style="margin: 5px 0 0 0;">Certificado #${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
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

    // Create PDF in landscape orientation
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Download the PDF
    pdf.save(`certificado_${studentName.replace(/\s+/g, '_').toLowerCase()}_${newLevel.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  } finally {
    // Remove the temporary element
    document.body.removeChild(element);
  }
};
