<template>
    <div id="picker-date">
        <picker :disabled="disabled" mode="multiSelector" @change="pickerChange" @columnchange="pickerColumnChange" @cancel ="pickerCancel" :value="pickerIndex" :range="pickerArray" range-key="name">
            <div style="color: #000000">
                {{dateString}}
            </div>
        </picker>
    </div>
</template>
<script>
    import { is, cityArr } from '../utils';
    export default{
        props: {
            date: {            // 属性名
                type: null,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
                value: null     // 属性初始值（可选），如果未指定则会根据类型选择一个
            },
            startDate: {
                type: null,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
                value: null     // 属性初始值（可选），如果未指定则会根据类型选择一个
            },
            endDate: {
                type: null,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
                value: null     // 属性初始值（可选），如果未指定则会根据类型选择一个
            },
            disabled: {
                type: null,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
                value: false     // 属性初始值（可选），如果未指定则会根据类型选择一个
            },
            placeholder: {
                type: null,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
                value: null     // 属性初始值（可选），如果未指定则会根据类型选择一个
            }
        },
        data(){
            return{
                pickerArray: [],//日期控件数据list
                pickerIndex: [],//日期控件选择的index
                chooseIndex: [],//日期控件确认选择的index
                chooseArray: [],//日期控件确认选择后的list
                dateString: '',//页面显示日期
            }
        },
        mounted(){
            this._onInit()
        },
        watch:{
            /*show(val){
                this.visible = val
            }*/
        },
        methods:{
            _onInit() {
                let date = new Date();
                if (this.date != null) {
                    let str = this.date;
                    str = str.replace(/-/g, "/");
                    date = new Date(str);
                }
                let pickerArray = this.pickerArray;
                // console.log(date.getFullYear());
                //默认选择3年内
                let year = [];
                let startDate = date.getFullYear() - 1;
                let endDate = date.getFullYear() + 1;
                if (this.startDate != null) {
                    //如果存在开始时间，则默认设置结束时间为2099
                    startDate = this.startDate;
                    endDate = 2099;
                }
                if (this.endDate != null && this.startDate == null) {
                    //如果存在结束时间，不存在开始时间 则默认设置开始时间为1900
                    endDate = this.endDate;
                    startDate = 1900;
                }
                if (this.endDate != null && this.startDate != null) {
                    endDate = this.endDate;
                }
                if (startDate > date.getFullYear() || endDate < date.getFullYear()){
                        this.dateString = "默认日期不在时间范围内"
                    return;
                }
                for (let i = startDate; i <= endDate; i++) {
                    year.push({ id: i, name: i });
                }
                // console.log(year);
                let month = [];
                for (let i = 1; i <= 12; i++) {
                    month.push({ id: i, name: i });
                }
                // console.log(month);
                let dayNum = this._getNumOfDays(date.getFullYear(), date.getMonth() + 1);
                let day = [];
                for (let i = 1; i <= dayNum; i++) {
                    day.push({ id: i, name: i });
                }
                // console.log(day);
                let time = [];
                for (let i = 0; i <= 23; i++) {
                    if (i < 10) {
                        time.push({ id: i, name: "0" + i  });
                    } else {
                        time.push({ id: i, name: i });
                    }
                }
                // console.log(time);
                let division = [];
                for (let i = 0; i <= 59; i++) {
                    if (i < 10) {
                        division.push({ id: i, name: "0" + i });
                    } else {
                        division.push({ id: i, name: i });
                    }
                }
                // console.log(division);
                pickerArray[0] = year;
                pickerArray[1] = month;
                pickerArray[2] = day;
                pickerArray[3] = time;
                pickerArray[4] = division;
                let mdate = {
                    date: date,
                    year: date.getFullYear() + '',
                    month: date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1 + '',
                    day: date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + '',
                    time: date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + '',
                    division: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ''
                }
                mdate.dateString = mdate.year + '-' + mdate.month + '-' + mdate.day + ' ' + mdate.time + ':' + mdate.division;
                    this.pickerArray = pickerArray;
                    this.pickerIndex =  [date.getFullYear() - startDate, date.getMonth(), date.getDate() - 1, date.getHours(), date.getMinutes()];
                    this.chooseIndex = [date.getFullYear() - startDate, date.getMonth(), date.getDate() - 1, date.getHours(), date.getMinutes()];
                    this.chooseArray = pickerArray;
                    this.dateString = this.placeholder != null ? this.placeholder : mdate.dateString
                // console.log(date);
                //设置placeholder属性后 初始化不返回日期
                if (this.placeholder == null){
                    this.$emit('onPickerChange', mdate);
                }
                // console.log(this.data.pickerArray);
                // console.log(this._getNumOfDays(2018, 10));
            },
            /**
             *
             * 获取本月天数
             * @param {number} year
             * @param {number} month
             * @param {number} [day=0] 0为本月0最后一天的
             * @returns number 1-31
             */
            _getNumOfDays(year, month, day = 0) {
                return new Date(year, month, day).getDate()
            },
            pickerChange: function (e) {
                // console.log('picker发送选择改变，携带值为', e.detail.value)
                let indexArr = e.mp.detail.value;
                // console.log(this.data.pickerArray[0][indexArr[0]].id + "\n" + this.data.pickerArray[1][indexArr[1]].id + "\n" + this.data.pickerArray[2][indexArr[2]].id);
                const year = this.pickerArray[0][indexArr[0]].id;
                const month = this.pickerArray[1][indexArr[1]].id;
                const day = this.pickerArray[2][indexArr[2]].id;
                const time = this.pickerArray[3][indexArr[3]].id;
                const division = this.pickerArray[4][indexArr[4]].id;
                let date = {
                    date: new Date(year + '-' + month + '-' + day + ' ' + time + ':' + division),
                    year: year + '',
                    month: month < 10 ? '0' + month : month + '',
                    day: day < 10 ? '0' + day : day + '',
                    time: time < 10 ? '0' + time : time + '',
                    division: division < 10 ? '0' + division : division + ''
                }
                date.dateString = date.year + '-' + date.month + '-' + date.day + ' ' + date.time + ':' + date.division;
                // console.log(date);
                    this.chooseIndex =  e.mp.detail.value;
                    this.chooseArray =  this.pickerArray;
                    this.dateString =  date.dateString;
                    this.$emit('onPickerChange', date);
            },
            pickerColumnChange: function (e) {
                // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
                /*var data = {
                    pickerArray: this.pickerArray,
                    pickerIndex: this.pickerIndex
                };*/
                let newPickerIndex = this.pickerIndex.slice(0);
                let newPickerArray = this.pickerArray.slice(0);

                newPickerIndex[e.mp.detail.column] = e.mp.detail.value;
                if (e.mp.detail.column == 1) {
                    let dayNum = this._getNumOfDays(this.pickerArray[0][newPickerIndex[0]].id, e.mp.detail.value + 1);
                    let day = [];
                    for (let i = 1; i <= dayNum; i++) {
                        day.push({ id: i, name: i });
                    }
                    if (dayNum < newPickerIndex[2] + 1) {
                        newPickerIndex[2] = dayNum - 1;
                    }
                    console.log(day);
                    newPickerArray[2] = day;
                }
                /*this.setData(data);*/
                this.pickerArray = newPickerArray;
                this.pickerIndex = newPickerIndex;
            },
            pickerCancel: function (e) {
                // console.log("取消");
                    this.pickerIndex = this.chooseIndex;
                    this.pickerArray = this.chooseArray
            },
        },

    }
</script>
<style rel="stylesheet/less" lang="less">
    #picker-date{

    }
</style>