import { app } from 'electron';
import { URL } from 'url';
import * as fs from 'fs';
import * as path from 'path';

const DIST_PATH = app.getPath('appData');
const scheme = 'app';

const mimeTypes: { [extension: string]: string } = {
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.html': 'text/html',
  '.htm': 'text/html',
  '.json': 'application/json',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.ico': 'image/vnd.microsoft.icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.map': 'text/plain',
  '.wav': 'audio/wav',
};

function charset(mimeExt: string): string | null {
  return ['.html', '.htm', '.js', '.mjs'].includes(mimeExt) ? 'utf-8' : null;
}

function mime(filename: string): {
  mimeExt: string | null;
  mimeType: string | null;
} {
  const mimeExt = path.extname(`${filename || ''}`).toLowerCase();
  const mimeType = mimeTypes[mimeExt];
  return mimeType ? { mimeExt, mimeType } : { mimeExt: null, mimeType: null };
}

function requestHandler(
  req: { url: string },
  next: (args: {
    mimeType: string | null;
    charset: string | null;
    data: Buffer;
  }) => void
): void {
  const reqUrl = new URL(req.url);
  let reqPath = path.normalize(reqUrl.pathname);
  if (reqPath === '/') {
    reqPath = '/index.html';
  }
  const reqFilename = path.basename(reqPath);
  fs.readFile(path.join(DIST_PATH, reqPath), (err, data) => {
    const { mimeExt, mimeType } = mime(reqFilename);
    if (!err && mimeType !== null) {
      next({
        mimeType,
        charset: charset(mimeExt),
        data,
      });
    } else {
      console.error(err);
    }
  });
}

export default {
  scheme,
  requestHandler,
};
