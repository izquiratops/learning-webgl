class GuiProperty {
    private _value: number = 0;

    constructor(private _id: string) {}

    get id() {
        return this._id;
    }

    get value() {
        return this._value;
    }

    bindDomElements(shadow: ShadowRoot) {
        const inputElement = shadow.getElementById(
            this.id,
        ) as HTMLInputElement;

        const displayElement = shadow.getElementById(
            this.id + 'Display',
        ) as HTMLInputElement;

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
    private _rotateCameraX = new GuiProperty('rotateCameraX');
    private _rotateCameraY = new GuiProperty('rotateCameraY');
    private _rotateCameraZ = new GuiProperty('rotateCameraZ');

    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        fetch('./gui.component.html')
            .then((stream) => stream.text())
            .then((html) => {
                shadow.innerHTML = html;

                this._rotateCameraX.bindDomElements(shadow);
                this._rotateCameraY.bindDomElements(shadow);
                this._rotateCameraZ.bindDomElements(shadow);
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
}
