<template>
  <my-main></my-main>
</template>
<script>
import myMain from './components/menus/main'
import store from 'store/index'

export default {
  components: {myMain},
  data() {
    return {
      myMain
    };
  },
  created() {
    if (!this.$store) {
      throw new ReferenceError('引用模块的vuex模块缺失');
    }
    this.$store.registerModule('system', store);
  }


};
</script>
