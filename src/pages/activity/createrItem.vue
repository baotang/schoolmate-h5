<style lang="less" module>
    @import '../../assets/less/const.less';
    .content{
        display: flex;
        padding: 6px 0 12px;
        border-top: 1px solid @line-color-split;
    }
    .portrait{
        width: 60px;
        margin-right: 6px;
    .userText{
        margin-top: 6px;
    }
    }
    .desc{
        position: relative;
        flex: 1;
    .exchange{
        position: absolute;
        display: block;
        right: 12px;
        top: 8px;
        width: 80px;
        height: 24px;
        line-height: 24px;
        color: @theme-color;
        border: 1px solid @theme-color;
    &.gray{
         color: #fff;
         background-color: #C7CED2;
         border: none;
     }
    }
    & > div {
            margin-bottom: 11px;
        }
    .desText{
        display: flex;
        line-height: 1.3rem;
    }
    }
</style>
<template>
    <li :class="$style.content">
        <div :class="[$style.portrait,'text-center']">
            <div :class="$style.pic">
                <imgContain :imgUrl="dataInfo.photo" :onlyImage="true" style="width:40px ;height:40px"></imgContain>
            </div>
            <div :class="[$style.userText,'color-topic']">{{dataInfo.name || '姓名未填写'}}</div>
        </div>
        <div :class="$style.desc">
            <template v-if="!isSelf">
                <span :class="[$style.exchange,'text-center']" v-if="dataInfo.exchange_status == 0" @click.stop.prevent="exchange('exchange')">交换联系方式</span>
                <span :class="[$style.exchange,$style.gray,'text-center']" v-if="dataInfo.exchange_status == 1" @click.stop.prevent="exchange('cancel')">撤销</span>
                <span :class="[$style.exchange,'text-center']" v-if="dataInfo.exchange_status == 2" @click.stop.prevent="exchange('contact')">查看联系方式</span>
            </template>
            <template v-if="dataInfo.role=='student' || dataInfo.role =='在校学生'">
                <div>{{dataInfo.company || '河北地质大学'}}</div>
                <div>{{dataInfo.major || '专业未填写'}}</div>
                <div>学生</div>
            </template>
            <template v-else>
                <div>{{dataInfo.company || '公司未填写'}}</div>
                <div>{{dataInfo.department || '部门未填写'}}</div>
                <div>{{dataInfo.detail_job || '详细工作未填写'}}</div>
            </template>

        </div>
    </li>
</template>
<script>
    import {mapState} from 'vuex';
    import $api from  'api';
    export default{
        props:{
            isAuthor:Boolean,
            showInfo:Boolean,
            dataInfo:{
                type:Object,
                required: true
            }
        },
        computed:{
            ...mapState({
                profile:(state)=>state.user.profile
            }),

            isSelf(){
                return this.profile.uid == this.dataInfo.uid
            }
        },
        methods:{
            exchange(type){
                var {uid} = this.dataInfo;
                if(type == 'exchange'){
                    $api.post('/Profile/requestExchange',{uid})
                            .then(res => {
                                this.$toast(res.msg);
                                if(res.result) {
                                    this.dataInfo.exchange_status = 1;
                                }
                            },res=>{
                                this.$toast('服务器异常')
                            });
                }else if(type == 'cancel'){
                    $api.post('/Profile/cancelExchange',{uid})
                            .then(res => {
                                this.$toast(res.msg)
                                if(res.result) {
                                    this.dataInfo.exchange_status = 0;
                                }
                            },res=>{
                                this.$toast('服务器异常')
                            })
                }else{
                    this.$router.push(`/mine/contacts/${this.dataInfo.uid}`);
                }
            }
        }
    }
</script>
