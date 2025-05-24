import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LevelType } from "@/contexts/EvaluationContext";
import { levelImages } from "./levelImages";

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
  element.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  element.style.position = "absolute";
  element.style.left = "-9999px";
  document.body.appendChild(element);

  // Current date
  const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  // Generate a unique certificate ID
  const certificateId = Math.random().toString(36).substr(2, 9).toUpperCase();

  // Create the HTML content with improved design inspired by the uploaded certificate
  element.innerHTML = `
    <div style="width: 100%; height: 100%; position: relative; overflow: hidden;">
      <!-- Background with gradient overlay similar to the uploaded certificate -->
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                    background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 30%, #80deea 60%, #4dd0e1 100%);"></div>
      </div>
      
      <!-- Certificate content -->
      <div style="position: relative; z-index: 3; border: 3px solid #0277bd; border-radius: 12px; margin: 24px; height: calc(100% - 48px); 
                display: flex; flex-direction: column; justify-content: space-between; padding: 30px; 
                background-color: rgba(255, 255, 255, 0.85);">
        
        <!-- Level images in corners like the stars in the example -->
        <div style="position: absolute; top: -15px; left: -15px; width: 70px; height: 70px;">
          <img src="${levelImages[currentLevel]}" alt="Level" style="width: 100%; height: 100%;" />
        </div>
        <div style="position: absolute; top: -15px; right: -15px; width: 70px; height: 70px;">
          <img src="${levelImages[newLevel]}" alt="Level" style="width: 100%; height: 100%;" />
        </div>
        <div style="position: absolute; bottom: -15px; left: -15px; width: 70px; height: 70px;">
          <img src="${levelImages[currentLevel]}" alt="Level" style="width: 100%; height: 100%;" />
        </div>
        <div style="position: absolute; bottom: -15px; right: -15px; width: 70px; height: 70px;">
          <img src="${levelImages[newLevel]}" alt="Level" style="width: 100%; height: 100%;" />
        </div>
        
        <!-- Title with improved typography -->
        <div style="text-align: center; margin-bottom: 10px; margin-top: 20px;">
          <h1 style="margin: 0; font-size: 46px; color: #01579b; text-transform: uppercase; letter-spacing: 3px; 
                     font-weight: 800; text-shadow: 1px 1px 1px rgba(0,0,0,0.1);">Certificado de Conclusão</h1>
          <div style="width: 80%; height: 2px; background: linear-gradient(90deg, rgba(255,255,255,0) 0%, #01579b 50%, rgba(255,255,255,0) 100%); 
                      margin: 20px auto;"></div>
        </div>
        
        <!-- Main content -->
        <div style="text-align: center; flex-grow: 1; display: flex; flex-direction: column; justify-content: center; padding: 0 30px;">
          <p style="font-size: 20px; margin-bottom: 20px; color: #01579b;">
            A Academia <strong>Acquagyn</strong> certifica que o(a) aluno(a)
          </p>
          <p style="font-size: 42px; font-weight: bold; color: #01579b; margin: 20px 0; font-family: cursive; 
                    text-shadow: 1px 1px 1px rgba(0,0,0,0.05);">${studentName}</p>
          <p style="font-size: 20px; margin: 20px 0 30px; color: #01579b;">
            concluiu com êxito o nível <strong>${currentLevel}</strong> 
            e está aprovado para o nível <strong>${newLevel}</strong>
            no dia ${currentDate}.
          </p>
          
          <!-- Level progression visualization with improved styling -->
          <div style="display: flex; justify-content: center; align-items: center; margin: 20px 0;">
            <div style="text-align: center; margin-right: 25px;">
              <div style="background: white; border-radius: 50%; padding: 5px; box-shadow: 0 4px 12px rgba(1,87,155,0.2); 
                          border: 3px solid #01579b; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                <img src="${levelImages[currentLevel]}" alt="Nível ${currentLevel}" 
                     style="width: 80px; height: 80px; object-fit: contain;" />
              </div>
              <p style="margin: 12px 0 0 0; font-size: 18px; font-weight: 600; color: #01579b;">${currentLevel}</p>
            </div>
            
            <div style="margin: 0 20px;">
              <div style="position: relative; width: 120px;">
                <div style="height: 4px; background: linear-gradient(90deg, #0277bd, #039be5); width: 100%;"></div>
                <div style="position: absolute; right: -12px; top: -9px; width: 0; height: 0; 
                            border-top: 11px solid transparent; border-bottom: 11px solid transparent; 
                            border-left: 16px solid #039be5;"></div>
              </div>
            </div>
            
            <div style="text-align: center; margin-left: 25px;">
              <div style="background: white; border-radius: 50%; padding: 5px; box-shadow: 0 4px 12px rgba(1,87,155,0.2); 
                          border: 3px solid #01579b; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                <img src="${levelImages[newLevel]}" alt="Nível ${newLevel}" 
                     style="width: 80px; height: 80px; object-fit: contain;" />
              </div>
              <p style="margin: 12px 0 0 0; font-size: 18px; font-weight: 600; color: #01579b;">${newLevel}</p>
            </div>
          </div>
        </div>
        
        <!-- Signature area with improved layout -->
        <div style="margin-top: 40px; display: flex; justify-content: space-around;">
          <div style="width: 200px; text-align: center;">
            <div style="border-top: 1.5px solid #01579b;"></div>
            <p style="margin: 8px 0 0 0; font-size: 16px; color: #01579b;">Professor(a)</p>
          </div>
          
          <div style="width: 200px; text-align: center;">
            <div style="border-top: 1.5px solid #01579b;"></div>
            <p style="margin: 8px 0 0 0; font-size: 16px; color: #01579b;">Diretor(a)</p>
          </div>
        </div>
        
        <!-- Footer with certificate ID and contact info -->
        <div style="margin-top: 20px; text-align: center; font-size: 13px; color: #0277bd;">
          <p style="margin: 0;">Academia Acquagyn - Excelência em natação desde 2005</p>
          <div style="display: flex; justify-content: center; align-items: center; margin-top: 8px;">
            <p style="margin: 0 8px;">www.acquagyn.com.br</p>
            <div style="width: 4px; height: 4px; background-color: #0277bd; border-radius: 50%;"></div>
            <p style="margin: 0 8px;">contato@acquagyn.com.br</p>
          </div>
          <p style="margin: 8px 0 0 0; font-weight: 600; letter-spacing: 0.5px;">Certificado #${certificateId}</p>
        </div>
      </div>
    </div>
  `;

  try {
    // Convert the HTML to canvas with better quality
    const canvas = await html2canvas(element, {
      scale: 3.0, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    // Create PDF in landscape orientation with better quality
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Download the PDF with improved filename
    pdf.save(`certificado_${studentName.replace(/\s+/g, '_').toLowerCase()}_${newLevel.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  } finally {
    // Remove the temporary element
    document.body.removeChild(element);
  }
};
