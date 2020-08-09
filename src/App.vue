<template>
  <div id="app">
    <system-frame :show-frame="true" :breadcrumb="true">
      <div slot="routerView" class="wraper">
      </div>
    </system-frame>
  </div>
</template>

<script>

import App from './app';
import Vue from 'vue';
Vue.use(App);
export default {
  name: 'app',

  data() {
    return {

    };
  },
  methods: {

  },
};
</script>

<style>
.wraper {
  width: 100%;
  height: 2000px;
}
.department-box {
  width: 180px;
}
</style>
