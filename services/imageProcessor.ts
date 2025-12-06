// src/services/imageProcessor.ts
import { Jimp } from 'jimp';

export const preprocessImage = async (file: File): Promise<Buffer> => {
  const arrayBuffer = await file.arrayBuffer();
  const image = await Jimp.read(arrayBuffer as Buffer);

  image
    .greyscale()          // Remove color distraction
    .contrast(1)          // High contrast (black/white)
    .normalize()          // Fix brightness
    .resize({ w: 2000 }); // FORCE UPSCALE: Make image 2000px wide. This fixes small text.

  return image.getBuffer("image/jpeg");
};