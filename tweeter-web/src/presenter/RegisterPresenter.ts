import { Buffer } from "buffer";
import { User, AuthToken } from "tweeter-shared";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {
  setImageUrl: (url: string) => void;
  setImageFileExtension: (fileExtension: string) => void;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  private imageBytes: Uint8Array = new Uint8Array();

  public async handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.imageBytes = bytes;
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = await this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.imageBytes = new Uint8Array();
    }
  };
  
  public async getFileExtension(file: File): Promise<string | undefined> {
      return file.name.split(".").pop();
    };
  
  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageExt: string,
    rememberMe: boolean
  ) {
    await this.performAuthOperation(
      async () =>
        await this.service.register(
          firstName,
          lastName,
          alias,
          password,
          this.imageBytes,
          imageExt
        ),
      rememberMe,
      (user) => `/feed/${user.alias}`,
      "register user"
    );
  };
}