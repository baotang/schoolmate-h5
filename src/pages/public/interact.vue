<style lang="less" module>
    @import '../../assets/less/const.less';
    .content{
        background-color: #fff;
        padding: 6px 0;
        & > div{
        padding: 0 12px;
            }
    }
    .desc{
        line-height: 1.4rem;
    }
    .imgContent{
        margin: 6px 0;
        display: flex;
    }
    .imgItem{
        width: 80px;
        height: 80px;
        margin-right: ~"calc(25% - 80px)";
        background-size: cover;
    }
    .user{
        display: flex;
        padding-bottom: 6px !important;
        margin-bottom: 6px !important;
        border-bottom: 1px solid @line-color-split;
        .name{
            margin-top: 6px;
            width: 40px;
        }
        .info{
            position: relative;
            margin-left: 11px;
            flex: 1;
            .label{
                margin-top: 0;
                display: flex;
                justify-content: space-between;
            }
            & > div{
                margin-top: 10px;
            }
            .infoBtn{
                position: absolute;
                right: 0;
                bottom: 3px;
                width: 80px;
                height: 24px;
                line-height: 24px;
                text-align: center;
                color: @theme-color;
                border: 1px solid @theme-color;
                &.hint{
                    color: @hint-color;
                     border-color: @hint-color;
                 }
            }
        }
    }
    .icon{
        width: 12px;
        height: 12px;
        background-size: contain;
        background-repeat:no-repeat;
        &.iconLocation{
             background-image: url('../../assets/images/icon-location.png');
        }
         &.iconRemove{

              background-image: url('../../assets/images/icon-remove.png');
          }
    }
    .remove{
        padding: 10px 0;
    }
</style>
<template>
    <div :class="$style.content">
        <div :class="$style.user">
            <div>
                <imgContain :imgUrl="dataInfo.photo" :onlyImage="true" style="width:40px ;height:40px"></imgContain>
                <div :class="[$style.name,'color-topic','one-line']">
                    {{dataInfo.creater.name}}
                </div>
            </div>
            <div :class="$style.info">
                <div :class="$style.label">
                    <div>
                        <span v-if="dataInfo.enrol_time">{{dataInfo.enrol_time.slice(0,4)}}级</span>
                        <span v-if="dataInfo.enrol_time"> | </span>
                        <span v-if="dataInfo.creater.major">{{dataInfo.creater.major}}</span>
                    </div>
                    <div>
                        <i :class="['inline-block',$style.icon,$style.iconLocation]"></i>
                        <span class="inline-block">{{ dataInfo.province + '-' + dataInfo.city}}</span>
                    </div>
                </div>
                <div>
                    <span>{{dataInfo.creater.company}}</span>
                </div>
                <div>
                    <span>{{dataInfo.creater.detail_job}}</span>
                </div>
                <template v-if="!isSelf">
                    <span :class="$style.infoBtn" @click.stop.prevent="collaborate" v-if="!dataInfo.applied">申请合作</span>
                    <span :class="[$style.infoBtn,$style.hint]" @click.stop.prevent="revocation"  v-if="dataInfo.applied">撤销</span>
                </template>
                <template v-else>
                    <span :class="$style.infoBtn" @click.stop.prevent="goContacts">合作名单</span>
                </template>
            </div>
        </div>
        <div :class="$style.desc">
            <span v-if="dataInfo.type == 2" class="color-theme size-topic">拥有资源：</span>
            <span v-else　class="color-hint size-topic">寻求合作：</span>
            <div v-transform="dataInfo.description"></div>
        </div>
        <div class="text-right">
            <time class="weak">{{dataInfo.create_time | dateFormat('yyyy/MM/dd') }}</time>
        </div>
        <div :class="$style.imgContent" v-if="!dataInfo.noPicture">
            <ImgLazy :imgUrl="url" :class="$style.imgItem" v-if="index < 4 && url"  @click.native="showSwiper(index)" type="square" v-for="(url,index) in dataInfo.pictures"></ImgLazy>
        </div>
        <div class="text-right weak" v-if="isSelf">
            <span :class="[$style.remove,'inline-block']" @click.stop.prevent="remove">
                <i :class="['inline-block',$style.icon,$style.iconRemove]"></i>
                <span class="inline-block">撤销发布</span>
            </span>
        </div>
    </div>
</template>
<script>
  import {serverUrl} from '../../config';
  import {mapState} from 'vuex'
  import $api from 'api';
  import Util from '../../util'
  export default {
    props: {
      dataInfo: {
        type: Object,
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
      showSwiper(currentIndex){
        if(!this.dataInfo.pictures[currentIndex]) return;
          this.$emit('showSwiper',{
              imageArr:this.dataInfo.pictures,
              currentIndex
          });
      },
      collaborate(){
          Util.isAuthored().then(() => {
              $api.post('/Help/apply',{rid:this.dataInfo.rid})
                      .then(res => {
                          this.$toast(res.msg);
                          if(res.code == 200){
                              this.dataInfo.applied = true;
                          }
                      },res=>{
                          this.$toast('服务器异常')
                      });
          },()=>{});
      },
      revocation(){
          Util.isAuthored().then(() => {
              $api.post('/Help/revokeCoApply',{rid:this.dataInfo.rid})
                      .then(res => {
                          this.$toast(res.msg);
                          if(res.code == 200){
                              this.dataInfo.applied = false;
                          }
                      },res=>{
                          this.$toast('服务器异常')
                      });
          },()=>{});
      },
      remove(){
        this.$dialog.confirm('您是否确认撤销该发布内容?').then(()=>{
          this.$emit('remove',this.dataInfo);
        },data=>{
          return false;
        })
      },
      goContacts(){
        this.$router.push({path:'/interact/contacts',query:{rid:this.dataInfo.rid}})
      }
    }
  }
</script>