import { expect, test } from '@playwright/test';

test.describe('Тестирование страницы конструктора бургера', () => {
  test('Создание мокированных данных и запись их в HAR-файл', async ({
    page
  }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: true // Режим записи
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="ingredient"]', {
      timeout: 15000
    });
    await page.waitForTimeout(1000);
  });

  test('должен добавлять ингредиенты из списка в конструктор', async ({
    page
  }) => {
    const ingredientCard = page
      .locator('[data-testid="ingredient"]')
      .filter({
        hasText: 'Флюоресцентная булка R2-D3'
      })
      .first();

    const fillingCard = page
      .locator('[data-testid="ingredient"]')
      .filter({ hasText: 'Биокотлета из марсианской магнолии' })
      .first();
    const fillingName = await fillingCard
      .locator('.text_type_main-default')
      .innerText();

    const ingredientName = await ingredientCard
      .locator('.text_type_main-default')
      .textContent();

    await fillingCard.getByRole('button', { name: 'Добавить' }).click();
    await ingredientCard
      .getByRole('button', {
        name: 'Добавить'
      })
      .click();

    const constructor = page.locator('[data-testid="burger-constructor"]');

    await expect(constructor.locator(`text=${fillingName}`)).toBeVisible();
    await expect(
      constructor.locator(`text=${ingredientName} (верх)`)
    ).toBeVisible({ timeout: 10000 });
    await expect(
      constructor.locator(`text=${ingredientName} (низ)`)
    ).toBeVisible({ timeout: 10000 });
  });

  // Протестирована работа модальных окон:
  test('должен открывать модальное окно ингредиента по клику', async ({
    page
  }) => {
    const ingredientCard = page
      .locator('[data-testid="ingredient"]')
      .filter({
        hasText: 'Флюоресцентная булка R2-D3'
      })
      .first();
    const modal = page.locator('[data-testid="modal"]');
    await ingredientCard.click();

    await expect(modal).toBeVisible();
  });

  test('должен отоброжать корректные данные в модальном окне', async ({
    page
  }) => {
    const ingredientCard = page
      .locator('[data-testid="ingredient"]')
      .filter({
        hasText: 'Флюоресцентная булка R2-D3'
      })
      .first();
    const ingredientName = await ingredientCard
      .locator('.text_type_main-default')
      .textContent();
    await ingredientCard.click();

    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toBeVisible();

    const modalTitle = modal.locator('h3.text_type_main-medium');
    await expect(modalTitle).toHaveText(ingredientName || '');
  });

  test('должен закрывать модальное окно ингредиента по клику на крестик', async ({
    page
  }) => {
    const ingredientCard = page
      .locator('[data-testid="ingredient"]')
      .filter({
        hasText: 'Флюоресцентная булка R2-D3'
      })
      .first();
    await ingredientCard.click();

    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toBeVisible();

    const buttonClose = page.locator('[data-testid="modal-close"]');
    await buttonClose.click({ force: true });
    await expect(modal).toBeHidden({ timeout: 10000 });
  });

  test('должен закрывать модальное окно ингредиента по клику на оверлей', async ({
    page
  }) => {
    const ingredientCard = page
      .locator('[data-testid="ingredient"]')
      .filter({
        hasText: 'Флюоресцентная булка R2-D3'
      })
      .first();
    await ingredientCard.click();

    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toBeVisible();

    const buttonClose = page.locator('[data-testid="modal-overlay"]');
    await buttonClose.click({ position: { x: 10, y: 10 }, force: true });
    await expect(modal).toBeHidden({ timeout: 10000 });
  });
});

test.describe('Тнстирование создания заказа', () => {
  // Создание заказа:
  // Созданы моковые данные ответа на запрос данных пользователя.
  // Созданы моковые данные ответа на запрос создания заказа.
  // Подставляются моковые токены авторизации.
  // Собирается бургер.
  // Вызывается клик по кнопке «Оформить заказ».
  // Проверяется, что модальное окно открылось и номер заказа верный.
  // Проверяется, что конструктор пуст.
  // Закрывается модальное окно и проверяется успешность закрытия.
});
