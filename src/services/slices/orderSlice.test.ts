import orderReducer, { placeOrder, clearOrder } from './orderSlice';

describe('Тестирование слайса order', () => {
  const initialState = {
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  const mockOrder = {
    _id: '643d69a5c3f7b9001cfa093d',
    status: 'done',
    name: 'Space флюоресцентный бургер',
    createdAt: '2025-09-02T15:40:25.806Z',
    updatedAt: '2025-09-02T15:40:26.706Z',
    number: 777777,
    ingredients: ['id1', 'id2']
  };

  // Тест синхронного экшена
  it('должен очищать данные заказа при вызове clearOrder', () => {
    const stateWithOrder = {
      ...initialState,
      orderModalData: mockOrder
    };
    const newState = orderReducer(stateWithOrder, clearOrder());
    expect(newState.orderModalData).toBeNull();
  });

  // Тесты асинхронного экшена Thunk
  it('должен менять orderRequest на true при pending', () => {
    const action = { type: placeOrder.pending.type };
    const state = orderReducer(initialState, action);
    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен записывать данные заказа и менять orderRequest на false при fulfilled', () => {
    const action = {
      type: placeOrder.fulfilled.type,
      payload: mockOrder
    };
    const state = orderReducer(initialState, action);
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
  });

  it('должен записывать ошибку и менять orderRequest на false при rejected', () => {
    const errorText = 'Ошибка заказа';
    const action = {
      type: placeOrder.rejected.type,
      error: { message: errorText }
    };
    const state = orderReducer(initialState, action);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe(errorText);
  });
});
