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
            <Item v-for="(item,index) in interact.list" :class="$style.item" :key="index" :dataInfo="item" @click.native="goEdit(item)" @remove="remove"></Item>
        </ul>
        <Loading v-if="loading"></Loading>
        <div v-if="!loading && interact.list.length == 0" class="empty-data-item">
            <span>数据为空</span>
        </div>
    </div>
</template>
<script>
  import { mapState } from 'vuex';
  import Item from '../public/interact.vue';
  import $api from 'api';
  import publishBtn from '../../components/publish';
  export default {
    props:{
      uid: String,
      require: true
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
      noScroll () {
        return this.loading || this.interact.noMore;
      },
      ...mapState({
        interact: state => state.interact.interact
      })
    },
    methods:{
      loadMore() {
        this.loading = true;
        this.$store.dispatch('interact/LOAD_INTERACT_LIST',{uid:this.$parent.uid}).then(()=>{
        this.loading = false;
        },(err)=>{
          this.loading = false;
          this.$toast({message: err});
        });
      },
        goEdit(item){
            this.$router.push(`/publish/interact?rid=${item.rid}`);
        },
      remove(item){
        $api.post('/Help/revoke',{ rid:item.rid})
          .then(res=>{
              this.$toast(res.msg);
              if(res.result){
                this.$store.dispatch('interact/REMOVE_INTERACT',item);
              }
          },err=>{
              this.$toast('服务器异常');
          });
      }
    },
    created(){
      if(!this.interact.list.length){
        this.loadMore();
      }
    }
  }
</script>
