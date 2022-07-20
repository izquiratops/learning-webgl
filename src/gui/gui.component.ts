import { RangeInputComponent } from './range-input/range-input.component';

export class GuiComponent extends HTMLElement {
    private properties = new Map<string, RangeInputComponent>();

    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        fetch('./gui.component.html')
            .then((stream) => stream.text())
            .then((html) => {
                shadow.innerHTML = html;
                this.loadChildren();
            });
    }

    getValue(key: string): number | null {
        return this.properties.get(key)?.value;
    }

    private loadChildren() {
        const anchorRef = this.shadowRoot.getElementById('propertiesAnchor');

        this.properties.set('rotateCameraX', new RangeInputComponent('X'));
        this.properties.set('rotateCameraY', new RangeInputComponent('Y'));
        this.properties.set('rotateCameraZ', new RangeInputComponent('Z'));

        anchorRef.appendChild(this.properties.get('rotateCameraX'));
        anchorRef.appendChild(this.properties.get('rotateCameraY'));
        anchorRef.appendChild(this.properties.get('rotateCameraZ'));

        const event = new CustomEvent('gui-ready', {
            bubbles: true,
            composed: true,
        });

        this.shadowRoot.dispatchEvent(event);
    }
}
