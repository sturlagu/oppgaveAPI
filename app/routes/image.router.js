var express = require('express');
var router = express.Router();
// Jimp - JavaScript Image Manipulation Program 
var Jimp = require('jimp');
// Filhåndtering
var fs = require('fs');
// For å behandle bilde forespørsler
var multer = require('multer');

// Setter opp lagringskonfigurasjon for multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
})

// Funksjon for å filtrere filer (Kun .png og .jpeg)
var fileFilter = (req, file, cb) =>{
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' ){
    cb(null, true);
  }else{
    cb(null, false);
  }
};

// Setter konfigurasjoner
var upload = multer({ storage: storage, fileFilter: fileFilter })

// Funksjon for å lage overlay
async function watermark(filename){
  // Leser inn bilde og logo
  const image = await Jimp.read(('./public/images/' + filename));
  const watermark = await Jimp.read('./public/images/logo.png')
  //Skalerer logo til å passe bilde
  watermark.resize(image.getWidth(), image.getHeight());
  // Eller hvis bilde skal skaleres etter logo
  //image.resize(watermark.getWidth(), watermark.getHeight());

  // Setter logo på bilde
  image.composite(watermark, 0, 0, {
    mode: Jimp.BLEND_SOURCE_OVER,
    opacityDest: 1,
    opacitySource: 0.8
  })
  // Nytt navn og filsti
  var newFileName = ('watermarked' + filename);
  var newFilePath = ('./public/images/'+newFileName);
  // Lagrer bilde med logo
  await image.writeAsync(newFilePath);
  // Sletter gammelt bilde
  fs.unlink(('./public/images/' + filename), (err) => {
    if(err){
      console.log("failed to delete local image: " + err);
    }else{
      console.log('successfully deleted local image');                                
    }
  })
  // Returnerer filnavn for referanse til URL
  return newFileName;
}

// POST image
router.post('/upload', upload.single('image'), (req, res, next) => {
  console.log(req.file)
  // Navnet på bildet som er lastet opp
  var filename = req.file.filename;
  watermark(filename)
    .then((newFileName) => {
      res.send("http://www.localhost:3000/images/"+newFileName);
    })
});

module.exports = router;
