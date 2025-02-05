import { ChangeDetectionStrategy, Component, computed, effect, signal } from "@angular/core";


@Component({
	selector: 'good-example',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template:`
		<input #first [value]="firstName()" (input)="setFirstName(first.value)">
		<input #last [value]="lastName()" (input)="setLastName(last.value)">
		<div> Full Name: {{fullName()}}</div>

		@if (nameSaved()) {
			<div style="color: red;"> Name saved! </div>
		}
	`,
	styles: `
		input {
			margin-right: 15px;
		}
	`
})
export class SignalGoodExample {
	readonly firstName = signal<string>('Cole');
	readonly lastName = signal<string>('Thacker');

	readonly nameSaved = signal<boolean>(false);

	readonly fullName = computed<string>(() => `${this.firstName()} ${this.lastName()}`);

	constructor() {
		// Update the name DB
		effect(() => {
			console.log(this.fullName());

			// you don't typically want to update signals from inside of an effect, this is just to demonstrate a point
			setTimeout(() => this.nameSaved.set(true), 1000);
			setTimeout(() => this.nameSaved.set(false), 3000);
		})
	}

	setFirstName(firstName: string): void {
		this.firstName.set(firstName);
	}

	setLastName(lastName: string): void {
		this.lastName.set(lastName);
	}
}