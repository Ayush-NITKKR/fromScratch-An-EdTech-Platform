const cloudinary = require("cloudinary").v2;
// deleting the video
exports.deleteVideo = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "video",
        });

        console.log(result);
    } catch (error) {
        console.error(error);
    }
};