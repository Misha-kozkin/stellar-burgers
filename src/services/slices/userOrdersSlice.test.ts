import userOrdersReducer, { fetchUserOrders } from './userOrdersSlice';

describe('Тестирование слайса userOrders', () => {
  const initialState = {
    orders: [],
    isLoading: false,
    error: null
  };

  const mockOrders = [
    {
      _id: 'order1',
      status: 'done',
      name: 'Бургер 1',
      createdAt: '2025-09-02T15:40:25.806Z',
      updatedAt: '2025-09-02T15:40:26.706Z',
      number: 111,
      ingredients: ['id1', 'id2']
    },
    {
      _id: 'order2',
      status: 'done',
      name: 'Бургер 2',
      createdAt: '2025-09-03T15:40:25.806Z',
      updatedAt: '2025-09-03T15:40:26.706Z',
      number: 222,
      ingredients: ['id3', 'id4']
    }
  ];

  it('должен устанавливать isLoading: true и сбрасывать ошибку при pending', () => {
    const prevState = { ...initialState, error: 'Предыдущая ошибка' };
    const action = { type: fetchUserOrders.pending.type };
    const state = userOrdersReducer(prevState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен записывать заказы и устанавливать isLoading: false при fulfilled', () => {
    const action = {
      type: fetchUserOrders.fulfilled.type,
      payload: mockOrders
    };
    const state = userOrdersReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.orders).toHaveLength(2);
  });

  it('должен записывать сообщение об ошибке и устанавливать isLoading: false при rejected', () => {
    const errorText = 'Ошибка загрузки заказов';
    const action = {
      type: fetchUserOrders.rejected.type,
      error: { message: errorText }
    };
    const state = userOrdersReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorText);
  });
});
