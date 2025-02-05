import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from "@angular/core";


@Component({
	selector: 'bad-example',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template:`
		<input #first [value]="firstName" (input)="firstName = first.value">
		<input #last [value]="lastName" (input)="lastName = last.value">
		<div> Full Name: {{getFullName()}}</div>
		@if (nameSaved) {
			<div style="color: red;"> Name saved! </div>
		}
	`,
	styles: `
		input {
			margin-right: 15px;
		}
	`
})
export class SignalBadExample {
	firstName: string = 'Cole';
	lastName: string = 'Thacker';

	nameSaved: boolean = false;

	#_cdr = inject(ChangeDetectorRef);

	getFullName(): string {
		const fullName = `${this.firstName} ${this.lastName}`;
		console.log(fullName);
		setTimeout(() => {
			this.nameSaved = true;
			this.#_cdr.markForCheck();
		}, 1000);
		setTimeout(() => {
			this.nameSaved = false;
			this.#_cdr.markForCheck();
		}, 3000);
		return fullName;
	}
}