import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';

describe('Тестирование слайса ingredients (async thunk)', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  it('должен менять isLoading на true при pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен загружать данные и менять isLoading на false при fulfilled', () => {
    const mockData = [{ _id: '1', name: 'Ингредиент' }];
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockData
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockData);
  });

  it('должен записывать ошибку и менять isLoading на false при rejected', () => {
    const errorText = 'Ошибка сервера';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorText }
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorText);
  });
});
