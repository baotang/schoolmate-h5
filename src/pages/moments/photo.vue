<style lang="less" module>
    .item{
        margin-bottom: 6px;
    }
</style>
<template>
    <div>
        <ul
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="noScroll"
                infinite-scroll-immediate-check="false"
                infinite-scroll-distance="80">
            <Item v-for="(item,index) in photo.list" :class="$style.item" :key="index" :dataInfo="item" @click="goDetail(item)" @remove="remove"></Item>
        </ul>
        <Loading v-if="loading"></Loading>
        <div v-if="!loading && photo.noMore && photo.list.length == 0" class="empty-data-item">
            <span>数据为空</span>
        </div>
        <publishBtn v-if="showPublish" text="发照片" @click="onPublish"></publishBtn>

    </div>
</template>
<script>
  import { mapState } from 'vuex';
  import Item from '../public/photo.vue';
  import publishBtn from '../../components/publish';
  import $api from 'api';
  export default {
    props:{
      showPublish:Boolean
    },
    data(){
      return {
        loading: false
      }
    },
    components:{
      Item,
      publishBtn
    },
    computed:{
      noScroll(){
        return this.loading || this.photo.noMore;
      },
      ...mapState({
        photo: state => state.activity.photo
      })
    },
    methods:{
      onPublish() {
        this.$router.push(`/publish/photo`);
      },
      loadMore() {
        this.loading = true;
        this.$store.dispatch('activity/LOAD_PHOTO_LIST',{cid: this.$route.params.id}).then(()=>{
          this.loading = false;
        });
      },
      goDetail(item) {
          if(this.$parent.basicInfo.is_member){
              item.hit = parseInt(item.hit) + 1;
              this.$router.push(`/activity/photo-detail/${item.pid}`);
          }else{
              this.$dialog.confirm('请到【简介】中点击【申请加入】')
                      .then(()=>{this.$parent.switchItem('basic');},()=>{});
          }
      },
      remove(item){
        $api.post('/picture/delPicture',{ pid:item.pid})
          .then(res=>{
          this.$toast(res.msg);
          if(res.result){
            this.$store.dispatch('activity/REMOVE_PHOTO',item);
          }
        },err=>{
          this.$toast('服务器异常');
        });
      }
    },
    created(){
      if(!this.photo.list.length){
        this.loadMore();
      }
    }
  }
</script>
