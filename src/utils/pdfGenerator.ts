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
    width: 1122px;
    min-height: 794px;
    padding: 0;
    margin: 0;
    background: white;
    font-family: 'Montserrat', sans-serif;
    position: absolute;
    left: -9999px;
    top: 0;
    font-size: 12pt;
    line-height: 1.5;
    letter-spacing: normal;
    font-weight: normal;
  `;
  document.body.appendChild(element);

  const levelActivities = activitiesMap[level];
  const currentDate = format(new Date(), "dd/MM/yyyy");
  const colors = levelColors[level];

  const activitiesPerPage = 10;
  const totalPages = Math.ceil(levelActivities.length / activitiesPerPage);

  const getRatingConfig = (rating: string) => {
    const configs = {
      "Totalmente Atingido": {
        color: "#2563EB",
        bg: "#DBEAFE",
        label: "TOTALMENTE ATINGIDO",
      },
      "Parcialmente Atingido": {
        color: "#2563EB",
        bg: "#DBEAFE",
        label: "PARCIALMENTE ATINGIDO",
      },
      "Não Atingido": {
        color: "#2563EB",
        bg: "#DBEAFE",
        label: "NÃO ATINGIDO",
      },
      default: {
        color: "#9CA3AF",
        bg: "#F3F4F6",
        label: "NÃO AVALIADO",
      },
    };
    return configs[rating] || configs.default;
  };

  const createHeader = (pageNumber: number = 1) => `
    <div style="position: relative; padding: 20px 30px; border-bottom: 2px solid #000;">
      
      <!-- Background watermark logo - increased size and moved even closer to bottom -->
      <div style="position: absolute; bottom: -800px; left: 30%; transform: translateX(-50%); opacity: 0.12; z-index: 1;">
        <img src="${levelImages[level]}" 
          alt="${level}" 
          style="width: 1200px; height: 1200px; object-fit: contain;" />
        </div>

      <div style="position: relative; z-index: 2;">
        
        <!-- Header with logo, title and level logo in same line -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          
          <!-- Left side - Academy logo -->
          <div>
            <img src="/lovable-uploads/0d85c0da-2aab-4954-9e10-99368ef81b4e.png" 
                 alt="Academia Acquagyn" 
                 style="height: 120px; width: auto;" />
          </div>
          
          <!-- Center - Title -->
          <div style="flex: 1; text-align: center;">
            <h1 style="margin: 0; font-size: 24pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; font-family: 'Montserrat', sans-serif; line-height: 1.2;">
              AVALIAÇÃO PEDAGÓGICA
            </h1>
          </div>

          <!-- Right side - Level logo with objectives - CENTERED ALIGNMENT -->
          <div style="display: flex; flex-direction: column; align-items: center; max-width: 260px;">
            <div style="margin-bottom: 10px;">
              <img src="${levelImages[level]}" 
                   alt="${level}" 
                   style="width: 120px; height: 120px; object-fit: contain;" />
            </div>
            <div style="font-size: 13pt; font-weight: bold; color: ${
              colors.primary
            }; margin-bottom: 8px; font-family: 'Montserrat', sans-serif; line-height: 1.2; text-align: center;">
              ${level}
            </div>
            <!-- Objectives section with centered text -->
            <div style="font-size: 10pt; font-weight: normal; color: #333; text-align: center; line-height: 1.4; font-family: 'Montserrat', sans-serif;">
              <strong>Objetivos gerais:</strong> ${levelObjectives[level]}
            </div>
          </div>
        </div>
        
        <!-- Student info section -->
        <div style="font-size: 12pt; font-family: 'Montserrat', sans-serif; line-height: 1.3;">
          <div style="margin-bottom: 11pt; display: flex; align-items: center;">
            <strong style="font-size: 14pt; font-weight: 600;">Nome:</strong> 
            <span style="font-size: 13pt; margin-left: 10px; font-weight: normal;">${
              studentInfo.name || ""
            }</span>
          </div>
          
          <div style="margin-bottom: 14px; display: flex; align-items: center;">
            <strong style="font-size: 14pt; font-weight: 600;">Idade:</strong> 
            <span style="font-size: 13pt; margin-left: 10px; font-weight: normal;">${
              studentInfo.age || ""
            }</span>
          </div>
          
          <div style="margin-bottom: 14px; display: flex; align-items: center;">
            <strong style="font-size: 14pt; font-weight: 600;">Data da avaliação:</strong> 
            <span style="font-size: 13pt; margin-left: 10px; font-weight: normal;">${currentDate}</span>
          </div>
          
          <div style="margin-bottom: 14px; display: flex; align-items: center;">
            <strong style="font-size: 14pt; font-weight: 600;">Professor:</strong> 
            <span style="font-size: 13pt; margin-left: 10px; font-weight: normal;">${
              studentInfo.teacher || ""
            }</span>
          </div>
        </div>
      </div>
      
      ${
        totalPages > 1
          ? `
        <div style="text-align: center; margin-top: 14px; font-size: 10pt; font-family: 'Montserrat', sans-serif; font-weight: normal;">
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
    <div style="padding: 20px 30px; position: relative;">
      
      <!-- Activities list -->
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${activities
          .map((activity, index) => {
            const rating = activityRatings.find(
              (r) => r.activityId === activity.id
            );
            const ratingConfig = getRatingConfig(rating?.rating || "");

            return `
            <div style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
              
              <!-- Activity header with name and rating -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                
                <!-- Activity text - INCREASED FONT SIZE -->
                <div style="flex: 1; font-size: 12pt; line-height: 1.4; padding-right: 20px; font-weight: 600; font-family: 'Montserrat', sans-serif;">
                  ${activity.name}
                </div>

                <!-- Rating text - INCREASED FONT SIZE -->
                <div style="display: flex; align-items: center; min-width: 220px; justify-content: flex-end;">
                  <div style="padding: 8px 14px; background: ${
                    ratingConfig.bg
                  }; color: ${
              ratingConfig.color
            }; border-radius: 4px; font-size: 10pt; font-weight: 600; text-align: center; font-family: 'Montserrat', sans-serif; line-height: 1.2;">
                    ${ratingConfig.label}
                  </div>
                </div>
              </div>

              <!-- Observation section (if exists) -->
              ${
                rating?.observation
                  ? `
                <div style="margin-top: 6px; padding: 8px; background: #f9fafb; border-left: 3px solid #e5e7eb; border-radius: 3px;">
                  <div style="font-size: 9pt; font-weight: 600; color: #6b7280; margin-bottom: 3px; font-family: 'Montserrat', sans-serif;">OBSERVAÇÃO:</div>
                  <div style="font-size: 10pt; color: #374151; line-height: 1.4; font-family: 'Montserrat', sans-serif; font-weight: normal;">${rating.observation}</div>
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
          ${createHeader()}
          ${createActivitiesSection(levelActivities)}
          ${createFooter()}
        </div>
      `;

      const canvas = await html2canvas(element, {
        scale: 3, // Adjusted scale to prevent stretching
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "white",
        width: element.offsetWidth,
        height: element.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.offsetWidth,
        windowHeight: element.offsetHeight,
        imageTimeout: 0,
        removeContainer: false,
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
            ${createHeader(pageNum)}
            ${createActivitiesSection(pageActivities, startIndex)}
            ${createFooter()}
          </div>
        `;

        const canvas = await html2canvas(element, {
          scale: 3, // Adjusted scale to prevent stretching
          useCORS: true,
          allowTaint: false,
          logging: false,
          backgroundColor: "white",
          width: element.offsetWidth,
          height: element.offsetHeight,
          scrollX: 0,
          scrollY: 0,
          windowWidth: element.offsetWidth,
          windowHeight: element.offsetHeight,
          imageTimeout: 0,
          removeContainer: false,
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
