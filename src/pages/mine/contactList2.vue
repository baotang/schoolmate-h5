<style lang="less" module>
    @import '../../assets/less/const.less';
    .list{
        background-color: #fff;
    }
</style>
<template>
    <div>
        <ul :class="$style.list">
            <contact @click="goContactDetail" v-for="contact in list" :dataInfo="contact"></contact>
        </ul>
        <Loading v-if="loading"></Loading>
        <div v-if="!loading && list.length == 0" class="empty-data-item">
            <span>数据为空</span>
        </div>
    </div>
</template>
<script>
  import contact from './contact.vue'
  import $api from 'api'
  export default {
    components:{
      contact
    },
    data(){
      return {
          loading: true,
          list:[]
      }
    },
    methods:{
      goContactDetail(contact){
        this.$router.push(`/mine/contacts/${contact.uid}`)
      }
    },
    created(){
      const {channel,rid} = this.$route.query;
//      if(channel == 'resource'){
//        $api.post('/Help/getCoList',{rid})
//          .then(res=>{
//              this.loading = false;
//              this.list = [...res.data];
//        },error=>{
//            this.$toast('服务器异常')
//        })
//      }else if(channel == 'friends'){
//
//      }


    }
  }
</script>