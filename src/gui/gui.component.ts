export class GuiComponent extends HTMLElement {
	private _rotateCamera: number = 0;

	constructor() {
		super();

		const shadow = this.attachShadow({ mode: 'open' });
		fetch("./gui.component.html")
			.then(stream => stream.text())
			.then(html => {
				shadow.innerHTML = html;
				this.setupInputElement('rotateCamera');
			});
	}

	get rotateCamera(): number {
		return this._rotateCamera;
	}

	private setupInputElement(id: string): void {
		// <input> element
		const inputElement = this.shadowRoot.getElementById(id) as HTMLInputElement;
		// <div> "side label" element
		const displayElement = this.shadowRoot.getElementById(
			id + 'Display',
		) as HTMLInputElement;

		// Init with a default value
		{
			const initValueAsString = this.rotateCamera.toString();
			inputElement.value = initValueAsString;
			displayElement.textContent = initValueAsString + 'º';
		}

		inputElement.addEventListener('input', (event) => {
			const value = (event.target as HTMLInputElement).value;

			// Update DOM <div>
			displayElement.textContent = value + 'º';

			// Update state for WebGL transformations
			this._rotateCamera = (parseInt(value) * Math.PI) / 180;
		});
	}
}
