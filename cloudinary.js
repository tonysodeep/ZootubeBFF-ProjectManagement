const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'tonysodeep',
  api_key: '887976783892321',
  api_secret: 'yL2d2QXta1A_5D8d1kDpFvF0wtM',
});

exports.uploads = (file, folder) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        resolve({
          url: result.url,
          id: result.public_id,
        });
      },
      {
        resource_type: 'auto',
        folder: folder,
      }
    );
  });
};
