<template>
  <div class="container">
    {{motto}}
  </div>
</template>

<script>

export default {
  data () {
    return {
      motto: 'Hello World',
    }
  },

  methods: {
      getList(id ='all') {
          this.$http
            .get(this.$config.GLOBAL.baseUrl + 'api/activity/list/' + id, {
              page: 1
            }).then(res => {

            console.log(res);
          })
      }
  },

  created () {

      this.getList();
  }
}
</script>

<style rel="stylesheet/less" lang="less">

</style>
