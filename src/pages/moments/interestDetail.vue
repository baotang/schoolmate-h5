<style lang="less" module>
    @import '../../assets/less/const.less';
    .header{
        height: 140px;
        padding-top: 24px;
        color: #fff;
        background-image: linear-gradient(-180deg, #56AEEA 0%, #81D2F8 98%);
    }
    .pic{
        width: 60px;
        height: 60px;
        margin: 0 auto 15px;
    }
    .nav{
        display: flex;
        height: 30px;
        line-height: 30px;
        background-color: #fff;
        .navItem{
            flex: 1;
        }
        .active{
            color: @theme-color;
        }
    }
    .detail{
        margin-top: 6px;
    }
</style>
<template>
    <div class="content">
        <Loading v-if="loading"></Loading>
        <div v-else>
            <div class="top">
                <div :class="$style.header">
                    <div :class="$style.pic">
                        <imgContain :imgUrl="basicInfo.c_cover_file" :onlyImage="true" style="width:60px ;height:60px"></imgContain>
                    </div>
                    <div class="size-topic text-center">{{ basicInfo.c_name }}</div>
                </div>
                <div :class="[$style.nav,'size-topic','text-center']">
                    <span :class="[$style.navItem,{[$style.active]:item=='basic'}]" @click="switchItem('basic')">简介</span>
                    <span :class="[$style.navItem,{[$style.active]:item=='activity'}]" @click="switchItem('activity')">活动</span>
                    <span :class="[$style.navItem,{[$style.active]:item=='photo'}]" @click="switchItem('photo')">照片</span>
                    <span :class="[$style.navItem,{[$style.active]:item=='interact'}]" @click="switchItem('interact')">需求</span>
                </div>
            </div>
            <div :class="$style.detail" v-if="!loading">
                <Basic :dataInfo="basicInfo" v-if="item=='basic'"></Basic>
                <Activity  v-if="item=='activity'" :showPublish="basicInfo.is_member"></Activity>
                <Photo  v-if="item=='photo'" :showPublish="basicInfo.is_member"></Photo>
                <Interact v-if="item=='interact'" :showPublish="basicInfo.is_member"></Interact>
            </div>
        </div>
    </div>
</template>
<script>
  import $api from 'api';
  import { mapGetters } from 'vuex'
  import Basic from './basic.vue'
  import Activity from './activity.vue'
  import Photo from './photo.vue'
  import Interact from './interact.vue'
  import {register,wechatShare} from '../../util/wechat-api'
  export default {
    components:{
      Basic,
      Activity,
      Photo,
      Interact
    },
    data(){
      return {
        item: '',
        loading: true,
        basicInfo:{},
        isCreater:false
      }
    },
    beforeRouteLeave (to, from, next){
        if(this.swiperInstance){
            this.swiperInstance.close();
            this.swiperInstance = null;
        }
      this.$store.dispatch('activity/RESET_PHOTO_LIST');
      this.$store.dispatch('interact/RESET_INTERACT_LIST');
      this.$store.dispatch('activity/RESET_COLUMN_LIST');
      next();
    },
    methods:{
      getData(){
        $api.get('/Circle/getCircle',{cid: this.$route.params.id})
          .then(data=>{
                this.basicInfo = {...data};
                this.loading = false;
                this.wechatInit();
            },()=>{
                this.loading = false;
            });
      },
        wechatInit(){
            register().then(()=>{
                let info = this.basicInfo;
                wechatShare({
                    title:info.c_name,
                    link: window.location.href,
                    imgUrl: info.c_cover_file ? info.c_cover_file : '',
                    desc: info.c_description
                });
            })
        },
      switchItem(item){
        var id = this.$route.params.id;
        this.$router.replace({path:`/moments/interest/${id}`,query:{item}})
      }
    },
    created(){
      this.$store.dispatch('activity/RESET_COLUMN_LIST');
      this.$store.dispatch('activity/RESET_PHOTO_LIST');
      this.$store.dispatch('interact/RESET_INTERACT_LIST');
      var id = this.$route.params.id;
      var item = this.$route.query.item;
      this.item = item;
      this.getData();
    },
    watch:{
      $route(to,from){
        this.item = this.$route.query.item;
        this.getData(this.item);
      }
    }
  }
</script>