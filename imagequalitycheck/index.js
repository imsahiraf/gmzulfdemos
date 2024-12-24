const sharp = require('sharp');
const axios = require('axios');
const assessImageReadability = (isGrayscale) => {
  if (isGrayscale) {
    return "Readable";
  } else {
    return "Not Readable";
  }
};
  

const imagePath = 'https://absacib-dev.s3.amazonaws.com/application/4199/id_proof_1695304684713.png'; // Path to the image

// const imagePath = 'https://blog.zarsco.com/wp-content/uploads/2023/08/What-is-M.Tech-in-Artificial-Intelligence_AI.jpg.optimal.jpg'; // Replace with the actual path to your image

// gm(imagePath)
//   .command("identify")
//   .format("%Q")
//   .exec(function(err, quality) {
//     if (err) {
//       console.error('Error:', err);
//     } else {
//       const qualityPercentage = parseFloat(quality);
//       console.log(`Image Quality: ${qualityPercentage.toFixed(2)}%`);
//     }
//   });

  const Jimp = require('jimp');

// const imagePath = 'path_to_your_image.jpg'; // Replace with the actual path to your image

axios({
  method: 'get',
  url: imagePath,
  responseType: 'arraybuffer'
}).then(response => {
  const buffer = Buffer.from(response.data, 'binary');

  sharp(buffer)
    .metadata()
    .then(info => {
      console.log(info)
      const isGrayscale = info.channels === 1;

      console.log(`Image Readability: ${assessImageReadability(isGrayscale)}`);
    })
    .catch(error => {
      console.error('Error processing image:', error);
    });
}).catch(error => {
  console.error('Error fetching image:', error);
});
