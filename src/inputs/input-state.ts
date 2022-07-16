export class InputState {
    private _rotateCamera: number = 0;

    constructor() {
        this.setupInputElement('rotate-camera');
    }

    get rotateCamera(): number {
        return this._rotateCamera;
    }

    private setupInputElement(id: string): void {
        // <input> element
        const inputElement = document.getElementById(id) as HTMLInputElement;
        // <div> "side label" element
        const valueElement = document.getElementById(
            id + '-value',
        ) as HTMLInputElement;

        // Init with a default value
        const initValueAsString = this.rotateCamera.toString();
        inputElement.value = initValueAsString;
        valueElement.textContent = initValueAsString + 'º';

        inputElement.addEventListener('input', (event) => {
            const value = (event.target as HTMLInputElement).value;

            // Update DOM <div>
            valueElement.textContent = value + 'º';

            // Update state for WebGL transformations
            this._rotateCamera = (parseInt(value) * Math.PI) / 180;
        });
    }
}
