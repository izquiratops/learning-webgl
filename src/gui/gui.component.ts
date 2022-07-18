class InputElement {
    private _value: number = 0;

    constructor(private _id: string) {}

    get id() {
        return this._id;
    }

    get value() {
        return this._value;
    }

    bind(inputElement: HTMLInputElement, displayElement: HTMLInputElement) {
        // Init with a default value
        {
            const initValueAsString = this.value.toString();
            inputElement.value = initValueAsString;
            displayElement.textContent = initValueAsString + 'º';
        }

        inputElement.addEventListener('input', (event) => {
            const eventValue = (event.target as HTMLInputElement).valueAsNumber;

            // Update DOM <div>
            displayElement.textContent = eventValue.toString() + 'º';

            // Update state for WebGL transformations
            this._value = (eventValue * Math.PI) / 180;
        });
    }
}

export class GuiComponent extends HTMLElement {
    private _rotateCameraX = new InputElement('rotateCameraX');
    private _rotateCameraY = new InputElement('rotateCameraY');
    private _rotateCameraZ = new InputElement('rotateCameraZ');

    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        fetch('./gui.component.html')
            .then((stream) => stream.text())
            .then((html) => {
                shadow.innerHTML = html;

                this.setupInputElement(this._rotateCameraX);
                this.setupInputElement(this._rotateCameraY);
                this.setupInputElement(this._rotateCameraZ);
            });
    }

    get rotateCameraX() {
        console.log(this._rotateCameraX.value);
        return this._rotateCameraX.value;
    }

    get rotateCameraY() {
        console.log(this._rotateCameraX.value);
        return this._rotateCameraY.value;
    }

    get rotateCameraZ() {
        console.log(this._rotateCameraX.value);
        return this._rotateCameraZ.value;
    }

    // TODO: Rename arg 'foo'
    private setupInputElement(foo: InputElement) {
        // <input> element
        const inputElement = this.shadowRoot.getElementById(
            foo.id,
        ) as HTMLInputElement;

        // <div> number display
        const displayElement = this.shadowRoot.getElementById(
            foo.id + 'Display',
        ) as HTMLInputElement;

        foo.bind(inputElement, displayElement);
    }
}
