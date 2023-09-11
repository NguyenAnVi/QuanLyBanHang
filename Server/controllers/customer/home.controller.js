import VideoModel from "../models/video.model";

export const getVideos = function (req, res) {
  VideoModel.find()
    .then(videoResults=>{
      if(videoResults){
        return res.status(200).json({
          videos:videoResults
        });
      } else {
        return res.status(404).json({
          message:"No video"
        })
      }
    })
}
