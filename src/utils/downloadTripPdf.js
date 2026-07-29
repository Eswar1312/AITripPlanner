import { jsPDF } from 'jspdf';
import { formatCurrency as formatCurrencyBase, normalizeTrip } from './constants';

const COLORS = {
  ink: [25, 35, 53],
  muted: [99, 115, 129],
  line: [221, 228, 235],
  navy: [20, 44, 79],
  coral: [242, 109, 78],
  cream: [249, 247, 242],
  paleBlue: [239, 246, 255],
};
const MARGIN = 42;
const FOOTER_SPACE = 38;

// Built-in jsPDF fonts do not include the Indian rupee glyph.
function formatCurrency(value) {
  return formatCurrencyBase(value, 'Rs. ');
}

function sanitizeFileName(value) {
  return String(value || 'talk2trip-itinerary').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'talk2trip-itinerary';
}

function pageMetrics(doc) {
  return { width: doc.internal.pageSize.getWidth(), height: doc.internal.pageSize.getHeight() };
}

function addPage(doc, trip) {
  doc.addPage();
  const { width } = pageMetrics(doc);
  doc.setFillColor(...COLORS.navy);
  doc.rect(0, 0, width, 26, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(trip.tripName || 'Talk2Trip itinerary', MARGIN, 17);
  return 48;
}

function ensureSpace(doc, y, needed, trip) {
  const { height } = pageMetrics(doc);
  return y + needed <= height - FOOTER_SPACE ? y : addPage(doc, trip);
}

function wrapped(doc, text, x, y, width, lineHeight, trip, options = {}) {
  const lines = doc.splitTextToSize(String(text || '—'), width);
  y = ensureSpace(doc, y, lines.length * lineHeight + 2, trip);
  doc.text(lines, x, y, options);
  return y + lines.length * lineHeight;
}

function sectionTitle(doc, title, y, trip) {
  y = ensureSpace(doc, y, 28, trip);
  doc.setDrawColor(...COLORS.coral);
  doc.setLineWidth(2);
  doc.line(MARGIN, y - 6, MARGIN, y + 9);
  doc.setTextColor(...COLORS.ink);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(title, MARGIN + 10, y + 5);
  return y + 24;
}

function infoCard(doc, label, value, x, y, width) {
  doc.setFillColor(...COLORS.cream);
  doc.roundedRect(x, y, width, 46, 7, 7, 'F');
  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(label.toUpperCase(), x + 10, y + 14);
  doc.setTextColor(...COLORS.ink);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  const fit = doc.splitTextToSize(String(value || '—'), width - 20).slice(0, 2);
  doc.text(fit, x + 10, y + 29);
}

export function downloadTripPdf(rawTrip, prompt = '') {
  if (!rawTrip) return false;
  const trip = normalizeTrip(rawTrip);
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const { width, height } = pageMetrics(doc);
  const contentWidth = width - MARGIN * 2;
  let y = 0;

  // Cover/header
  doc.setFillColor(...COLORS.navy);
  doc.rect(0, 0, width, 170, 'F');
  doc.setFillColor(...COLORS.coral);
  doc.circle(width - 54, 34, 72, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TALK2TRIP  /  PERSONAL ITINERARY', MARGIN, 42);
  doc.setFontSize(27);
  const title = doc.splitTextToSize(trip.tripName || 'Your next adventure', contentWidth - 35).slice(0, 2);
  doc.text(title, MARGIN, 82);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const dateSub = trip.startDate && trip.endDate ? ` (${trip.startDate} – ${trip.endDate})` : '';
  doc.text(`${trip.destination || 'Trip destination'}  •  ${trip.duration || 'Flexible dates'}${dateSub}`, MARGIN, 142);
  y = 198;

  const gap = 10;
  const cardWidth = (contentWidth - gap) / 2;
  infoCard(doc, 'Weather', trip.weather, MARGIN, y, cardWidth);
  infoCard(doc, 'Trip score', trip.tripScore != null ? `${trip.tripScore}/100` : '—', MARGIN + cardWidth + gap, y, cardWidth);
  y += 62;
  infoCard(doc, 'Budget total', formatCurrency(trip.budget?.total ?? 0), MARGIN, y, cardWidth);
  infoCard(doc, 'Budget risk', trip.budgetRisk, MARGIN + cardWidth + gap, y, cardWidth);
  y += 76;

  y = sectionTitle(doc, 'Trip at a glance', y, trip);
  doc.setTextColor(...COLORS.ink);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  y = wrapped(doc, trip.summary, MARGIN, y, contentWidth, 15, trip);
  if (prompt) {
    y += 12;
    doc.setFillColor(...COLORS.paleBlue);
    const promptLines = doc.splitTextToSize(`Planned for: ${prompt}`, contentWidth - 24);
    y = ensureSpace(doc, y, promptLines.length * 14 + 22, trip);
    doc.roundedRect(MARGIN, y - 13, contentWidth, promptLines.length * 14 + 18, 6, 6, 'F');
    doc.setTextColor(...COLORS.muted);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.text(promptLines, MARGIN + 12, y + 1);
    y += promptLines.length * 14 + 18;
  }

  y += 8;
  y = sectionTitle(doc, 'Budget breakdown', y, trip);
  const budgetRows = [['Hotel', trip.budget?.hotel], ['Flights', trip.budget?.flights], ['Food', trip.budget?.food], ['Transport', trip.budget?.transport], ['Activities', trip.budget?.activities], ['Shopping', trip.budget?.shopping]];
  budgetRows.forEach(([label, value], index) => {
    y = ensureSpace(doc, y, 23, trip);
    if (index % 2 === 0) { doc.setFillColor(...COLORS.cream); doc.roundedRect(MARGIN, y - 13, contentWidth, 20, 3, 3, 'F'); }
    doc.setTextColor(...COLORS.ink); doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    doc.text(label, MARGIN + 8, y);
    doc.setFont('helvetica', 'bold'); doc.text(formatCurrency(value ?? 0), width - MARGIN - 8, y, { align: 'right' });
    y += 23;
  });

  if (trip.travelTips?.length) {
    y += 8; y = sectionTitle(doc, 'Useful travel tips', y, trip);
    trip.travelTips.forEach((tip) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
      y = wrapped(doc, `•  ${tip}`, MARGIN, y, contentWidth, 14, trip); y += 6;
    });
  }

  if (trip.days?.length) {
    y += 8; y = sectionTitle(doc, 'Day-by-day plan', y, trip);
    trip.days.forEach((day) => {
      y = ensureSpace(doc, y, 44, trip);
      doc.setFillColor(...COLORS.navy); doc.roundedRect(MARGIN, y - 13, contentWidth, 27, 6, 6, 'F');
      doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
      const dayBanner = `DAY ${day.day}${day.date ? `  •  ${day.date}` : ''}  •  ${day.title || 'Plan'}`;
      y = wrapped(doc, dayBanner, MARGIN + 11, y + 4, contentWidth - 22, 13, trip);
      y += 10;
      (day.activities || []).forEach((activity) => {
        const heading = `${activity.time || 'Any time'}  |  ${activity.place || 'Activity'}${activity.category ? `  •  ${activity.category}` : ''}`;
        y = ensureSpace(doc, y, 40, trip);
        doc.setTextColor(...COLORS.coral); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
        y = wrapped(doc, heading, MARGIN + 8, y, contentWidth - 16, 13, trip);
        doc.setTextColor(...COLORS.ink); doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
        if (activity.description) y = wrapped(doc, activity.description, MARGIN + 8, y + 2, contentWidth - 16, 13, trip);
        const extras = [['Food', activity.foodTip], ['Rain backup', activity.rainBackup], ['Tip', activity.travelTip]].filter(([, value]) => value);
        extras.forEach(([label, value]) => { doc.setTextColor(...COLORS.muted); y = wrapped(doc, `${label}: ${value}`, MARGIN + 8, y + 2, contentWidth - 16, 12, trip); });
        y += 10;
      });
    });
  }

  if (trip.packing?.length) {
    y = sectionTitle(doc, 'Packing checklist', y + 5, trip);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    trip.packing.forEach((item) => { y = wrapped(doc, `[ ]  ${item}`, MARGIN, y, contentWidth, 14, trip); y += 4; });
  }
  if (trip.emergency?.length) {
    y = sectionTitle(doc, 'Emergency contacts', y + 5, trip);
    trip.emergency.forEach((contact) => { doc.setFont('helvetica', 'normal'); doc.setFontSize(10); y = wrapped(doc, `${contact.name || 'Contact'}  —  ${contact.number || '—'}`, MARGIN, y, contentWidth, 14, trip); y += 4; });
  }

  const pageCount = doc.internal.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(...COLORS.line); doc.line(MARGIN, height - 25, width - MARGIN, height - 25);
    doc.setTextColor(...COLORS.muted); doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
    doc.text('Talk2Trip  •  Made for the journey', MARGIN, height - 14);
    doc.text(`${page} / ${pageCount}`, width - MARGIN, height - 14, { align: 'right' });
  }
  doc.save(`${sanitizeFileName(trip.tripName || trip.destination)}.pdf`);
  return true;
}
