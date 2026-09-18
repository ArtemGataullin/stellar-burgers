import fs from 'fs';
import path from 'path';

type HarEntry = {
  request: { method: string; url: string };
  response: { content: { text?: string } };
};

type HarFile = {
  log: { entries: HarEntry[] };
};

export function readOrderNumberFromHar(harPath: string): number {
  const absolutePath = path.resolve(process.cwd(), harPath);
  const har: HarFile = JSON.parse(fs.readFileSync(absolutePath, 'utf-8'));

  const orderEntry = har.log.entries.find(
    (entry) =>
      entry.request.method === 'POST' &&
      entry.request.url.includes('/api/orders')
  );

  if (!orderEntry?.response.content.text) {
    throw new Error(`Не найден ответ POST /api/orders в HAR: ${harPath}`);
  }

  const body = JSON.parse(orderEntry.response.content.text);

  if (typeof body?.order?.number !== 'number') {
    throw new Error(
      `В HAR ${harPath} нет order.number в ответе POST /api/orders`
    );
  }

  return body.order.number;
}
