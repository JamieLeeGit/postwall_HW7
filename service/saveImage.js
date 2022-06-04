const appError = require("./appError");
const httpStatus = require("../service/httpStatus");
const { ImgurClient } = require('imgur');


const saveImage = async (req, res, next)=> {
  console.log('saveImage');

  console.log(req.files[0]);
 
  if(!req.files[0].buffer.length) {
    return next(appError(httpStatus.BAD_REQUEST,"尚未上傳檔案",next));
  }

  const client = new ImgurClient({
    clientId: process.env.IMGUR_CLIENTID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
    refreshToken: process.env.IMGUR_REFRESH_TOKEN,
  });
  
  const response = await client.upload({
    image: req.files[0].buffer.toString('base64'),
    type: 'base64',
    album: process.env.IMGUR_ALBUM_ID
  });

  if(response.data && response.data.link){
    return {
      isSave: true,
      imgUrl: response.data.link
    };
  }else{
    return next(appError(httpStatus.BAD_REQUEST,"檔案上傳異常",next));
  } 
};

module.exports = saveImage; 