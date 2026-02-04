import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const cloudinaryFileUpload = async (localFilePath: string) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });

        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}

const cloudinaryFileDelete = async (public_id: string): Promise<any> => {
    try {
        if (!public_id) return null;

        const response = await cloudinary.uploader.destroy(public_id);
        return response;
    } catch (error) {
        return null;
    }
}

const cloudinaryUploadBuffer = async (fileBuffer: Buffer, mimetype: string, resourceType: "auto" | "image" | "video" | "raw" = "auto") => {
    try {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: resourceType },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            uploadStream.end(fileBuffer);
        });
    } catch (error) {
        console.error("Error in cloudinaryUploadBuffer:", error);
        return null;
    }
}

export { cloudinaryFileUpload, cloudinaryFileDelete, cloudinaryUploadBuffer }