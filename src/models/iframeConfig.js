export default {
  namespace: 'iframeConfig',
  state: {
    routerList: {},
  },
  reducers: {
    saveIframeConfig(state, action) {
      return {
        ...state,
        ...action.iframeConfigInfo,
      }
    },
  },
}
