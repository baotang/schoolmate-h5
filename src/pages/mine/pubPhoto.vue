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
            <Item v-for="(item,index) in photo.list" :class="$style.item" :key="index" :dataInfo="item" @click="goEdit(item)" @remove="remove"></Item>
        </ul>
        <Loading v-if="loading"></Loading>
        <div v-if="!loading && photo.list.length == 0" class="empty-data-item">
            <span>数据为空</span>
        </div>
    </div>
</template>
<script>
  import { mapState } from 'vuex';
  import Item from '../public/photo.vue';
  import $api from 'api';
  import publishBtn from '../../components/publish';
  export default {
    components:{
      Item,
      publishBtn
    },
    data(){
      return {
        loading: false
      }
    },
    beforeRouteLeave (to, from, next){
      if(to.name != 'photo-detail'){
        this.$store.dispatch('activity/RESET_PHOTO_LIST');
      }
      next();
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
      loadMore() {
        this.loading = true;
        this.$store.dispatch('activity/LOAD_PHOTO_LIST',{uid:this.$parent.uid}).then(()=>{
          this.loading = false;
        });
      },
      goEdit(item) {
        this.$router.push(`/publish/photo?pid=${item.pid}`);
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
