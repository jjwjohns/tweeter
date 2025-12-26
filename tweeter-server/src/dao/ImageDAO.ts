export interface ImageDAO {
  uploadProfileImage(fileName: string, base64Image: string): Promise<string>;
}
