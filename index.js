const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());

app.post("/upload", uploadFile, (req, res) => {
  if (!req.file) {
    return res.status(400).send("上传失败");
  }
  // 获取上传的文件扩展名
  const extname = path.extname(req.file.originalname);

  // 为上传的文件添加扩展名
  fs.renameSync(req.file.path, `${req.file.path}${extname}`);
  //返回路径
  res.status(200).send({
    url: "http://localhost:33450/" + req.file.path + extname,
    message: "上传成功",
  });
});

function uploadFile(req, res, next) {
  //dest 值为文件存储的路径;single方法,表示上传单个文件,参数为表单数据对应的key
  let upload = multer({ dest: "uploads" }).single("avatar");
  upload(req, res, (err) => {
    //打印结果看下面的截图
    if (err) {
      res.send("err:" + err);
    } else {
      //将文件信息赋值到req.body中，继续执行下一步
      req.body.photo = req.file.filename;
      next();
    }
  });
}

// 设置静态文件目录，用于存放图片
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(33450, () => {
  console.log("服务器运行在端口 33450.");
});
