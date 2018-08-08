<template>
    <div id="mapIndex">
        <map id="map" longitude="116.715790" latitude="23.362490"
             scale="18"  style="width: 100%; height: 100%;" bindtap="click">
        </map>

    </div>
</template>

<script>
    export default{
        data(){
            return{
                
            }
        },
        mounted(){
            
        },
        methods: {
            click: function (e) {
                wx.openLocation({
                    latitude: 23.362490,
                    longitude: 116.715790,
                    scale: 18,
                    name: '华乾大厦',
                    address:'金平区长平路93号'
                })
            },


        }
    }
</script>
<style rel="stylesheet/less" lang="less">
    page{
        height: 100%;
    }
    #mapIndex{
        height: 100%;
    }
</style>