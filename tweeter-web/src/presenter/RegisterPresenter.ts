import { Buffer } from "buffer";
import { User, AuthToken } from "tweeter-shared";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {
  setImageUrl: (url: string) => void;
  setImageFileExtension: (fileExtension: string) => void;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  private imageBytes: Uint8Array = new Uint8Array();

  public async handleImageFile(file: File | undefined) {
    if (!file) {
      this.view.setImageUrl("");
      this.imageBytes = new Uint8Array();
      return;
    }

    this.view.setImageUrl(URL.createObjectURL(file));

    const base64DataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const base64 = base64DataUrl.replace(/^data:.*;base64,/, "");

    this.imageBytes = Buffer.from(base64, "base64");
    console.log(
      "[RegisterPresenter] Image bytes length:",
      this.imageBytes.length
    );

    const ext = await this.getFileExtension(file);
    if (ext) this.view.setImageFileExtension(ext);
  }

  public async getFileExtension(file: File): Promise<string | undefined> {
    return file.name.split(".").pop();
  }

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
  }
}
