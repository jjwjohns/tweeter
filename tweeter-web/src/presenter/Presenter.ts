export interface View {
    displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => string;
    deleteMessage: (toastId: string) => void;
}

export abstract class Presenter <V extends View = View> {
    private _view: V;

    protected constructor(view: V) {
        this._view = view;
    }

    protected get view() {
        return this._view;
    }

    
    protected async doFailureRecordingOperation (operation: () => Promise<void>, operation_description: string, cleanup?: () => void) {
        try {
            await operation();
        } catch (error) {
            this.view.displayErrorMessage(
            `Failed to ${operation_description} because of exception: ${error}`
            );
        } finally {
            if (cleanup) {
                cleanup();
            }
        }
    }
};