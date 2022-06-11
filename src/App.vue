<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  created() {
    this.$api.getAllDictList({
      callback:(res) => {
        localStorage.setItem(g.dictionary, JSON.stringify(res));
      },
      failure: (error) => {
        return false;
      }
    });
  },
  mounted() {
    function checkIE() {
      return (
          "-ms-scroll-limit" in document.documentElement.style &&
          "-ms-ime-align" in document.documentElement.style
      );
    }
    if (checkIE()) {
      window.addEventListener(
          "hashchange",
          () => {
            var currentPath = window.location.hash.slice(1);
            if (this.$route.path !== currentPath) {
              this.$router.push(currentPath);
            }
          },
          false
      );
    }
  },
  methods: {
  
  }
}
</script>
