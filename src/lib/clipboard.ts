export async function copyImageToClipboard(url: string): Promise<void> {
  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
    throw new Error("El navegador no soporta copiar imágenes.");
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("No se pudo descargar la imagen.");
  }

  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("No se pudo crear el contexto del canvas.");
  }

  try {
    context.drawImage(bitmap, 0, 0);
  } finally {
    bitmap.close();
  }

  const pngBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => {
      if (value) {
        resolve(value);
        return;
      }

      reject(new Error("No se pudo convertir la imagen a PNG."));
    }, "image/png");
  });

  await navigator.clipboard.write([
    new ClipboardItem({ "image/png": pngBlob }),
  ]);
}
