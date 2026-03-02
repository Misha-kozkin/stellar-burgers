import userReducer, {
  authCheck,
  setUser,
  registerUser,
  loginUser,
  updateUser,
  logoutUser
} from './userSlice';

describe('Тестирование слайса user', () => {
  const initialState = {
    isAuthChecked: false,
    data: null,
    error: null
  };

  const mockUser = {
    email: 'mikhail_dev@yandex.kz',
    name: 'Mikhail'
  };

  // Тесты синхронных экшенов
  it('должен устанавливать флаг проверки авторизации (authCheck)', () => {
    const newState = userReducer(initialState, authCheck());
    expect(newState.isAuthChecked).toBe(true);
  });

  it('должен устанавливать данные пользователя (setUser)', () => {
    const newState = userReducer(initialState, setUser(mockUser));
    expect(newState.data).toEqual(mockUser);
  });

  // Тесты асинхронных экшенов (fulfilled)
  it('должен обновлять данные пользователя при registerUser.fulfilled', () => {
    const action = { type: registerUser.fulfilled.type, payload: mockUser };
    const newState = userReducer(initialState, action);
    expect(newState.data).toEqual(mockUser);
    expect(newState.isAuthChecked).toBe(true);
  });

  it('должен обновлять данные пользователя при loginUser.fulfilled', () => {
    const action = { type: loginUser.fulfilled.type, payload: mockUser };
    const newState = userReducer(initialState, action);
    expect(newState.data).toEqual(mockUser);
    expect(newState.isAuthChecked).toBe(true);
  });

  it('должен обновлять данные пользователя при updateUser.fulfilled', () => {
    const prevState = {
      ...initialState,
      data: { name: 'Old Name', email: 'old@test.ru' }
    };
    const action = { type: updateUser.fulfilled.type, payload: mockUser };
    const newState = userReducer(prevState, action);
    expect(newState.data).toEqual(mockUser);
  });

  it('должен очищать данные при logoutUser.fulfilled', () => {
    const stateWithUser = {
      ...initialState,
      data: mockUser,
      isAuthChecked: true
    };
    const action = { type: logoutUser.fulfilled.type };
    const newState = userReducer(stateWithUser, action);
    expect(newState.data).toBeNull();
  });
});
