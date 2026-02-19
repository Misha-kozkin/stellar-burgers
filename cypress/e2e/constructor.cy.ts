/// <reference types="cypress" />

describe('Тестирование главной страницы и конструктора', () => {
  // Селекторы
  const INGREDIENT_LINK = '[data-testid="ingredient-link"]';
  const ADD_BUTTON_TEXT = 'button:contains("Добавить")';
  const MODAL_CONTAINER = '[data-testid="modal-container"]';
  const MODAL_CLOSE_BTN = '[data-testid="modal-close-button"]';
  const MODAL_OVERLAY = '[data-testid="modal-overlay"]';
  const CONSTRUCTOR_BUN_TOP = '[data-testid="constructor-bun-top"]';
  const CONSTRUCTOR_INGREDIENTS = '[data-testid="constructor-ingredients"]';
  const ORDER_BUTTON = '[data-testid="order-button"]';
  const ORDER_NUMBER = '[data-testid="order-number"]';
  const BUN_NAME = 'Краторная булка N-200i';
  const MAIN_NAME = 'Биокотлета из марсианской Магнолии';

  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('postOrder');

    cy.setCookie('accessToken', 'Bearer_mikhail_secret_token_abc123');
    localStorage.setItem('refreshToken', 'mikhail_refresh_secret_789xyz');

    cy.visit('/');
    cy.wait('@getIngredients');

    // Убеждаемся, что список ингредиентов загрузился
    cy.get(INGREDIENT_LINK, { timeout: 15000 })
      .should('be.visible')
      .should('have.length.greaterThan', 8);

    cy.get(ADD_BUTTON_TEXT, { timeout: 10000 })
      .should('be.visible')
      .should('have.length.greaterThan', 5);
  });

  // Очистка данных после каждого теста
  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.clearLocalStorage();
  });

  describe('Модальное окно ингредиента', () => {
    it('Открывается и показывает корректные данные', () => {
      cy.contains(INGREDIENT_LINK, BUN_NAME).first().click();

      cy.get(MODAL_CONTAINER)
      .should('be.visible')
      .and('contain.text', BUN_NAME)
      .and('contain.text', '420')     // Калории
      .and('contain.text', '80')      // Белки
      .and('contain.text', '24')      // Жиры
      .and('contain.text', '53')      // Углеводы
      .and('contain.text', 'Калории, ккал')
      .and('contain.text', 'Белки, г')
      .and('contain.text', 'Жиры, г')
      .and('contain.text', 'Углеводы, г');

      cy.get(MODAL_CLOSE_BTN).click();
      cy.get(MODAL_CONTAINER).should('not.exist');
    });

    it('Закрывается по клику на крестик', () => {
      cy.contains(INGREDIENT_LINK, BUN_NAME).first().click();
      cy.get(MODAL_CLOSE_BTN).click();
      cy.get(MODAL_CONTAINER).should('not.exist');
    });

    it('Закрывается по клику на оверлей', () => {
      cy.contains(INGREDIENT_LINK, BUN_NAME).first().click();
      cy.get(MODAL_OVERLAY).click('topLeft', { force: true });
      cy.get(MODAL_CONTAINER).should('not.exist');
    });
  });

  describe('Конструктор и оформление заказа', () => {

    it('Булка и начинка корректно отображаются в конструкторе', () => {
      // Находим карточку с нужной булкой и кликаем по кнопке добавления внутри неё
      cy.contains(INGREDIENT_LINK, BUN_NAME)
        .parent()
        .within(() => {
          cy.get(ADD_BUTTON_TEXT).click({ force: true });
        });

      // То же самое для начинки
      cy.contains(INGREDIENT_LINK, MAIN_NAME)
        .parent()
        .within(() => {
          cy.get(ADD_BUTTON_TEXT).click({ force: true });
        });

      // Ждём появления в конструкторе
      cy.get(CONSTRUCTOR_BUN_TOP, { timeout: 10000 }).should('be.visible');

      // Проверяем точный текст с учётом (верх)
      cy.get(CONSTRUCTOR_BUN_TOP).should('contain.text', `${BUN_NAME} (верх)`);

      cy.get(CONSTRUCTOR_INGREDIENTS).should('contain.text', MAIN_NAME);
    });

    // Оформление заказа и проверка очистки
    it('Оформить заказ появляется модалка и конструктор очищается', () => {
      cy.contains(INGREDIENT_LINK, BUN_NAME)
        .parent()
        .within(() => {
          cy.get(ADD_BUTTON_TEXT).click({ force: true });
        });

      cy.contains(INGREDIENT_LINK, MAIN_NAME)
        .parent()
        .within(() => {
          cy.get(ADD_BUTTON_TEXT).click({ force: true });
        });

      cy.get(ORDER_BUTTON).click({ force: true });

      cy.wait('@postOrder').its('response.statusCode').should('eq', 200);

      cy.get(MODAL_CONTAINER).should('be.visible');

      // Проверяем номер заказа из order.json
      cy.get(ORDER_NUMBER)
        .should('be.visible')
        .and('have.text', '1111');

      cy.get(MODAL_CLOSE_BTN).click();
      cy.get(MODAL_CONTAINER).should('not.exist');

      // ПРОВЕРКА ОЧИСТКИ КОНСТРУКТОРА
      cy.get(CONSTRUCTOR_BUN_TOP).should('not.exist');
      cy.get(CONSTRUCTOR_INGREDIENTS).should('contain.text', 'Выберите начинку');
    });
  });
});