<template>
  <section class="app-main">
    <template v-if="$route.meta.noKey===true">
      <transition name="fade-transform" mode="out-in">
          <router-view v-if="$route.meta.noCache===true"/>    
      </transition>
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <router-view v-if="$route.meta.noCache===undefined || $route.meta.noCache===false"/>
        </keep-alive>
      </transition>
    </template>
    <template v-else>
      <transition name="fade-transform" mode="out-in">
          <router-view v-if="$route.meta.noCache===true" :key="key"/>    
      </transition>
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <router-view v-if="$route.meta.noCache===undefined || $route.meta.noCache===false" :key="key"/>
        </keep-alive>
      </transition>
    </template>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
}
</style>

