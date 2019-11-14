import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

import slug = require('slug');

ffmpeg.setFfmpegPath(ffmpegPath);

const command = ffmpeg();
let timemark: any = null;

function onEnd(): void {
  console.log('Finished processing');
}

function onProgress(progress: any): void {
  if (progress.timemark !== timemark) {
    timemark = progress.timemark;
  }
}

function onError(err: Error/* , stdout: any, stderr: any */): void {
  console.error(`Video processing error: ${err.message}`);
  console.error(err.stack);
}

export function createVideo(inputPath: string, title: string): void {
  command
    .on('end', onEnd)
    .on('progress', onProgress)
    .on('error', onError)
    .input(inputPath)
    .inputFPS(1 / 6)
    .outputFormat('mp4')
    .outputFPS(60)
    .saveToFile(`${
      slug(title, {
        lower: true,
      })
    }.mp4`)
    .run();
}
