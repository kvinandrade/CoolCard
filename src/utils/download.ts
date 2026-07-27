import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'

async function captureElement(element: HTMLElement): Promise<string> {
  return toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
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

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
