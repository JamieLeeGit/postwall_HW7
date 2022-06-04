const multer = require('multer');
const path = require('path');
const appError = require("./appError");
const httpStatus = require("../service/httpStatus");
const imagMaxSize = 1;

const uploadImage = multer({
  limits: {
    fileSize: imagMaxSize*1024*1024,
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      cb(new Error("INVALID_FILE"));
    }
    cb(null, true);
  },
}).any();

const handleUploadImageError = (err, next) => {
  if (err) {
    console.log(err);

    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return appError(httpStatus.BAD_REQUEST, '圖片 size 不得超過' + imagMaxSize + 'M', next);
    } else if (err instanceof Error) {
      return appError(httpStatus.BAD_REQUEST, "檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式", next);
    }
    
    return appError(httpStatus.BAD_REQUEST, "圖片上傳錯誤", next);      
  }

  next();
};

const uploadImageService = (req, res, next) => {
  //處理錯誤訊息
  uploadImage(req, res, err => handleUploadImageError(err, next)); 
};

module.exports = uploadImageService; 