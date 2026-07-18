import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { DOMAINS, computeDomainScore, getAccreditationLevel, ESTABLISHMENTS } from '../data/referentiel';

export function generatePDF(appState) {
  const { establishment, grades, scores } = appState;
  
  if (!establishment) {
    alert("Aucun établissement sélectionné.");
    return;
  }

  // Calculate current establishment scores
  const { computeScore } = require('../data/referentiel');
  const totalScore = computeScore(grades);
  const level = getAccreditationLevel(totalScore);
  const allScores = { ...scores, [establishment.id]: totalScore };

  // Calculate Domain Scores for current establishment
  const domainScores = {};
  DOMAINS.forEach(d => {
    domainScores[d.id] = computeDomainScore(d.id, grades);
  });

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Helper for centered text
  const centerText = (text, y, fontSize, fontStyle = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    const textWidth = doc.getTextWidth(text);
    doc.text(text, (pageWidth - textWidth) / 2, y);
  };

  // --- SECTION 1: INDIVIDUAL GRADE ---
  
  // Header
  centerText("EXPERT VISITEUR", 20, 24, 'bold');
  centerText("Rapport d'Accréditation Santé", 28, 14, 'italic');
  
  doc.setLineWidth(0.5);
  doc.line(20, 35, pageWidth - 20, 35);
  
  // Establishment Info
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`Établissement: ${establishment.name}`, 20, 50);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Ville/Wilaya: ${establishment.city}, ${establishment.wilaya}`, 20, 60);
  doc.text(`Type: ${establishment.type} | Lits: ${establishment.beds}`, 20, 68);
  doc.text(`Code: ${establishment.code}`, 20, 76);
  
  // Overall Score
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 85, pageWidth - 40, 30, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Score Global: ${totalScore.toFixed(1)} / 100`, 30, 98);
  doc.text(`Statut: ${level.label}`, 30, 108);

  // Domain Breakdown Table
  doc.setFontSize(14);
  doc.text("Détail par Domaine:", 20, 130);

  const domainTableData = DOMAINS.map(d => {
    const ds = domainScores[d.id];
    return [
      d.id,
      d.label,
      `${ds.earned.toFixed(1)} / ${ds.max}`,
      `${ds.percent}%`
    ];
  });

  doc.autoTable({
    startY: 135,
    head: [['ID', 'Domaine', 'Points', 'Pourcentage']],
    body: domainTableData,
    theme: 'grid',
    headStyles: { fillColor: [111, 89, 85] }
  });


  // --- SECTION 2: GLOBAL RANKING & COMPARISONS ---
  doc.addPage();
  
  centerText("CLASSEMENT NATIONAL ET COMPARAISONS", 20, 18, 'bold');
  doc.line(20, 25, pageWidth - 20, 25);

  // Calculate Global Metrics
  const rankedIds = Object.keys(allScores);
  const totalRanked = rankedIds.length;
  
  let averageScore = 0;
  if (totalRanked > 0) {
      const sum = rankedIds.reduce((acc, id) => acc + allScores[id], 0);
      averageScore = sum / totalRanked;
  }

  // Display Metrics
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nombre total d'établissements évalués: ${totalRanked}`, 20, 40);
  doc.text(`Score moyen national: ${averageScore.toFixed(1)} / 100`, 20, 48);
  
  const diffFromAvg = totalScore - averageScore;
  const diffText = diffFromAvg >= 0 ? `+${diffFromAvg.toFixed(1)} points au-dessus` : `${diffFromAvg.toFixed(1)} points en-dessous`;
  doc.text(`Écart avec la moyenne (${establishment.name}): ${diffText}`, 20, 56);


  // Global Ranking Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text("Classement Global:", 20, 75);

  const rankedEsts = ESTABLISHMENTS
    .map(e => ({ ...e, score: allScores[e.id] ?? null }))
    .filter(e => e.score !== null)
    .sort((a, b) => b.score - a.score);

  const rankTableData = rankedEsts.map((e, index) => {
    const lvl = getAccreditationLevel(e.score);
    return [
      index + 1,
      e.name,
      `${e.city} (${e.type})`,
      e.score.toFixed(1),
      lvl.label
    ];
  });

  doc.autoTable({
    startY: 80,
    head: [['Rang', 'Établissement', 'Lieu / Type', 'Score', 'Accréditation']],
    body: rankTableData,
    theme: 'striped',
    headStyles: { fillColor: [83, 98, 83] }, // Secondary color
    didParseCell: function(data) {
        // Highlight the current establishment
        if (data.row.raw[1] === establishment.name) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [243, 214, 208]; // primary-container ish
        }
    }
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} - Expert Visiteur`, 20, doc.internal.pageSize.getHeight() - 10);
    doc.text(`Page ${i} / ${pageCount}`, pageWidth - 40, doc.internal.pageSize.getHeight() - 10);
  }

  // Download
  doc.save(`Rapport_Accreditation_${establishment.name.replace(/\s+/g, '_')}.pdf`);
}
