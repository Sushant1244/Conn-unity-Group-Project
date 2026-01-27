// Simple client-side image compression & resizing using canvas
// Returns a Blob of the compressed image
export async function compressImage(file, {
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.7,
  outputType = 'image/jpeg'
} = {}) {
  if (!file || !file.type.startsWith('image/')) return file
  const img = await readImage(file)
  const { width, height } = fitSize(img.width, img.height, maxWidth, maxHeight)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, width, height)
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, outputType, quality))
  return blob || file
}

// Square crop + resize for avatars
export async function compressAvatar(file, {
  size = 256,
  quality = 0.8,
  outputType = 'image/jpeg'
} = {}) {
  if (!file || !file.type.startsWith('image/')) return file
  const img = await readImage(file)
  const side = Math.min(img.width, img.height)
  const sx = Math.floor((img.width - side) / 2)
  const sy = Math.floor((img.height - side) / 2)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size)
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, outputType, quality))
  return blob || file
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = (e) => {
      URL.revokeObjectURL(url)
      reject(e)
    }
    img.src = url
  })
}

function fitSize(w, h, maxW, maxH) {
  const ratio = Math.min(maxW / w, maxH / h, 1)
  return { width: Math.round(w * ratio), height: Math.round(h * ratio) }
}
