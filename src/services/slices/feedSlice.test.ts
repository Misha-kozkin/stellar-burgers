import feedsReducer, { fetchFeeds } from './feedSlice';

describe('Тестирование слайса feeds', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null
  };

  const mockFeedData = {
    orders: [
      {
        _id: 'order_1',
        status: 'done',
        name: 'Космический бургер',
        createdAt: '2025-09-02T15:40:25.806Z',
        updatedAt: '2025-09-02T15:40:26.706Z',
        number: 123,
        ingredients: ['id1', 'id2']
      }
    ],
    total: 1500,
    totalToday: 50
  };

  it('должен устанавливать isLoading: true и сбрасывать ошибку при pending', () => {
    const prevState = { ...initialState, error: 'Ошибка' };
    const action = { type: fetchFeeds.pending.type };
    const state = feedsReducer(prevState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен записывать данные ленты и устанавливать isLoading: false при fulfilled', () => {
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: mockFeedData
    };
    const state = feedsReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockFeedData.orders);
    expect(state.total).toBe(1500);
    expect(state.totalToday).toBe(50);
  });

  it('должен записывать ошибку и устанавливать isLoading: false при rejected', () => {
    const errorText = 'Ошибка загрузки ленты';
    const action = {
      type: fetchFeeds.rejected.type,
      error: { message: errorText }
    };
    const state = feedsReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorText);
  });
});
