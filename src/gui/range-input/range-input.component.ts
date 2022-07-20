export class RangeInputComponent extends HTMLElement {
    private _value: number = 0;

    constructor(private _label: string) {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        fetch('./range-input.component.html')
            .then((stream) => stream.text())
            .then((html) => {
                shadow.innerHTML = html;
                this.bindData();
            });
    }

    get value() {
        return this._value;
    }

    private bindData() {
        const valueInputRef = this.shadowRoot.getElementById(
            'valueInput',
        ) as HTMLInputElement;

        const valueDisplayRef = this.shadowRoot.getElementById(
            'valueDisplay',
        ) as HTMLDivElement;

        const valueLabelRef = this.shadowRoot.getElementById(
            'valueLabel',
        ) as HTMLLabelElement;

        valueLabelRef.innerText = this._label;

        {
            const initValueAsString = this.value.toString();

            valueInputRef.value = initValueAsString;
            valueDisplayRef.textContent = initValueAsString + 'º';
        }

        valueInputRef.addEventListener('input', (event) => {
            const eventValue = (event.target as HTMLInputElement).valueAsNumber;

            // Update DOM <div>
            valueDisplayRef.textContent = eventValue.toString() + 'º';

            // Update state for WebGL transformations
            this._value = (eventValue * Math.PI) / 180;
        });
    }
}
