const store = {
  state: {
    user: null,
    menus: null,
    initMenu: false,
  },
  setUser(val) {
    this.state.user = val
  },
  setMenus(val) {
    this.state.menus = val
  },
  setInitMenu(val) {
    this.state.initMenu = val
  }
};

export default store;
