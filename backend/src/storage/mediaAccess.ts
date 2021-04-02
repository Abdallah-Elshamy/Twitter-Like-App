import * as AWS from "aws-sdk";

export async function getUploadUrl(id: string): Promise<string> {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({
        profile: process.env.S3_USER,
    });

    const s3: AWS.S3 = new AWS.S3({
        signatureVersion: "v4",
        region: process.env.S3_REGION,
    });

    const bucketName: string = process.env.UPLOADS_S3_BUCKET!;
    const urlExpiration: number = parseInt(process.env.SIGNED_URL_EXPIRATION!);

    return s3.getSignedUrl("putObject", {
        Bucket: bucketName,
        Key: id,
        Expires: urlExpiration,
    });
}

export async function deleteMedia(id: string): Promise<boolean> {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({
        profile: process.env.S3_USER,
    });

    const s3: AWS.S3 = new AWS.S3({
        signatureVersion: "v4",
        region: process.env.S3_REGION,
    });

    const bucketName: string = process.env.UPLOADS_S3_BUCKET!;

    try {
        await s3.deleteObject({
            Bucket: bucketName,
            Key: id,
        }).promise();
        return true;
    } catch {
        return false;
    }
}
