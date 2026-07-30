import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'

async function captureElement(element: HTMLElement): Promise<string> {
  return toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    skipFonts: true,
  })
}

export async function downloadAsImage(
  frontEl: HTMLElement,
  backEl: HTMLElement,
  filename: string,
): Promise<void> {
  const [front, back] = await Promise.all([
    captureElement(frontEl),
    captureElement(backEl),
  ])

  const frontImg = await loadImage(front)
  const backImg = await loadImage(back)
  const gap = 24
  const canvas = document.createElement('canvas')
  canvas.width = frontImg.width + backImg.width + gap
  canvas.height = Math.max(frontImg.height, backImg.height)

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas não suportado')

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(frontImg, 0, 0)
  ctx.drawImage(backImg, frontImg.width + gap, 0)

  const link = document.createElement('a')
  link.download = `${filename}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export async function downloadAsPdf(
  frontEl: HTMLElement,
  backEl: HTMLElement,
  filename: string,
): Promise<void> {
  const [front, back] = await Promise.all([
    captureElement(frontEl),
    captureElement(backEl),
  ])

  const widthMm = 54
  const heightMm = 86
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [widthMm, heightMm],
  })

  pdf.addImage(front, 'PNG', 0, 0, widthMm, heightMm)
  pdf.addPage([widthMm, heightMm], 'portrait')
  pdf.addImage(back, 'PNG', 0, 0, widthMm, heightMm)
  pdf.save(`${filename}.pdf`)
}

/** PDF em folha A4 com carteirinhas em tamanho real para cortar e plastificar. */
export async function downloadAsPrintPdf(
  frontEl: HTMLElement,
  backEl: HTMLElement,
  filename: string,
): Promise<void> {
  const [front, back] = await Promise.all([
    captureElement(frontEl),
    captureElement(backEl),
  ])

  // Tamanho de carteirinha vertical (formato CR80 girado): 54 × 86 mm
  const cardW = 54
  const cardH = 86
  const pageW = 210
  const pageH = 297
  const gap = 16
  const pairW = cardW * 2 + gap
  const startX = (pageW - pairW) / 2
  const startY = 48

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  pdf.setFillColor(255, 255, 255)
  pdf.rect(0, 0, pageW, pageH, 'F')

  pdf.setTextColor(11, 61, 61)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(16)
  pdf.text('CoolCard — Pronto para imprimir', pageW / 2, 18, { align: 'center' })

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(70, 100, 100)
  const instructions = [
    '1. Imprima em folha A4 (tamanho real, 100%, sem ajustar à página).',
    '2. Corte nas linhas pontilhadas — cada carteirinha mede 54 × 86 mm.',
    '3. Plastifique a frente e o verso (pode colar verso com verso).',
  ]
  instructions.forEach((line, i) => {
    pdf.text(line, pageW / 2, 28 + i * 5.5, { align: 'center' })
  })

  const frontX = startX
  const backX = startX + cardW + gap
  const cardY = startY

  drawCutGuide(pdf, frontX, cardY, cardW, cardH)
  drawCutGuide(pdf, backX, cardY, cardW, cardH)

  pdf.addImage(front, 'PNG', frontX, cardY, cardW, cardH)
  pdf.addImage(back, 'PNG', backX, cardY, cardW, cardH)

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(9)
  pdf.setTextColor(11, 110, 110)
  pdf.text('FRENTE', frontX + cardW / 2, cardY + cardH + 7, { align: 'center' })
  pdf.text('VERSO', backX + cardW / 2, cardY + cardH + 7, { align: 'center' })

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.setTextColor(120, 140, 140)
  pdf.text(
    'Dica: use plastificação 125–250 micra ou envelope plástico para crachá.',
    pageW / 2,
    pageH - 14,
    { align: 'center' },
  )

  pdf.save(`${filename}-imprimir-a4.pdf`)
}

function drawCutGuide(
  pdf: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  const mark = 4
  const gap = 1.2
  pdf.setDrawColor(160, 180, 180)
  pdf.setLineWidth(0.2)

  // Cantos (marcas de corte)
  const corners: Array<[number, number, number, number]> = [
    [x - gap, y, x - gap - mark, y],
    [x, y - gap, x, y - gap - mark],
    [x + w + gap, y, x + w + gap + mark, y],
    [x + w, y - gap, x + w, y - gap - mark],
    [x - gap, y + h, x - gap - mark, y + h],
    [x, y + h + gap, x, y + h + gap + mark],
    [x + w + gap, y + h, x + w + gap + mark, y + h],
    [x + w, y + h + gap, x + w, y + h + gap + mark],
  ]

  for (const [x1, y1, x2, y2] of corners) {
    pdf.line(x1, y1, x2, y2)
  }

  pdf.setDrawColor(140, 165, 165)
  pdf.setLineWidth(0.25)
  pdf.rect(x - 0.4, y - 0.4, w + 0.8, h + 0.8)
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
