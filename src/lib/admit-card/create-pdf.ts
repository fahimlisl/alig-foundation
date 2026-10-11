/**
 * Client-only PDF renderer. Import this file via import() from a "use client" component.
 * The backend never receives, generates or stores a PDF.
 */
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { AdmitCardData } from "./types";




const W = 595.28; // A4 in PDF points
const H = 841.89;
const INK = rgb(0.10, 0.11, 0.13);
const NAVY = rgb(0.06, 0.09, 0.35);
const RED = rgb(0.67, 0.06, 0.09);
const GREEN = rgb(0.06, 0.47, 0.29);
const TEAL = rgb(0.10, 0.39, 0.48);

type Fonts = { regular: PDFFont; bold: PDFFont; italic: PDFFont };


async function drawStudentPhoto(
  doc: PDFDocument,
  page: PDFPage,
  avatarUrl: string
): Promise<void> {
  const PHOTO_X = 446;
  const PHOTO_TOP = 184;
  const PHOTO_WIDTH = 108;
  const PHOTO_HEIGHT = 127;

  if (!avatarUrl?.trim()) {
    throw new Error("Student photograph is missing.");
  }

  // Fetch photo directly in the browser
  const response = await fetch(avatarUrl, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      "Unable to load student photograph."
    );
  }

  const blob = await response.blob();

  if (!blob.type.startsWith("image/")) {
    throw new Error("Invalid student photograph format.");
  }

  if (blob.size > 6 * 1024 * 1024) {
    throw new Error("Student photograph exceeds 6 MB.");
  }

  const bitmap = await createImageBitmap(blob);

  try {
    // Generate a standard passport-style image
    const canvas = document.createElement("canvas");

    canvas.width = 432;
    canvas.height = 508;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Unable to process photograph.");
    }

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Preserve original image proportions
    // Crop from the center, without stretching
    const targetRatio = canvas.width / canvas.height;
    const imageRatio = bitmap.width / bitmap.height;

    let sx = 0;
    let sy = 0;
    let sw = bitmap.width;
    let sh = bitmap.height;

    if (imageRatio > targetRatio) {
      sw = bitmap.height * targetRatio;
      sx = (bitmap.width - sw) / 2;
    } else {
      sh = bitmap.width / targetRatio;
      sy = (bitmap.height - sh) / 2;
    }

    ctx.drawImage(
      bitmap,
      sx,
      sy,
      sw,
      sh,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Convert to JPEG in memory
    const jpegBlob = await new Promise<Blob>(
      (resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject(
                new Error("Photograph conversion failed.")
              );
            }
          },
          "image/jpeg",
          0.92
        );
      }
    );

    const photoBytes = await jpegBlob.arrayBuffer();
    const photo = await doc.embedJpg(photoBytes);

    // Draw actual student photograph on A4 PDF
    page.drawImage(photo, {
      x: PHOTO_X + 2,
      y: H - PHOTO_TOP - PHOTO_HEIGHT + 2,
      width: PHOTO_WIDTH - 4,
      height: PHOTO_HEIGHT - 4,
    });

    // Draw clean border around photograph
    page.drawRectangle({
      x: PHOTO_X,
      y: H - PHOTO_TOP - PHOTO_HEIGHT,
      width: PHOTO_WIDTH,
      height: PHOTO_HEIGHT,
      borderColor: INK,
      borderWidth: 0.8,
    });
  } finally {
    bitmap.close();
  }
}


function clean(value: string): string {
  return value
    .replace(/[\r\n\t]/g, " ")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function text(page: PDFPage, value: string, x: number, top: number, size: number, font: PDFFont, color = INK) {
  page.drawText(clean(value), { x, y: H - top - size, size, font, color });
}

function center(page: PDFPage, value: string, top: number, size: number, font: PDFFont, color = INK) {
  const display = clean(value);
  const width = font.widthOfTextAtSize(display, size);
  text(page, display, (W - width) / 2, top, size, font, color);
}

function wrap(value: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const raw = clean(value);
  if (!raw) return ["-"];
  const lines: string[] = [];
  let line = "";
  for (const word of raw.split(" ")) {
    if (font.widthOfTextAtSize(word, fontSize) > maxWidth) {
      if (line) { lines.push(line); line = ""; }
      let fragment = "";
      for (const char of word) {
        if (fragment && font.widthOfTextAtSize(fragment + char, fontSize) > maxWidth) {
          lines.push(fragment);
          fragment = char;
        } else {
          fragment += char;
        }
      }
      line = fragment;
      continue;
    }
    const attempt = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(attempt, fontSize) <= maxWidth) {
      line = attempt;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function field(
  page: PDFPage,
  fonts: Fonts,
  label: string,
  value: string,
  top: number,
  options: { width?: number; maxLines?: number; size?: number } = {}
) {
  const available = options.width ?? 200;
  const maxLines = options.maxLines ?? 2;
  let fontSize = options.size ?? 12.6;
  let lines = wrap(value, fonts.bold, fontSize, available);
  while (lines.length > maxLines && fontSize > 9.0) {
    fontSize -= 0.3;
    lines = wrap(value, fonts.bold, fontSize, available);
  }
  if (lines.length > maxLines) {
    throw new Error(`${label} is too long for the A4 layout. Contact ALIG Foundation.`);
  }
  text(page, label, 43, top, 12.3, fonts.bold);
  text(page, ":", 194, top, 12.3, fonts.bold);
  lines.forEach((line, index) => text(page, line, 239, top + index * (fontSize + 1.5), fontSize, fonts.bold));
}

function instructions(page: PDFPage, fonts: Fonts, items: readonly string[]) {
  page.drawLine({
    start: { x: 39, y: H - 540 },
    end: { x: 557, y: H - 540 },
    thickness: 1.7,
    color: INK,
  });
  text(page, "Important Instructions for Candidates", 51, 552, 14, fonts.bold);

  for (let size = 10.6; size >= 8.0; size -= 0.2) {
    let y = 576;
    const layout = items.map((item, i) => {
      const lines = wrap(item, fonts.regular, size, 460);
      const row = { i, y, lines };
      y += lines.length * (size + 3.2) + 4.5;
      return row;
    });
    if (y <= 799) {
      layout.forEach(({ i, y: top, lines }) => {
        text(page, `${i + 1}.`, 58, top, size, fonts.regular);
        lines.forEach((line, lineIndex) => {
          text(page, line, 80, top + lineIndex * (size + 3.2), size, fonts.regular);
        });
      });
      return;
    }
  }
  throw new Error("Exam instructions do not fit onto the A4 page.");
}

function border(page: PDFPage) {
  page.drawRectangle({
    x: 13, y: 13, width: W - 26, height: H - 26,
    borderWidth: 2.2, borderColor: NAVY,
  });
  page.drawRectangle({
    x: 18, y: 18, width: W - 36, height: H - 36,
    borderWidth: 0.7, borderColor: NAVY,
  });
  for (const x of [17, W - 17]) {
    for (const y of [17, H - 17]) {
      page.drawRectangle({ x: x - 2.5, y: y - 2.5, width: 5, height: 5, color: NAVY });
    }
  }
}

export async function createAdmitCardPdf(data: AdmitCardData): Promise<Blob> {
  try {
    const response = await fetch("/admit-assets/alig-logo.jpeg", { cache: "force-cache" });
    if (!response.ok) throw new Error("ALIG Foundation logo is missing from public/admit-assets/.");
    const logoBytes = await response.arrayBuffer();

    const doc = await PDFDocument.create();
    doc.setTitle(`ALIG Foundation Admit Card - ${data.registrationNo}`);
    doc.setAuthor("ALIG Foundation");
    doc.setCreator("ALIG Foundation - on-demand browser PDF generator");
    const page = doc.addPage([W, H]);
    const fonts: Fonts = {
      regular: await doc.embedFont(StandardFonts.TimesRoman),
      bold: await doc.embedFont(StandardFonts.TimesRomanBold),
      italic: await doc.embedFont(StandardFonts.TimesRomanItalic),
    };
    const logo = await doc.embedJpg(logoBytes);

    border(page);
    // Faint foundation seal behind text, based on the sample admit card.
    page.drawImage(logo, {
      x: 109, y: 220, width: 378, height: 378, opacity: 0.075,
    });
    // New user-provided ALIG Foundation logo in the top-left header.
    page.drawImage(logo, { x: 44, y: H - 129, width: 80, height: 80 });

    center(page, "ALIG FOUNDATION", 42, 28, fonts.bold, RED);
    center(page, "(AN INITIATIVE TO INITIATE)", 81, 15, fonts.bold, GREEN);
    center(page, `Email: ${data.foundationEmail}  |  ${data.contactNumbers}`, 105, 10.8, fonts.regular, TEAL);
    page.drawLine({
      start: { x: 146, y: H - 121 },
      end: { x: 516, y: H - 121 },
      thickness: 0.8, color: TEAL,
    });
    center(page, data.title, 128, 13.2, fonts.bold);

    // Photo box mirrors the user's sample: "Affix your photo here".
    // const photoX = 446;
    // const photoTop = 184;
    // page.drawRectangle({
    //   x: photoX, y: H - photoTop - 127, width: 108, height: 127,
    //   borderColor: INK, borderWidth: 0.8,
    // });
    // text(page, "Affix your", photoX + 29, photoTop + 48, 10.8, fonts.italic);
    // text(page, "photo here", photoX + 26, photoTop + 63, 10.8, fonts.italic);

    await drawStudentPhoto(
  doc,
  page,
  data.avatarUrl
);

    field(page, fonts, "REGISTRATION NO.", data.registrationNo, 190, { width: 196, maxLines: 1 });
    field(page, fonts, "ROLL NO.", data.rollNo, 220, { width: 196, maxLines: 1 });
    field(page, fonts, "STUDENT NAME", data.candidateName.toUpperCase(), 250, { width: 198, maxLines: 2 });
    field(page, fonts, "GUARDIAN NAME", data.guardianName.toUpperCase(), 283, { width: 198, maxLines: 2, size: 11.8 });
    field(page, fonts, "TEST DATE", data.examDate, 326, { width: 302, maxLines: 1 });
    field(page, fonts, "TEST TIME", data.examTime, 356, { width: 302, maxLines: 1 });
    field(page, fonts, "COURSE", data.course, 387, { width: 303, maxLines: 2 });
    field(page, fonts, data.mode === "online" ? "TEST MODE" : "TEST CENTRE", data.mode === "online" ? "ONLINE" : data.testCentre, 422, {
      width: 303, maxLines: 3, size: 11.8,
    });

    text(page, "Candidate's Signature:", 42, 499, 11, fonts.regular);
    page.drawRectangle({ x: 171, y: H - 519, width: 122, height: 36, borderColor: INK, borderWidth: 0.75 });
    text(page, "Invigilator's Signature:", 307, 499, 10.7, fonts.regular);
    page.drawRectangle({ x: 442, y: H - 519, width: 110, height: 36, borderColor: INK, borderWidth: 0.75 });

    instructions(page, fonts, data.instructions);
    const buffer = await doc.save({ useObjectStreams: true });
    // No server-side file, database record, or PDF upload.
    const exactBuffer = new ArrayBuffer(buffer.byteLength);
    new Uint8Array(exactBuffer).set(buffer);
    return new Blob([exactBuffer], { type: "application/pdf" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create admit card.";
    if (/WinAnsi|encode|glyph/i.test(message)) {
      throw new Error("This candidate name contains characters unsupported by the built-in PDF font. Add a Unicode TTF font to support this language.");
    }
    throw error;
  }
}
