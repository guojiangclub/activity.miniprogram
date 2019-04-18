<template>
    <div>
        <web-view :src="url">

        </web-view>
    </div>
</template>

<script type="text/ecmascript-6">
    export default  {
        data() {
            return {
                url: ''
            }
        },
        onShow() {
            var id = this.$root.$mp.query.id;
            this.url = this.$config.GLOBAL.baseUrl + 'activity/detail/' + id;
        }
    }
</script>