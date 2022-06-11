const store = {
  state: {
    user: null,
    menus: null
  },
  setUser(val) {
    this.state.user = val
  },
  setMenus(val) {
    this.state.menus = val
  }
};

export default store;
