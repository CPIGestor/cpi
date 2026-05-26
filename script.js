const defaults = {
  institution: "Municipalidad Distrital de San Miguel",
  mayor: "Ing. Carlos Alberto Ramírez Torres",
  title: "PLAN DE DESARROLLO INSTITUCIONAL",
  subtitle: "Gestión pública moderna, transparente y orientada al ciudadano",
  year: "2026",
  primary: "#0f6b5d",
  secondary: "#c99a2e",
  paper: "#fbfaf7"
};

const fields = {
  institution: document.querySelector("#institutionInput"),
  mayor: document.querySelector("#mayorInput"),
  title: document.querySelector("#titleInput"),
  subtitle: document.querySelector("#subtitleInput"),
  year: document.querySelector("#yearInput"),
  primary: document.querySelector("#primaryColor"),
  secondary: document.querySelector("#secondaryColor"),
  paper: document.querySelector("#paperColor")
};

const preview = {
  institution: document.querySelector("#institutionText"),
  mayor: document.querySelector("#mayorText"),
  title: document.querySelector("#titleText"),
  subtitle: document.querySelector("#subtitleText"),
  year: document.querySelector("#yearText"),
  cover: document.querySelector("#cover")
};

const page = {
  width: 2480,
  height: 3508
};

function valueOf(name) {
  return fields[name].value.trim() || defaults[name];
}

function syncCover() {
  preview.institution.textContent = valueOf("institution");
  preview.mayor.textContent = valueOf("mayor");
  preview.title.textContent = valueOf("title");
  preview.subtitle.textContent = valueOf("subtitle");
  preview.year.textContent = valueOf("year");

  document.documentElement.style.setProperty("--primary", fields.primary.value);
  document.documentElement.style.setProperty("--secondary", fields.secondary.value);
  document.documentElement.style.setProperty("--paper", fields.paper.value);
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function getFileStem() {
  return valueOf("title")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48) || "caratula-institucional";
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width <= maxWidth || !line) {
      line = testLine;
    } else {
      lines.push(line);
      line = word;
    }
  });

  if (line) lines.push(line);
  const visibleLines = lines.slice(0, maxLines);
  const startY = y - ((visibleLines.length - 1) * lineHeight) / 2;
  visibleLines.forEach((textLine, index) => {
    ctx.fillText(textLine, x, startY + index * lineHeight);
  });
}

function drawSeal(ctx, x, y, radius, primary, secondary) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = primary;
  ctx.fill();
  ctx.lineWidth = 18;
  ctx.strokeStyle = secondary;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, radius * 0.58, 0, Math.PI * 2);
  ctx.lineWidth = 10;
  ctx.strokeStyle = "rgba(255,255,255,0.88)";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - radius * 0.48, y);
  ctx.lineTo(x + radius * 0.48, y);
  ctx.moveTo(x, y - radius * 0.48);
  ctx.lineTo(x, y + radius * 0.48);
  ctx.stroke();
  ctx.restore();
}

function drawRing(ctx, x, y, radius, primary, secondary) {
  ctx.save();
  ctx.translate(x, y);
  for (let index = 0; index < 26; index += 1) {
    ctx.rotate(Math.PI / 13);
    ctx.beginPath();
    ctx.moveTo(radius * 0.32, 0);
    ctx.lineTo(radius, radius * 0.05);
    ctx.lineTo(radius, -radius * 0.05);
    ctx.closePath();
    ctx.fillStyle = index % 2 ? secondary : primary;
    ctx.globalAlpha = 0.16;
    ctx.fill();
  }
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.47, 0, Math.PI * 2);
  ctx.lineWidth = 14;
  ctx.strokeStyle = secondary;
  ctx.stroke();
  ctx.restore();
}

function drawPng() {
  const canvas = document.createElement("canvas");
  canvas.width = page.width;
  canvas.height = page.height;
  const ctx = canvas.getContext("2d");
  const primary = fields.primary.value;
  const secondary = fields.secondary.value;
  const paper = fields.paper.value;

  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, page.width, page.height);

  drawRing(ctx, page.width + 120, -20, 880, primary, secondary);
  drawRing(ctx, -170, page.height + 80, 880, primary, secondary);

  ctx.strokeStyle = primary;
  ctx.globalAlpha = 0.34;
  ctx.lineWidth = 17;
  ctx.strokeRect(213, 213, page.width - 426, page.height - 426);
  ctx.globalAlpha = 1;

  drawSeal(ctx, page.width / 2, 560, 200, primary, secondary);

  ctx.textAlign = "center";
  ctx.fillStyle = primary;
  ctx.font = "800 74px Arial";
  wrapText(ctx, valueOf("institution").toUpperCase(), page.width / 2, 950, 1620, 90, 3);

  const gradient = ctx.createLinearGradient(390, 1560, page.width - 390, 1560);
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.5, secondary);
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(390, 1560, page.width - 780, 13);

  ctx.fillStyle = secondary;
  ctx.font = "800 43px Arial";
  ctx.fillText("DOCUMENTO INSTITUCIONAL", page.width / 2, 1435);

  ctx.fillStyle = "#18211f";
  ctx.font = "900 120px Arial";
  wrapText(ctx, valueOf("title").toUpperCase(), page.width / 2, 1825, 1810, 136, 4);

  ctx.fillStyle = "#3f4b47";
  ctx.font = "400 62px Arial";
  wrapText(ctx, valueOf("subtitle"), page.width / 2, 2260, 1670, 82, 3);

  ctx.textAlign = "left";
  ctx.fillStyle = secondary;
  ctx.font = "800 39px Arial";
  ctx.fillText("ALCALDE", 342, 3160);

  ctx.fillStyle = "#18211f";
  ctx.font = "700 55px Arial";
  wrapText(ctx, valueOf("mayor"), 342, 3265, 1320, 70, 2);

  ctx.textAlign = "right";
  ctx.fillStyle = primary;
  ctx.font = "900 132px Arial";
  ctx.fillText(valueOf("year"), page.width - 342, 3270);

  canvas.toBlob((blob) => downloadBlob(blob, `${getFileStem()}.png`), "image/png");
}

function exportWord() {
  const primary = fields.primary.value;
  const secondary = fields.secondary.value;
  const paper = fields.paper.value;
  const html = `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page WordSection1 { size: 21cm 29.7cm; margin: 0; }
          div.WordSection1 { page: WordSection1; }
          body { margin: 0; font-family: Arial, sans-serif; color: #18211f; }
          .page { width: 21cm; height: 29.7cm; padding: 3cm 2.6cm; background: ${paper}; border: 12px solid ${primary}; text-align: center; }
          .seal { width: 3.5cm; height: 3.5cm; margin: 0 auto 1cm; border-radius: 50%; background: ${primary}; border: 10px solid ${secondary}; }
          .institution { color: ${primary}; font-size: 22pt; font-weight: 800; text-transform: uppercase; }
          .label { margin-top: 4cm; color: ${secondary}; font-size: 12pt; font-weight: 800; text-transform: uppercase; }
          h1 { margin: 1cm 0 0; font-size: 36pt; line-height: 1.1; text-transform: uppercase; }
          .subtitle { margin: 1.2cm auto 0; font-size: 18pt; line-height: 1.4; }
          .footer { margin-top: 4.6cm; display: table; width: 100%; text-align: left; }
          .footer div { display: table-cell; width: 70%; vertical-align: bottom; }
          .footer p { display: table-cell; width: 30%; color: ${primary}; font-size: 42pt; font-weight: 900; text-align: right; vertical-align: bottom; }
          .footer span { color: ${secondary}; font-size: 11pt; font-weight: 800; text-transform: uppercase; }
          .footer strong { display: block; margin-top: .25cm; font-size: 16pt; }
        </style>
      </head>
      <body>
        <div class="WordSection1">
          <div class="page">
            <div class="seal"></div>
            <p class="institution">${escapeHtml(valueOf("institution"))}</p>
            <p class="label">Documento Institucional</p>
            <h1>${escapeHtml(valueOf("title"))}</h1>
            <p class="subtitle">${escapeHtml(valueOf("subtitle"))}</p>
            <div class="footer">
              <div><span>Alcalde</span><strong>${escapeHtml(valueOf("mayor"))}</strong></div>
              <p>${escapeHtml(valueOf("year"))}</p>
            </div>
          </div>
        </div>
      </body>
    </html>`;
  downloadBlob(new Blob([html], { type: "application/msword" }), `${getFileStem()}.doc`);
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

Object.values(fields).forEach((field) => {
  field.addEventListener("input", syncCover);
});

document.querySelector("#pdfBtn").addEventListener("click", () => window.print());
document.querySelector("#pngBtn").addEventListener("click", drawPng);
document.querySelector("#wordBtn").addEventListener("click", exportWord);
document.querySelector("#resetBtn").addEventListener("click", () => {
  Object.entries(defaults).forEach(([name, value]) => {
    fields[name].value = value;
  });
  syncCover();
});

syncCover();
