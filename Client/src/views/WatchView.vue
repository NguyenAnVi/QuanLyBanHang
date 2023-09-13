<script>
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { reactive, ref } from "vue";
import VideoPlayer from "../components/VideoPlayer.vue";
import VideoCardHorizontal from '../components/VideoCardHorizontal.vue';

export default {
  components : {
    VideoPlayer,
    VideoCardHorizontal
  },
  data(){
    return {
      videoProps: this.video,
      listener:  function(e){
      const video = document.getElementsByTagName('video')[0];

      if(e.key==' ' || e.code=="Space" || e.keyCode==32){
        e.preventDefault();
        if(video.paused)
          video.play();
        else
          video.pause();
      }
    }
    }
  },
  async setup(){
    const toast = useToast();
    const route = useRoute();
    const store = useStore();

    var video = reactive({
      id:"",
      props:{},
      viewing:{}
    });
    var recommendedVideos = reactive({});

    video.id = route.query.v;
      // get Current Video
      await store.dispatch("video/getVideoProperties", {
        id:video.id
      })
      .then(
        async (response)=>{
          video.props = response.data.video;
          await store.dispatch('account/getAccountInfo', {
            id:response.data.video.owner
          })
          .then(
            response=>{
              video.props.ownerInfo = response.data.user;
            }
          )
          .catch(
            error=>{
              video.props.ownerInfo ={
                fullName:"Unknown User"
              };
            }
          );
          video.viewing = response.data.videoviewing;
        }
      )
      .catch(
        error=>{
          toast(error.message, {type:"error"});
          video.props = {};
          video.viewing = {};
        }
      );

      // get Recommended Videos
      await store.dispatch("video/getRecommendedVideos", {
        currentVideo:video.props
      })
      .then(
        response=>{
          recommendedVideos = JSON.parse(JSON.stringify(response.data)) ;
        }
      )
      .catch(
        error=>{
          toast(error.message, {type:"error"});
          recommendedVideos = {};
        }
      );
    return { video, recommendedVideos, store };
  },
  methods:{
    calcDate: (d)=>{
      const now = Date.now();
      const videoDate = new Date(d);
      var diff = Math.abs(now - videoDate);
      var years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
      var months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
      var days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      if(years) return `${years} ${(years===1)?('year'):('years')} ago`;
      if(months) return `${months} ${(months===1)?('month'):('months')} ago`;
      if(days) return `${days} ${(days===1)?('day'):('days')} ago`;
      if(hours) return `${hours} ${(hours===1)?('hour'):('hours')} ago`;
    },
    goToVideo(event) {
      const id = event.target.getAttribute('data-video-id');
      location.assign(`/watch${(id)?('?v='+id):''}`);
    },
  },
  mounted(){
    const video = document.getElementsByTagName('video')[0];
    const videoDuration = this.video.props.duration;
    var watchDuration = 0;
    var lastEvent = Date.now();
    video.addEventListener('play', function(){
      lastEvent = Date.now();
    });
    if(video) {
      let counting = true;
      var videoviewing = JSON.stringify(this.videoProps.viewing);
      const store = this.store;
      video.setAttribute('viewingId', videoviewing);
      video.addEventListener('timeupdate', function(e){
        const viewingId = JSON.parse(e.target.getAttribute("viewingId"))._id;
        const now = Date.now();
        watchDuration += new Date(now - lastEvent).getTime() /1000 ;
        lastEvent = now;
        if (((watchDuration > 30)||(watchDuration >= videoDuration)) && counting){ // check whether the watchDuration counted to 30s
          // Watch duration is valid for count view
          counting = false;

          store.dispatch('video/countView', {id:viewingId});
        }
      });
    }

    document.addEventListener('keydown',this.listener);
  },
  beforeUnmount(){
    console.log(this.listener);
    document.removeEventListener('keydown',this.listener)
  }
}
</script>
<template>
  <div class="wrapper">
    <div class="content-wrapper">
      <div class="video-column">
        <div class="video-wrapper">
            <!-- <VideoPlayer ref="videoplayer" :key="this.allowRender" v-if="allowRender" videoId="videoId" :src.sync="this.getVideoSource" :title.sync="this.getVideoTitle" :cover.sync="this.getVideoCover"/> -->
            <VideoPlayer :properties="this.video.props"/>
        </div>

        <!-- descriptions here -->
        <div class="video-descriptions">
          <h2>{{ this.video.props.title }}</h2>
          <div class="author-wrapper">
            <div class="author-avatar-wrapper">
              <img class="author-avatar" :src="this.video.props.ownerInfo.avatar">
            </div>
            <div class="author-name">
              {{this.video.props.ownerInfo.fullName}}
            </div>
          </div>
          <div class="description-wrapper">
            <div class="video-stats">
              <div>{{ this.video.props.views }} views</div> 
              <div>{{ this.calcDate(this.video.props.uploaded_at) }}</div>
              <div>
                <span class="hashtags" v-for="i in 4" :key="i">{{ (Math.random() + 1).toString(36).substring(7) }}</span>
              </div>
            </div>
            <div class="description-content" v-html="this.video.props.description"></div>
          </div>
        </div>
        <!-- comments here -->
      </div>
      <div class="recommend-column">
        <VideoCardHorizontal
          v-for="video in recommendedVideos.default"
          :data-video-id="video._id"
          :videoId="video._id" 
          authorAvtSrc="http://localhost:3001/account.png" 
          :videoThumbnailSrc="video.thumbnail"
          :title="video.title"
          :views="video.views"
          :uploaded="calcDate(video.uploaded_at)"
          @click.prevent="goToVideo($event)"
        />
      </div>
    </div>
    <div class="sidebar-parallel"></div>
  </div>
</template>


<style scoped>
.wrapper{
  display: flex;
  margin: 0 !important;
  /* width: calc(100% - var(--sidebar-icon-width)); */
  overflow: hidden;
}
.content-wrapper{
  width: 60rem;
  max-width: 100%;

  display: flex;
  gap: 16px;
  padding: 16px;
  height: 100%;

  @media (max-width:1080px){
    flex-direction: column;
  }
}
.sidebar-parallel{
  width: var(--sidebar-icon-width);
  margin-left: 8px;
  @media (max-width: 1080px) {
    display: none;
  }
}
.video-column{
  padding-top: 16px;
  display: flex;
  width: 100%;
  flex-direction: column;
  & .video-wrapper{
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 6px 10px var(--color-text-4);
  }
  & .video-descriptions, & .video-descriptions *{
    color: #fff;
    text-shadow: 0 2px 5px var(--color-background-5);

    & .author-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      & .author-avatar{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        padding: 4px;
        box-sizing: content-box;
      }
      & .author-name{
        font-weight: bold;
      }
    }
    & .description-wrapper {
      border-radius: 8px;
      background-color: #ffffff55;
      padding:12px;
      font-size: small;
      & .video-stats{
        margin-bottom:8px;
        display: flex;
        gap: 8px;
      }
    }
  }
}
.recommend-column{
  max-width: 300px;
  display: flex;
  padding: 16px;
  flex-direction: column;
  flex-basis: 480px;
  gap: 8px;
}
.hashtags{
  color: lightgray !important;
  cursor: pointer;
  &:before{ content:"#"; }
  &:after{ content: " "; }
  &:last-child:after{ content: ""; }
}
</style>