import { rootReducer } from './store';

describe('Проверка rootReducer', () => {
  it('должен возвращать начальное состояние при передаче undefined и неизвестного экшена', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toEqual({
      user: expect.any(Object),
      ingredients: expect.any(Object),
      burgerConstructor: expect.any(Object),
      order: expect.any(Object),
      userOrders: expect.any(Object),
      feeds: expect.any(Object)
    });
  });
});
