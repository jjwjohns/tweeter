export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => string;
  deleteMessage: (toastId: string) => void;
}

export abstract class Presenter<V extends View = View> {
  private _view: V;

  protected constructor(view: V) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  protected async doFailureRecordingOperation(
    operation: () => Promise<void>,
    operation_description: string,
    cleanup?: () => void
  ) {
    try {
      await operation();
    } catch (error) {
      const raw = (error as Error)?.message ?? `${error}`;
      const userMessage = raw.replace(/^\s*[\w-]+:\s*/, "");

      console.error(`Failed to ${operation_description}:`, error);

      this.view.displayErrorMessage(
        userMessage || `Failed to ${operation_description}`
      );
    } finally {
      if (cleanup) {
        cleanup();
      }
    }
  }
}
