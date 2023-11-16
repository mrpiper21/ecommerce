const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
})

const cloudinaryUplodaImg = async(fileToUploads) => {
    return new Promise ((resolve) => {
        cloudinary.UploadStream.upload(fileToUploads, (result) => {
            resolve(
                {
                    url: result.secru_url,
                },
                {
                    resource_type: "auto",
                }
            )
        })
    })
}

module.exports = cloudinaryUplodaImg;