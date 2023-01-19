import { FileType, mouse, Point, Region, screen } from '@nut-tree/nut-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const printScreen = async (): Promise<boolean> => {
  const curPosition: Point = await mouse.getPosition();
  try {
    const region: Region = new Region(curPosition.x - 100, curPosition.y - 100, 200, 200);
    await screen.captureRegion('print-screen', region, FileType.PNG, __dirname);
    return true;
  } catch (error) {
    if (curPosition.x < 200) {
      console.log('\x1b[31m%s\x1b[0m', new Error('Error: X coordinate outside of display').message);
    } else {
      console.log('\x1b[31m%s\x1b[0m', new Error('Error: Y coordinate outside of display').message);
    }
    return false;
  }
};
