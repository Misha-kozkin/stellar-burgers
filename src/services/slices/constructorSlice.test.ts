import constructorReducer, {
  addIngredient,
  removeIngredient,
  reorderIngredients
} from './constructorSlice';

describe('Тестирование слайса burgerConstructor', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockIngredient = {
    _id: '1',
    name: 'Начинка',
    type: 'main',
    price: 100,
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 400,
    image: 'img_url',
    image_large: 'img_url_l',
    image_mobile: 'img_url_m',
    id: 'unique_id_1'
  };

  it('должен обрабатывать добавление ингредиента', () => {
    const newState = constructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toEqual({
      ...mockIngredient,
      id: expect.any(String)
    });
  });

  it('должен обрабатывать добавление булки (замена текущей)', () => {
    const mockBun = {
      ...mockIngredient,
      type: 'bun',
      name: 'Булка 1',
      id: 'bun_1'
    };
    const nextBun = {
      ...mockIngredient,
      type: 'bun',
      name: 'Булка 2',
      id: 'bun_2'
    };

    let state = constructorReducer(initialState, addIngredient(mockBun));
    expect(state.bun?.name).toBe('Булка 1');

    state = constructorReducer(state, addIngredient(nextBun));
    expect(state.bun?.name).toBe('Булка 2');
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен обрабатывать удаление ингредиента', () => {
    const stateWithItem = {
      bun: null,
      ingredients: [mockIngredient]
    };
    const newState = constructorReducer(
      stateWithItem,
      removeIngredient(mockIngredient.id)
    );
    expect(newState.ingredients).toHaveLength(0);
  });

  it('должен обрабатывать изменение порядка ингредиентов', () => {
    const ingredient1 = { ...mockIngredient, id: 'id_1', name: 'Начинка 1' };
    const ingredient2 = { ...mockIngredient, id: 'id_2', name: 'Начинка 2' };

    const stateWithItems = {
      bun: null,
      ingredients: [ingredient1, ingredient2]
    };

    const newState = constructorReducer(
      stateWithItems,
      reorderIngredients({ from: 0, to: 1 })
    );

    expect(newState.ingredients).toHaveLength(2);

    expect(newState.ingredients[0].id).toBe('id_2');
    expect(newState.ingredients[1].id).toBe('id_1');
  });
});
