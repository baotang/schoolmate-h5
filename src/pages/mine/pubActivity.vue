<style lang="less" module>
    .item{
        margin-bottom: 6px;
    }
</style>
<template>
    <div>
        <ul
                v-infinite-scroll="loadMore"
                infinite-scroll-immediate-check="false"
                infinite-scroll-disabled="noScroll"
                infinite-scroll-distance="80">
            <Item v-for="(item,index) in column.list" :class="$style.item" :key="index" :dataInfo="item" @click="goEdit(item)" @remove="remove"></Item>
        </ul>
        <Loading v-if="loading"></Loading>
        <div v-if="!loading && column.list.length == 0" class="empty-data-item">
            <span>数据为空</span>
        </div>
    </div>
</template>
<script>
  import { mapState } from 'vuex';
  import Item from '../public/column.vue';
  import $api from 'api';
  import publishBtn from '../../components/publish';
  export default {
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
      noScroll () {
        return this.loading || this.column.noMore;
      },
      ...mapState({
        column: state => state.activity.column
      })
    },
    methods:{
      loadMore() {
        this.loading = true;
        this.$store.dispatch('activity/LOAD_COLUMN_LIST',{uid:this.$parent.uid}).then(()=>{
          this.loading = false;
        },(err)=>{
          this.loading = false;
          this.$toast({message: err});
        });
      },
      goEdit(item) {
        this.$router.push(`/publish/activity?aid=${item.aid}`);
      },
      remove(item){
        $api.post('/activity/delActivity',{ aid:item.aid})
          .then(res=>{
          this.$toast(res.msg);
          if(res.result){
            this.$store.dispatch('activity/REMOVE_COLUMN',item);
          }
        },err=>{
          this.$toast('服务器异常');
        });
      }
    },
    created(){
      if(!this.column.list.length){
        this.loadMore();
      }
    }
  }
</script>
