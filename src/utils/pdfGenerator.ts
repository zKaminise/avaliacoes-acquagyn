
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ActivityType,
  LevelType,
  ActivityRatingType,
  StudentInfoType,
} from "@/contexts/EvaluationContext";
import { levelImages } from "./levelImages";

// Updated color scheme for each level according to user specifications
const levelColors: Record<
  LevelType,
  { primary: string; secondary: string; accent: string }
> = {
  "Baby 1": { primary: "#FFD700", secondary: "#FFFACD", accent: "#FFA500" }, // Yellow
  "Baby 2": { primary: "#FFD700", secondary: "#FFFACD", accent: "#FF8C00" }, // Yellow with Orange
  "Baby 3": { primary: "#FFD700", secondary: "#FFFACD", accent: "#1E90FF" }, // Yellow with Blue
  Adaptação: { primary: "#FF8C00", secondary: "#FFE4B5", accent: "#FF7F50" }, // Orange
  Iniciação: { primary: "#32CD32", secondary: "#F0FFF0", accent: "#228B22" }, // Green
  "Aperfeiçoamento 1": {
    primary: "#1E90FF",
    secondary: "#E6F3FF",
    accent: "#0066CC",
  }, // Blue
  "Aperfeiçoamento 2": {
    primary: "#DC143C",
    secondary: "#FFE4E1",
    accent: "#B22222",
  }, // Red
  "Aperfeiçoamento 3": {
    primary: "#9370DB",
    secondary: "#F8F0FF",
    accent: "#8A2BE2",
  }, // Purple/Lilac
};

// Level-specific objectives
const levelObjectives: Record<LevelType, string> = {
  "Baby 1":
    "Adaptação ao meio aquático, flutuação com apoio, movimentação básica e primeiros estímulos respiratórios com acompanhante.",
  "Baby 2":
    "Desenvolvimento da confiança na água, submersão facial voluntária, equilíbrio e propulsão inicial com assistência.",
  "Baby 3":
    "Autonomia básica na água, submersão independente, flutuação sem assistência e propulsão coordenada das pernas.",
  Adaptação:
    "Entrada independente na água, submersão facial, flutuação com apoio mínimo e deslocamento básico com segurança.",
  Iniciação:
    "Submersão completa, flutuação independente, pern ada de crawl básica e respiração lateral inicial coordenada.",
  "Aperfeiçoamento 1":
    "Nado crawl e costas básicos, mergulho da borda, respiração bilateral e percurso de 12,5 metros.",
  "Aperfeiçoamento 2":
    "Crawl com respiração coordenada, costas completo, introdução ao peito, saída de bloco e 25 metros.",
  "Aperfeiçoamento 3":
    "Técnicas refinadas de crawl e costas, peito completo, introdução ao borboleta e percurso de 50 metros.",
};

export const generatePDF = async (
  level: LevelType,
  studentInfo: StudentInfoType,
  activityRatings: ActivityRatingType[],
  activitiesMap: Record<LevelType, ActivityType[]>
) => {
  const element = document.createElement("div");
  element.style.cssText = `
    width: 1100px;
    min-height: 780px;
    padding: 0;
    margin: 0;
    background: white;
    font-family: 'Arial', sans-serif;
    position: absolute;
    left: -9999px;
    top: 0;
    font-size: 12pt;
    line-height: 1.4;
  `;
  document.body.appendChild(element);

  const levelActivities = activitiesMap[level];
  const currentDate = format(new Date(), "dd/MM/yyyy");
  const colors = levelColors[level];

  const activitiesPerPage = 12;
  const totalPages = Math.ceil(levelActivities.length / activitiesPerPage);

  const getRatingConfig = (rating: string) => {
    const configs = {
      "Totalmente Atingido": {
        color: "#ffffff",
        bg: "#10b981",
        label: "TOTALMENTE ATINGIDO",
      },
      "Parcialmente Atingido": {
        color: "#ffffff", 
        bg: "#f59e0b",
        label: "PARCIALMENTE ATINGIDO",
      },
      "Não Atingido": {
        color: "#ffffff",
        bg: "#ef4444",
        label: "NÃO ATINGIDO",
      },
      default: {
        color: "#6b7280",
        bg: "#f3f4f6",
        label: "NÃO AVALIADO",
      },
    };
    return configs[rating] || configs.default;
  };

  const createHeader = (pageNumber: number = 1) => `
    <div style="padding: 20px; border-bottom: 3px solid ${colors.primary}; position: relative; z-index: 10;">
      
      <!-- Simple title -->
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 20pt; font-weight: bold; color: ${colors.primary};">
          AVALIAÇÃO PEDAGÓGICA
        </h1>
      </div>
      
      <!-- Header with logo and level info -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
        
        <!-- Left side - Academy logo (increased size) -->
        <div>
          <img src="/lovable-uploads/0d85c0da-2aab-4954-9e10-99368ef81b4e.png" 
               alt="Academia Acquagyn" 
               style="height: 120px; width: auto;" />
        </div>

        <!-- Right side - Level info -->
        <div style="max-width: 400px; text-align: right;">
          <div style="display: flex; align-items: center; justify-content: flex-end; margin-bottom: 10px;">
            <div style="margin-right: 10px;">
              <img src="${levelImages[level]}" 
                   alt="${level}" 
                   style="width: 80px; height: 80px; object-fit: contain;" />
            </div>
          </div>
          <div style="font-size: 9pt; color: #666; line-height: 1.3; text-align: right;">
            <strong>Objetivos:</strong> ${levelObjectives[level]}
          </div>
        </div>
      </div>
      
      <!-- Student info section -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 20px; font-size: 11pt;">
        
        <div>
          <strong style="color: #000000; font-weight: bold;">Nome:</strong> 
          <div style="margin-top: 2px; color: #333;">${studentInfo.name || ""}</div>
        </div>
        
        <div>
          <strong style="color: #000000; font-weight: bold;">Idade:</strong> 
          <div style="margin-top: 2px; color: #333;">${studentInfo.age || ""}</div>
        </div>
        
        <div>
          <strong style="color: #000000; font-weight: bold;">Data:</strong> 
          <div style="margin-top: 2px; color: #333;">${currentDate}</div>
        </div>
        
        <div>
          <strong style="color: #000000; font-weight: bold;">Professor:</strong> 
          <div style="margin-top: 2px; color: #333;">${studentInfo.teacher || ""}</div>
        </div>
      </div>
      
      ${
        totalPages > 1
          ? `
        <div style="text-align: center; margin-top: 10px; font-size: 10pt; color: #666;">
          Página ${pageNumber} de ${totalPages}
        </div>
      `
          : ""
      }
    </div>
  `;

  const createActivitiesSection = (
    activities: ActivityType[],
    startIndex: number = 0
  ) => `
    <div style="padding: 20px; position: relative; z-index: 10;">
      
      <!-- Activities list -->
      <div style="display: flex; flex-direction: column; gap: 12px; position: relative; z-index: 2;">
        ${activities
          .map((activity, index) => {
            const rating = activityRatings.find(
              (r) => r.activityId === activity.id
            );
            const ratingConfig = getRatingConfig(rating?.rating || "");

            return `
            <div style="padding: 15px; border: 1px solid rgba(221, 221, 221, 0.3); border-left: 4px solid ${colors.primary}; background: rgba(255, 255, 255, 0.3);">
              
              <!-- Activity content -->
              <div style="display: flex; justify-content: space-between; align-items: center;">
                
                <!-- Activity text -->
                <div style="flex: 1;">
                  <div style="font-size: 11pt; line-height: 1.4; font-weight: bold; color: #333;">
                    ${activity.name}
                  </div>
                </div>

                <!-- Rating badge with border radius -->
                <div style="margin-left: 15px; flex-shrink: 0;">
                  <div style="padding: 8px 12px; background: ${
                    ratingConfig.bg
                  }; color: ${
              ratingConfig.color
            }; font-size: 9pt; font-weight: 600; text-align: center; border-radius: 8px;">
                    ${ratingConfig.label}
                  </div>
                </div>
              </div>

              <!-- Observation section -->
              ${
                rating?.observation
                  ? `
                <div style="margin-top: 10px; background: rgba(248, 249, 250, 0.4); padding: 10px; border-left: 3px solid ${colors.primary};">
                  <div style="font-size: 8pt; font-weight: 600; color: ${colors.primary}; margin-bottom: 4px;">OBSERVAÇÃO:</div>
                  <div style="font-size: 9pt; color: #555; line-height: 1.3;">${rating.observation}</div>
                </div>
              `
                  : ""
              }
            </div>
          `;
          })
          .join("")}
      </div>
    </div>
  `;

  const createFooter = () => ``; // Empty footer since concepts section is removed

  try {
    const pdf = new jsPDF("l", "mm", "a4");

    if (totalPages === 1) {
      element.innerHTML = `
        <div style="min-height: 210mm; background: white; position: relative;">
          <!-- Level icon as full background -->
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.15; z-index: 1; display: flex; align-items: center; justify-content: center;">
            <img src="${levelImages[level]}" 
                 alt="${level}" 
                 style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
          
          ${createHeader()}
          ${createActivitiesSection(levelActivities)}
          ${createFooter()}
        </div>
      `;

      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "white",
        width: element.offsetWidth,
        height: element.offsetHeight,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, "", "FAST");
    } else {
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const startIndex = (pageNum - 1) * activitiesPerPage;
        const endIndex = Math.min(
          startIndex + activitiesPerPage,
          levelActivities.length
        );
        const pageActivities = levelActivities.slice(startIndex, endIndex);

        element.innerHTML = `
          <div style="min-height: 210mm; background: white; position: relative;">
            <!-- Level icon as full background -->
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.15; z-index: 1; display: flex; align-items: center; justify-content: center;">
              <img src="${levelImages[level]}" 
                   alt="${level}" 
                   style="width: 100%; height: 100%; object-fit: contain;" />
            </div>
            
            ${createHeader(pageNum)}
            ${createActivitiesSection(pageActivities, startIndex)}
            ${createFooter()}
          </div>
        `;

        const canvas = await html2canvas(element, {
          scale: 2.5,
          useCORS: true,
          allowTaint: false,
          logging: false,
          backgroundColor: "white",
          width: element.offsetWidth,
          height: element.offsetHeight,
        });

        const imgData = canvas.toDataURL("image/png", 1.0);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        if (pageNum > 1) {
          pdf.addPage();
        }

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, "", "FAST");
      }
    }

    console.log(
      `PDF horizontal gerado com ${totalPages} página(s) para o nível ${level}`
    );

    pdf.save(
      `avaliacao_${level.replace(/\s+/g, "_").toLowerCase()}_${studentInfo.name
        .replace(/\s+/g, "_")
        .toLowerCase()}.pdf`
    );
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  } finally {
    document.body.removeChild(element);
  }
};
