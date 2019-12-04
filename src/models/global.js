export default {
  namespace: 'global',
  state: {
    crumbs: [],
    asideIconOnly: false,
  },
  reducers: {
    setCrumbs(state, action) {
      return {
        ...state,
        crumbs: action.crumbs,
      }
    },
    changeAsideStatus(state, action) {
      return {
        ...state,
        asideIconOnly: action.asideIconOnly,
      }
    },
  },
}
