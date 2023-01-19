import { Image, mouse, Point, Region, screen } from '@nut-tree/nut-js';
import Jimp from 'jimp';

export const printScreen = async (): Promise<string | boolean> => {
  const curPosition: Point = await mouse.getPosition();
  try {
    const region: Region = new Region(curPosition.x - 100, curPosition.y - 100, 200, 200);
    const image: Image = await screen.grabRegion(region).then((image) => image.toRGB());
    const jimp: Jimp = new Jimp(image);
    return (await jimp.getBufferAsync(Jimp.MIME_PNG)).toString('base64');
  } catch (error) {
    if (curPosition.x < 200) {
      console.log('\x1b[31m%s\x1b[0m', new Error('Error: X coordinate outside of display').message);
    } else {
      console.log('\x1b[31m%s\x1b[0m', new Error('Error: Y coordinate outside of display').message);
    }
    return false;
  }
};
