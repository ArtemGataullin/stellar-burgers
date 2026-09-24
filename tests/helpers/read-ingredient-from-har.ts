import fs from 'node:fs';
import path from 'node:path';

type IngredientFromHar = {
  name: string;
  calories: number;
  proteins: number;
  fat: number;
  carbohydrates: number;
};

function readHarEntryBody(harAbsolutePath: string, entry: any): string {
  const content = entry?.response?.content;

  if (!content) {
    throw new Error(`В HAR-записи нет поля response.content`);
  }

  if (content.text) {
    return content.text;
  }

  if (content._file) {
    const harDir = path.dirname(harAbsolutePath);
    const harFileName = path.basename(harAbsolutePath);

    const candidates = [
      path.join(harDir, content._file),
      path.join(harDir, `${harFileName}.resources`, content._file)
    ];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return fs.readFileSync(candidate, 'utf-8');
      }
    }

    throw new Error(
      `Не найден ресурсный файл тела ответа "${content._file}". ` +
        `Проверены пути:\n${candidates.join('\n')}`
    );
  }

  throw new Error(`В HAR-записи нет ни content.text, ни content._file`);
}

export function readIngredientFromHar(
  harPath: string,
  name: string
): IngredientFromHar {
  const absoluteHarPath = path.resolve(process.cwd(), harPath);
  const har = JSON.parse(fs.readFileSync(absoluteHarPath, 'utf-8'));

  const entry = har.log.entries.find(
    (e: any) =>
      e.request.method === 'GET' && e.request.url.includes('/api/ingredients')
  );

  if (!entry) {
    throw new Error(`Не найден ответ GET /api/ingredients в HAR: ${harPath}`);
  }

  const bodyText = readHarEntryBody(absoluteHarPath, entry);
  const body = JSON.parse(bodyText);
  const ingredient = body.data.find((i: any) => i.name === name);

  if (!ingredient) {
    throw new Error(`Ингредиент "${name}" не найден в HAR ${harPath}`);
  }

  return {
    name: ingredient.name,
    calories: ingredient.calories,
    proteins: ingredient.proteins,
    fat: ingredient.fat,
    carbohydrates: ingredient.carbohydrates
  };
}