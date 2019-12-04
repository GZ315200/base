export default {
  namespace: 'menus',
  state: {
    data: [],
  },
  reducers: {
    saveMenusInfo(state, action) {
      return {
        ...state,
        ...action.menusInfo,
      }
    },
  },
}
