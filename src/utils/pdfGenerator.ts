import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ActivityType, LevelType, ActivityRatingType, StudentInfoType } from "@/contexts/EvaluationContext";
import { levelImages } from "./levelImages";

// Updated color scheme for each level according to user specifications
const levelColors: Record<LevelType, { primary: string; secondary: string; accent: string }> = {
  "Baby 1": { primary: "#FFD700", secondary: "#FFFACD", accent: "#FFA500" }, // Yellow
  "Baby 2": { primary: "#FFD700", secondary: "#FFFACD", accent: "#FF8C00" }, // Yellow with Orange
  "Baby 3": { primary: "#FFD700", secondary: "#FFFACD", accent: "#1E90FF" }, // Yellow with Blue
  "Adaptação": { primary: "#FF8C00", secondary: "#FFE4B5", accent: "#FF7F50" }, // Orange
  "Iniciação": { primary: "#32CD32", secondary: "#F0FFF0", accent: "#228B22" }, // Green
  "Aperfeiçoamento 1": { primary: "#1E90FF", secondary: "#E6F3FF", accent: "#0066CC" }, // Blue
  "Aperfeiçoamento 2": { primary: "#DC143C", secondary: "#FFE4E1", accent: "#B22222" }, // Red
  "Aperfeiçoamento 3": { primary: "#9370DB", secondary: "#F8F0FF", accent: "#8A2BE2" } // Purple/Lilac
};

export const generatePDF = async (
  level: LevelType,
  studentInfo: StudentInfoType,
  activityRatings: ActivityRatingType[],
  activitiesMap: Record<LevelType, ActivityType[]>
) => {
  const element = document.createElement("div");
  element.style.cssText = `
    width: 210mm;
    min-height: 297mm;
    padding: 0;
    margin: 0;
    background: white;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
    position: absolute;
    left: -9999px;
    top: 0;
    font-size: 14px;
    line-height: 1.5;
  `;
  document.body.appendChild(element);

  const levelActivities = activitiesMap[level];
  const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const colors = levelColors[level];
  
  const activitiesPerPage = 6; // Changed from 8 to 6
  const totalPages = Math.ceil(levelActivities.length / activitiesPerPage);

  const getRatingConfig = (rating: string) => {
    const configs = {
      "Totalmente Atingido": { 
        color: "#22C55E", 
        bg: "#DCFCE7", 
        label: "Totalmente Atingido" 
      },
      "Parcialmente Atingido": { 
        color: "#F59E0B", 
        bg: "#FEF3C7", 
        label: "Parcialmente Atingido" 
      },
      "Não Atingido": { 
        color: "#EF4444", 
        bg: "#FEE2E2", 
        label: "Não Atingido" 
      },
      default: { 
        color: "#9CA3AF", 
        bg: "#F3F4F6", 
        label: "Não Avaliado" 
      }
    };
    return configs[rating] || configs.default;
  };

  const createHeader = (pageNumber: number = 1) => `
    <div style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%); padding: 40px 30px; margin: 0; border-radius: 0;">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 30px;">
        
        <!-- Logo Section -->
        <div style="flex-shrink: 0;">
          <div style="background: white; padding: 15px; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.15);">
            <img src="/lovable-uploads/0d85c0da-2aab-4954-9e10-99368ef81b4e.png" 
                 alt="Academia Acquagyn" 
                 style="height: 60px; width: auto; display: block;" />
          </div>
        </div>

        <!-- Title Section -->
        <div style="flex: 1; text-align: center; color: white;">
          <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            AVALIAÇÃO PEDAGÓGICA
          </h1>
          <p style="margin: 0; font-size: 16px; font-weight: 500; opacity: 0.95; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
            Academia Acquagyn - Natação Infantil
          </p>
        </div>

        <!-- Level Badge -->
        <div style="flex-shrink: 0;">
          <div style="background: white; border-radius: 20px; padding: 20px; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.15); min-width: 140px;">
            <img src="${levelImages[level]}" 
                 alt="${level}" 
                 style="width: 70px; height: 70px; object-fit: contain; margin: 0 auto 12px auto; display: block;" />
            <div style="font-size: 14px; font-weight: 700; color: ${colors.primary}; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
              ${level}
            </div>
            <div style="font-size: 11px; color: #6B7280; margin: 4px 0 0 0; font-weight: 500;">
              ${currentDate}
            </div>
          </div>
        </div>
      </div>
      
      ${totalPages > 1 ? `
        <div style="text-align: center; margin-top: 25px;">
          <div style="display: inline-block; background: rgba(255,255,255,0.15); padding: 8px 20px; border-radius: 20px; color: white; font-size: 14px; font-weight: 600;">
            Página ${pageNumber} de ${totalPages}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  const createStudentInfo = () => `
    <div style="margin: 30px; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border: 1px solid #E5E7EB;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, ${colors.secondary} 0%, white 100%); padding: 24px 30px; border-bottom: 1px solid #E5E7EB;">
        <h2 style="margin: 0; color: ${colors.primary}; font-size: 20px; font-weight: 700; text-align: center; text-transform: uppercase; letter-spacing: 1px;">
          Informações do Aluno
        </h2>
      </div>

      <!-- Content -->
      <div style="padding: 30px;">
        <div style="display: grid; grid-template-columns: 2fr 1fr 2fr; gap: 30px; align-items: center;">
          
          <div style="text-align: center;">
            <div style="color: ${colors.primary}; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
              Nome Completo
            </div>
            <div style="background: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 8px; padding: 16px; font-size: 16px; font-weight: 600; color: #1F2937; min-height: 20px;">
              ${studentInfo.name || '____________________'}
            </div>
          </div>

          <div style="text-align: center;">
            <div style="color: ${colors.primary}; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
              Idade
            </div>
            <div style="background: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 8px; padding: 16px; font-size: 16px; font-weight: 600; color: #1F2937; min-height: 20px;">
              ${studentInfo.age || '___'}
            </div>
          </div>

          <div style="text-align: center;">
            <div style="color: ${colors.primary}; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
              Professor(a)
            </div>
            <div style="background: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 8px; padding: 16px; font-size: 16px; font-weight: 600; color: #1F2937; min-height: 20px;">
              ${studentInfo.teacher || '____________________'}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const createActivitiesGrid = (activities: ActivityType[], startIndex: number = 0) => `
    <div style="margin: 0 30px 30px 30px;">
      
      <!-- Section Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="margin: 0; color: ${colors.primary}; font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
          Atividades Avaliadas
        </h2>
        <div style="width: 80px; height: 4px; background: ${colors.primary}; margin: 12px auto 0 auto; border-radius: 2px;"></div>
      </div>

      <!-- Activities Grid -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
        ${activities.map((activity, index) => {
          const rating = activityRatings.find(r => r.activityId === activity.id);
          const ratingConfig = getRatingConfig(rating?.rating || "");
          const activityNumber = startIndex + index + 1;
          
          return `
            <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #E5E7EB; box-shadow: 0 2px 12px rgba(0,0,0,0.05); position: relative; min-height: 180px;">
              
              <!-- Activity Number - Just text without # symbol -->
              <div style="position: absolute; top: 12px; left: 12px; color: ${colors.primary}; font-size: 18px; font-weight: 800; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">
                ${activityNumber}
              </div>

              <!-- Content -->
              <div style="margin-top: 40px;">
                <h3 style="margin: 0 0 12px 0; color: ${colors.primary}; font-size: 16px; font-weight: 700; line-height: 1.3;">
                  ${activity.name}
                </h3>
                
                <p style="margin: 0 0 16px 0; color: #6B7280; font-size: 13px; line-height: 1.4; font-weight: 500;">
                  ${activity.description}
                </p>

                <!-- Status Badge -->
                <div style="background: ${ratingConfig.bg}; border: 1px solid ${ratingConfig.color}; border-radius: 8px; padding: 12px; text-align: center;">
                  <div style="color: ${ratingConfig.color}; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${ratingConfig.label}
                  </div>
                </div>

                ${rating?.observation ? `
                  <div style="margin-top: 12px; padding: 10px; background: #F3F4F6; border-radius: 6px; border-left: 3px solid ${colors.primary};">
                    <div style="color: #374151; font-size: 10px; line-height: 1.4; font-weight: 500;">
                      <span style="color: ${colors.primary}; font-weight: 700;">Obs:</span> ${rating.observation}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  const createFooter = () => `
    <div style="margin: 40px 30px 30px 30px;">
      
      <!-- Signatures -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div style="width: 45%; text-align: center;">
          <div style="border-bottom: 2px solid ${colors.primary}; height: 50px; margin-bottom: 12px; position: relative;">
            <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 60px; height: 4px; background: ${colors.primary}; border-radius: 2px;"></div>
          </div>
          <div style="color: ${colors.primary}; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
            Assinatura do Professor
          </div>
          <div style="color: #6B7280; font-size: 12px; font-weight: 500;">
            ${studentInfo.teacher}
          </div>
        </div>

        <div style="width: 45%; text-align: center;">
          <div style="border-bottom: 2px solid ${colors.primary}; height: 50px; margin-bottom: 12px; position: relative;">
            <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 60px; height: 4px; background: ${colors.primary}; border-radius: 2px;"></div>
          </div>
          <div style="color: ${colors.primary}; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
            Assinatura do Responsável
          </div>
          <div style="color: #6B7280; font-size: 12px; font-weight: 500;">
            Data: ___/___/______
          </div>
        </div>
      </div>

      <!-- Motivational Footer -->
      <div style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%); border-radius: 12px; padding: 20px; text-align: center; color: white;">
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 6px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
          🏊‍♀️ Continue nadando em direção aos seus sonhos! 🏊‍♂️
        </div>
        <div style="font-size: 12px; opacity: 0.9; font-weight: 500;">
          Academia Acquagyn - Transformando vidas através da natação
        </div>
      </div>
    </div>
  `;

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');

    if (totalPages === 1) {
      element.innerHTML = `
        <div style="min-height: 297mm; background: #FAFBFC;">
          ${createHeader()}
          ${createStudentInfo()}
          ${createActivitiesGrid(levelActivities)}
          ${createFooter()}
        </div>
      `;

      const canvas = await html2canvas(element, {
        scale: 4.0, // Increased from 2.0 to 4.0 for much better quality
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#FAFBFC',
        width: element.offsetWidth,
        height: element.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.offsetWidth,
        windowHeight: element.offsetHeight,
        imageTimeout: 0,
        removeContainer: false
      });

      const imgData = canvas.toDataURL('image/png', 1.0); // Maximum quality
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST'); // Added compression method
    } else {
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const startIndex = (pageNum - 1) * activitiesPerPage;
        const endIndex = Math.min(startIndex + activitiesPerPage, levelActivities.length);
        const pageActivities = levelActivities.slice(startIndex, endIndex);

        element.innerHTML = `
          <div style="min-height: 297mm; background: #FAFBFC;">
            ${createHeader(pageNum)}
            ${pageNum === 1 ? createStudentInfo() : ''}
            ${createActivitiesGrid(pageActivities, startIndex)}
            ${pageNum === totalPages ? createFooter() : ''}
          </div>
        `;

        const canvas = await html2canvas(element, {
          scale: 4.0, // Increased from 2.0 to 4.0 for much better quality
          useCORS: true,
          allowTaint: false,
          logging: false,
          backgroundColor: '#FAFBFC',
          width: element.offsetWidth,
          height: element.offsetHeight,
          scrollX: 0,
          scrollY: 0,
          windowWidth: element.offsetWidth,
          windowHeight: element.offsetHeight,
          imageTimeout: 0,
          removeContainer: false
        });

        const imgData = canvas.toDataURL('image/png', 1.0); // Maximum quality
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        if (pageNum > 1) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST'); // Added compression method
      }
    }
    
    console.log(`PDF de alta qualidade gerado com ${totalPages} página(s) para o nível ${level}`);
    
    pdf.save(`avaliacao_${level.replace(/\s+/g, '_').toLowerCase()}_${studentInfo.name.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  } finally {
    document.body.removeChild(element);
  }
};
