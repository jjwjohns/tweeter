import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";
import { ImageDAO } from "../ImageDAO";

const BUCKET = "tweeter-profile-images-johns";
const REGION = "us-east-1";

export class S3ImageDAO implements ImageDAO {
  async uploadProfileImage(
    fileName: string,
    base64Image: string
  ): Promise<string> {
    console.log(
      "[S3ImageDAO] Received base64 length:",
      base64Image?.length || 0
    );
    let decodedImageBuffer: Buffer = Buffer.from(base64Image, "base64");
    console.log(
      "[S3ImageDAO] Decoded buffer length:",
      decodedImageBuffer.length
    );
    const s3Params = {
      Bucket: BUCKET,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client({ region: REGION });
    try {
      await client.send(c);
      return `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }
}
