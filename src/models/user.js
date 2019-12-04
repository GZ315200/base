export default {
  namespace: 'user',
  state: {
    userId: '',
    userName: '',
    roles: null,
    authTree: {},
  },
  reducers: {
    saveUserInfo(state, action) {
      return {
        ...state,
        ...action.userInfo,
      }
    },
  },
}
