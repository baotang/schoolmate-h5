<style lang="less" module>
    @import '../../assets/less/const.less';
    .picWrap{
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        font-size: @font-size-header;
        height: 225px;
        color: #fff;
        background-image: linear-gradient(-180deg, #56AEEA 0%, #81D2F8 98%);
    .cover{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
    }
    }
    .imgAdd{
        position: relative;
        .btnAdd{
            display: block;
            width: 93px;
            height: 93px;
            margin: 0 auto 12px;
            background-size: contain;
            background-image: url("../../assets/images/bg-add-plus.png");
        }
    }
    .defaultImg{
        position: absolute;
        right: 12px;
        bottom: 12px;
    }
    .pictureContent{
        margin-top: 4px;
        &::after{
             content: '';
             display: block;
             height: 0;  clear:both;
         }
        .picItem{
            position: relative;
            float: left;
            width: 60px;
            height: 60px;
            overflow: hidden;
            background-color: #EFF0F3;
            margin-bottom: 12px;
            margin-right: ~"calc((100% - 300px)/4)";
            &:nth-child(5n){
                 margin-right: 0;
             }
            &:last-child{
                 background-color: #fff;
             }
            .img{
                margin-bottom: 6px;
            }
            .deletePic{
                position: absolute;
                top: 1px;
                right: 1px;
                width: 20px;
                height: 20px;
                background-size: contain;
                background-image: url("../../assets/images/icon-delete.png");
            }
        }
        .picAdd{
            position: relative;
            height: 100%;
            background-color: @theme-color-weak;
            color: #fff;
            padding-top: 5px;
            .btnAdd{
                display: block;
                margin:0 auto 5px ;
                width: 34px;
                height: 34px;
                background-size: contain;
                background-image: url("../../assets/images/bg-add-plus.png");
            }
        }
    }
</style>
<template>
    <div>
        <div class="content">
            <div :class="$style.picWrap">
                <ImgContain :class="$style.cover" :imgUrl="info.cover_file"></ImgContain>
                <Loading text="加载中..." :class="$style.loading" v-show="loading"></Loading>
                <div :class="[$style.imgAdd,'text-center']" v-show="!loading"  @click="coverUpload">
                    <i :class="$style.btnAdd"></i>
                    <span>添加封面</span>
                </div>
            </div>
            <div class="pub-info-content">
                <div class="pub-item">
                    <h3 class="pub-title">活动主题</h3>
                    <div class="pub-text">
                        <input type="text" class="pub-input" placeholder="填写28字以内活动主题" maxlength="28" v-model="info.theme">
                    </div>
                </div>
                <div class="pub-item">
                    <h3 class="pub-title">可见范围</h3>
                    <div class="pub-text">
                        <div class="pub-select" @click="showPicker('range')">
                            <span>{{ rangeStr }}</span>
                        </div>
                    </div>
                </div>
                <div class="pub-item">
                    <h3 class="pub-title">活动时间</h3>
                    <div class="pub-time-content">
                        <div class="pub-dfn-item" v-show="timeLimit">
                            <div class="dfn-label">
                                <!--<input type="text" class="dfn-input l-input">-->
                                <span class="inline-block dfn-span">开始时间：</span><div class="dfn-input l-input inline-block" @click="showPicker('showStartDatePicker')">{{ startDate}}</div><span class="inline-block">日期</span>
                            </div>
                            <div class="dfn-label">
                                <!--<input type="text" class="dfn-input s-input">-->
                                <div class="dfn-input s-input inline-block" @click="showPicker('showStartTimePicker')">{{ startTime.split(':')[0] }}</div><span class="inline-block">时</span>
                            </div>
                            <div class="dfn-label">
                                <!--<input type="text" class="dfn-input s-input">-->
                                <div class="dfn-input s-input inline-block" @click="showPicker('showStartTimePicker')">{{ startTime.split(':')[1] }}</div><span class="inline-block">分</span>
                            </div>
                        </div>
                        <div class="pub-dfn-item" v-show="timeLimit">
                            <div class="dfn-label">
                                <span class="inline-block dfn-span">结束时间：</span><div class="dfn-input l-input inline-block" @click="showPicker('showEndDatePicker')">{{ endDate}}</div><span class="inline-block">日期</span>
                            </div>
                            <div class="dfn-label">
                                <div class="dfn-input s-input inline-block" @click="showPicker('showEndTimePicker')">{{ endTime.split(':')[0] }}</div><span class="inline-block">时</span>
                            </div>
                            <div class="dfn-label">
                                <div class="dfn-input s-input inline-block" @click="showPicker('showEndTimePicker')">{{ endTime.split(':')[1] }}</div><span class="inline-block">分</span>
                            </div>
                        </div>
                        <div class="pub-dfn-item">
                            <div class="dfn-label">
                                <span class="inline-block dfn-span"><span v-show="!timeLimit">开始时间：</span></span><div class="dfn-input l-input inline-block dfn-box" :class="{on: !timeLimit}" @click="switchTime"><span>不限时间</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pub-item">
                    <h3 class="pub-title">活动地址</h3>
                    <div class="pub-text">
                        <input type="text" class="pub-input" placeholder="填写您的具体活动地址" v-model="info.place">
                    </div>
                </div>
                <div class="pub-item">
                    <h3 class="pub-title">联系方式</h3>
                    <div class="pub-text">
                        <input type="text" class="pub-input" placeholder="填写联系人号码" v-model="info.contact">
                    </div>
                </div>
                <div class="pub-item">
                    <h3 class="pub-title">活动费用</h3>
                    <div class="pub-time-content">
                        <div class="pub-dfn-item" v-show="!free">
                            <div class="dfn-label">
                                <span class="inline-block dfn-span"><span>单人收费：</span></span><input type="tel" class="dfn-input l-input" v-model="info.fee">
                            </div>
                        </div>
                        <div class="pub-dfn-item">
                            <div class="dfn-label">
                                <span class="inline-block dfn-span">免&nbsp;&nbsp;&nbsp;费：</span><div class="dfn-input l-input inline-block dfn-box" :class="{on: free}" @click="switchFee"><span>免费</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pub-item">
                    <h3 class="pub-title">限定人数</h3>
                    <div class="pub-text">
                        <input type="tel" class="pub-input" placeholder="请填写参加活动的限制人数，填0为不限制人数" v-model="info.amount">
                    </div>
                </div>
                <div class="pub-item">
                    <h3 class="pub-title">活动描述</h3>
                    <div class="pub-text">
                        <textarea class="pub-area" placeholder="填写活动的具体注意事项、详细信息等" v-model="info.description"></textarea>
                    </div>
                </div>
                <div class="pub-item">
                    <h3 class="pub-title">活动宣传图片</h3>
                    <div class="pub-text">
                        <div :class="$style.pictureContent">
                            <ImgContain :class="[$style.picItem]" v-for="(url,index) in uploadImageArr" :imgUrl="url">
                                <i :class="$style.deletePic" @click="deletePic(url)" v-if="url"></i>
                                <template v-if="index == uploadImageArr.length-1 && !url">
                                    <div :class="[$style.picAdd,'text-center']" v-show="!picUploading" @click="aPicUpload">
                                        <i :class="$style.btnAdd"></i>
                                        <span>点击上传</span>
                                    </div>
                                    <Loading text="加载中" :class="$style.loading" v-show="picUploading"></Loading>
                                </template>
                            </ImgContain>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pubBar" @click="publish"><span v-if="edit">重新发布</span><span v-else>发布</span></div>
        </div>
        <timePicker
                :showPicker="showStartDatePicker"
                :initDate="info.time"
                :startDate="dateNow"
                ref="showStartDate"
                pickerRef="showStartDatePicker"
                @selectEnd="selectStartDate"
        ></timePicker>
        <timePicker
                :showPicker="showEndDatePicker"
                :initDate="info.end_time"
                :startDate="startDate"
                ref="showEndDate"
                pickerRef="showEndDatePicker"
                @selectEnd="selectEndDate"
        ></timePicker>
        <timePicker
                :showPicker="showStartTimePicker"
                :initDate="info.time"
                pickerType="time"
                ref="showStartTime"
                pickerRef="showStartTimePicker"
                @selectEnd="selectStartTime"
        ></timePicker>
        <timePicker
                :showPicker="showEndTimePicker"
                :initDate="info.end_time"
                pickerType="time"
                ref="showEndTime"
                pickerRef="showEndTimePicker"
                @selectEnd="selectEndTime"
        ></timePicker>
        <singlePicker v-if="!loadingCircle && !loadingInfo"
              :dataArr="rangeOptions"
              valueKey="name"
              :initValue="info.cid"
              :showPicker="showRange"
              @selectEnd="selectRange"
              @hide="hidePicker"
        ></singlePicker>
    </div>

</template>
<script>
    import { timePicker,singlePicker } from '../../components/popPicker';
    import util from  '../../util';
    import $api from 'api';
    import {mapState} from 'vuex';
    import {chooseImage, uploadImage, register} from '../../util/wechat-api';

    export default {
        components:{
            timePicker,
            singlePicker
        },
        data(){
            return {
                showStartDatePicker: false,
                showEndDatePicker: false,
                showStartTimePicker: false,
                showEndTimePicker: false,
                showRange: false,
                rangeOptions: [{name:'所有人可见',value:'0'}],
                edit:false,
                uploadCount: 0,
                info:{
                    theme:'',
                    time:'',
                    end_time: '',
                    description:'',
                    place:'',
                    cover_file:'',
                    amount:'',
                    fee:'',
                    contact: '',
                    cid: '0',
                    pictures:[]
                },
                loading: false,
                loading2: false,
                picUploading: false,
                loadingCircle: true,
                loadingInfo: true,
                showBgImage: false,
                dateNow: util.dateFormat(new Date(),'yyyy/MM/dd'),
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                free: false,
                timeLimit: true,
                popupVisible: false
            }
        },
        computed:{
          ...mapState({
            profile: (state) => state.user.profile
          }),
            rangeStr(){
                let str ;
                this.rangeOptions.forEach(obj=>{
                    if(obj.value == this.info.cid){
                        str = obj.name;
                    }
                });
                return str;
            },
            uploadImageArr(){
                let arr = [...this.info.pictures];
                arr.length = 10;
                return arr;
            },
            limitTime(){
                return this.startDate + ' ' + this.startTime;
            }
        },
        methods:{
            selectStartDate(val){
                this.hidePicker();
                console.log(val);
                this.startDate = val;
            },
            selectEndDate(val){
                this.hidePicker();
                this.endDate = val;
            },
            selectStartTime(val){
                this.hidePicker();
                this.startTime = val;
            },
            selectEndTime(val){
                this.hidePicker();
                this.endTime = val;
            },
            selectRange(obj){
                this.info.cid = obj.value;
                this.hidePicker();
            },
            hidePicker(){
                this.showStartDatePicker = false;
                this.showEndDatePicker = false;
                this.showStartTimePicker = false;
                this.showEndTimePicker = false;
                this.showRange = false;
            },
            showPicker(name){
                if(name != 'range'){
                    let ref = name.slice(0,-6);
                    this.$refs[ref].$refs[name].open();
                    this[name] = true;
                }else{
                    this.showRange = true;
                }
            },
            deleteImage(img){
                console.log(img);
            },
            switchTime(){
                this.timeLimit = !this.timeLimit;
            },
            switchFee(){
                this.free = !this.free;
            },

            deletePic(img){
              let index = this.info.pictures.indexOf(img);
              if(~index){
                this.info.pictures.splice(index,1);
              }
            },
            coverUpload(){
                 util.wxUpload({count:1,onSelectEnd:()=>this.loading = true})
                   .then(wxIds=>{
                     util.getPathByIds(wxIds)
                       .then(res=>{
                         this.loading = false;
                         if(res.path[0]){
                           this.info.cover_file = res.path[0];
                         }else{
                           this.$toast('上传图片失败');
                         }
                       },err=>{
                         console.log(err);
                       })
                 })
            },
            aPicUpload(){
                let count = 10 - this.info.pictures.length ;
                count = count > 9 ? 9 : count;
                util.wxUpload({count,onSelectEnd:()=>this.picUploading = true})
                  .then(wxIds=>{
                    util.getPathByIds(wxIds)
                      .then(res=>{
                        this.picUploading = false;
                        if(res.path[0]){
                          this.info.pictures = [...this.info.pictures,...res.path];
                        }else{
                          this.$toast('上传图片失败');
                        }
                      },err=>{
                        console.log(err);
                      })
                  });
            },
            valid(){
                  if(!this.info.cover_file){
                    this.$toast('请上传活动封面');
                    return false;
                  }
                if(!this.info.theme){
                    this.$toast('活动主题不能为空');
                    return false;
                }
                if(!this.info.place){
                    this.$toast('活动地址不能为空');
                    return false;
                }
                if(!this.info.contact){
                    this.$toast('联系方式不能为空');
                    return false;
                }

                if(!this.free && !/[1-9]\d*/.test(this.info.fee)){
                    this.$toast('活动费用不正确');
                    return false;
                }
                if(!this.info.amount){
                    this.$toast('限定人数未填写');
                    return false;
                }
                if(this.info.description == ''){
                    this.$toast('活动描述未填写');
                    return false;
                }
                if(this.timeLimit){
                    if(!this.startDate || !this.endDate || !this.startTime || !this.endTime){
                        this.$toast('活动时间不能为空');
                        return false;
                    }
                }
                return true;
            },
            getParams(){
                let obj = Object.assign({},this.info);
                if(this.free){
                    obj.fee = 0;
                }
                if(!this.timeLimit){
                    obj.time = 0;
                    obj.end_time = 0;
                }else{
                    obj.time = String(new Date(this.startDate + ' ' + this.startTime).getTime());
                    obj.end_time = String(new Date(this.endDate + ' ' + this.endTime).getTime());
                }
                return obj;
            },
            publish(){
                if(!this.valid())return false;
                var paramObj = this.getParams();
                if(paramObj.time * 1 > paramObj.end_time *1){
                    this.$toast('开始时间不能大于结束时间');
                    return false;
                }
                if(paramObj.aid){
                    $api.post('/Activity/upActivity',paramObj)
                    .then(res=>{
                        this.$toast(res.msg);
                        if(res.result){
                            this.$router.back();
                        }
                    },res=>{
                        this.$toast('服务器异常');
                    })
                }else{
                    $api.post('/Activity/upActivity',paramObj)
                    .then(res=>{
                        if(res.code == 200){
                            this.$router.back();
                          this.$toast('发布成功');
                        }
                    },res=>{
                        this.$toast('服务器异常');
                    })
                }
            }
        },
        created(){
            register(window.location.href);
            $api.get('/Circle/getMyCircle')
            .then(res=>{
                res.forEach(circle => {
                    var obj = {
                        name: circle.c_name,
                        value: circle.cid,
                    };
                    this.rangeOptions.push(obj);
                });
                this.loadingCircle = false;
            },res=>{
                console.log(res);
            });
            let {aid} =  this.$route.query;
            if(aid){
                this.edit = true;
                $api.get('/Activity/getDetail',{aid})
                .then(res=>{
                    let data = res.info;
                    let keyArr = Object.keys(this.info);
                    keyArr.forEach(key=>{
                       this.info[key] = data[key];
                    });
                    this.info.aid = data.aid;
                    this.info.pictures = res.pictures;
                    this.showBgImage = true;
                    if(this.info.time == '0' || this.info.end_time == '0'){
                        this.info.time = '';
                        this.info.end_time = '';
                        this.timeLimit = false;
                    }else{
                        let dateStart = new Date(this.info.time * 1000);
                        let dateEnd = new Date(this.info.end_time * 1000);
                        this.info.time = util.dateFormat(dateStart,'yyyy/MM/dd');
                        this.info.end_time = util.dateFormat(dateEnd,'yyyy/MM/dd');
                        this.startDate = util.dateFormat(dateStart,'yyyy/MM/dd');
                        this.endDate = util.dateFormat(dateEnd,'yyyy/MM/dd');
                        this.startTime = util.dateFormat(dateStart,'HH:mm');
                        this.endTime = util.dateFormat(dateEnd,'HH:mm');
                    }
                    if(!parseInt(this.info.fee)){
                        this.free = true;
                        this.info.fee = '';
                    }
                    this.loadingInfo = false;
                },err=>{
                    this.$toast({message: err});
                });
            }else {
              this.info.contact = this.profile.phonenum;
              this.loadingInfo = false;
            }
        }
    }
</script>