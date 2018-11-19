<template>
    <div class="profile-city-list" v-show="visible">
        <div class="search  mx-1px-bottom">
            <div class="left" @click="hide">取消</div>
        </div>
        <div class="full">
           <!-- <div class="current mx-1px-bottom">
                热门城市
            </div>-->

            <div class="list">
                <div class="label mx-1px-bottom">
                    热门城市
                </div>
                <div class="city mx-1px-bottom" @click="onSelect(item)" v-for="item in hot_list">
                    {{ item }}
                </div>
                <div class="mx-1px-bottom" :id="item.click ? '' : 'city_block_' + item.name" :class="item.class" @click="item.click ? onSelect(item.name) : ''" v-for="item in data_list">
                    {{ item.name }}
                </div>
            </div>

            <!--<div class="nav-right">
                &lt;!&ndash;needsclick可有效解决滚动后无法点击城市的bug&ndash;&gt;
                <span @click="scroll('city_block_' + a)" class="needsclick" v-for="a in alphabets">{{a}}</span>
            </div>-->
        </div>

        <!--<div class="full" v-show="keyword">
            <div class="city mx-1px-bottom" @click="onSelect(item[1])" v-for="item in search_list">
                {{ item[1] }}
            </div>
        </div>-->
    </div>
</template>
<script>
    import { is, cityArr } from '../utils';
    export default{
        props: {
            show: {
                type: Boolean,
                default: false
            },
            value: {
                type: String,
                default: null
            }
        },
        data(){
            return{
                visible: this.show,
                hot_list : ['上海', '北京', '深圳', '广州', '南京', '杭州', '武汉'],
                data_list:[],
            }
        },
        mounted(){
            var current_alphabet = '';
            var data_list = [];
            var alphabets = [];
            cityArr.forEach(item=>{
                let alphabet = item[0].substring(0, 1);
                if (alphabet !== current_alphabet) {
                    current_alphabet = alphabet;
                    alphabets.push(alphabet);
                    data_list.push({
                        name: alphabet,
                        class: 'label'
                    });
                }

                data_list.push({
                    name: item[1],
                    class: 'city',
                    click: true
                });
            })
            this.alphabets = alphabets;
            this.data_list = data_list;
        },
        watch:{
          show(val){
              this.visible = val
          }
        },
        methods:{
            hide() {
                this.visible = false;
                this.$emit('on-cancel');
            },
            onSelect(val) {
                this.hide();
                this.$emit('on-select', val);
            },
        }
    }
</script>
<style rel="stylesheet/less" lang="less">
    .profile-city-list {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 100;
        background-color: #ffffff;

        .search {
            height: 45px;
            display: flex;
            background-color:#FFFFFF;
            font-size: 16px;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            z-index: 110;

            &.mx-1px-bottom:before {
                border-color: #dddddd;
            }

            .left {
                height: 45px;
                line-height: 45px;
                padding: 0 20px;
            }

            .right {
                flex: 1;
                overflow: hidden;
                padding: 5px 30px 5px 0;
            }

            input {
                width: 100%;
                box-sizing: border-box;
                border: solid 1px #dddddd;
                height: 35px;
                padding: 0 15px;
                border-radius: 35px;
                outline: none;
                font-size: 15px;
                appearance: none;
            }
        }

        .current {
            position: absolute;
            left: 0;
            right: 0;
            top: 45px;
            z-index: 110;

            .label
        }

        .label {
            height: 30px;
            line-height: 30px;
            background-color: #f9f9f9;
            padding-left: 15px;
            font-size: 12px;
        }

        .city {
            height: 40px;
            line-height: 40px;
            padding-left: 15px;
            font-size: 15px;
        }

        .full {
            height: 100%;
            width: 100%;
            box-sizing: border-box;
            padding-top: 45px;
        }

        .list {
            height: 100%;
            overflow: auto;
        }

        .mx-1px-bottom:before {
            border-color: #eeeeee;
        }

        .nav-right {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 998;
            padding-top: 80px;
            padding-bottom: 30px;
            display: flex;
            flex-direction: column;
            align-content: space-between;

            span{
                width: 50px;
                flex-grow: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #777;
                text-decoration: none;
            }
        }
    }
</style>