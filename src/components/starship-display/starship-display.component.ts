import { ChangeDetectionStrategy, Component, ElementRef, input, model, output, signal, viewChild } from '@angular/core';
import { StarShip } from '../../services/star-wars.service';

@Component({
	selector: 'starship-display',
	imports: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template:`
		@let currentStarShip = starShip();

		@if (allowEdit()) {
			<div>
				Name:
				<input #nameInput [value]="currentStarShip.name" (input)="updateStarShipName(nameInput.value)"/>
			</div>
		} @else {
			<div (mouseenter)="showTooltip($event, 'Starship name')" (mouseleave)="hideTooltip()">
				Name: {{currentStarShip.name}}
			</div>
		}

		<div (mouseenter)="showTooltip($event, 'Starship model')" (mouseleave)="hideTooltip()">
			Model: {{currentStarShip.model}}
		</div>

		<div (mouseenter)="showTooltip($event, 'Starship maker')" (mouseleave)="hideTooltip()">
			Manufacturer: {{currentStarShip.manufacturer}}
		</div>

		<div (mouseenter)="showTooltip($event, 'Hyperdrive rating')" (mouseleave)="hideTooltip()">
			Hyperdrive Rating: {{currentStarShip.hyperdrive_rating}}
		</div>

		<div (mouseenter)="showTooltip($event, 'Crew size')" (mouseleave)="hideTooltip()">
			Crew Size: {{currentStarShip.crew}}
		</div>

		<div (mouseenter)="showTooltip($event, 'Starship length')" (mouseleave)="hideTooltip()">
			Length: {{currentStarShip.length}}
		</div>

		<div (mouseenter)="showTooltip($event, 'Cost in credits')" (mouseleave)="hideTooltip()">
			Cost: {{currentStarShip.cost_in_credits}}
		</div>

		<button (click)="likeStarShip.emit()">Like StarShip</button>
		<button (click)="buyStarShip.emit(currentStarShip.cost_in_credits)">Buy StarShip</button>


		<span class="tooltip" #tooltip [style.display]="displayTooltip() ? 'block' : 'none'"></span>
	`,
	styleUrl: './starship-display.component.scss'
})
export class StarshipDisplayComponent {
	readonly starShip = model.required<StarShip>();
	readonly allowEdit = input<boolean>(false);

	readonly buyStarShip = output<number>();
	readonly likeStarShip = output<void>();

	readonly displayTooltip = signal<boolean>(false);

	readonly tooltip = viewChild.required<ElementRef<HTMLElement>>('tooltip');

	showTooltip(event: MouseEvent, tooltipText: string) {
		this.displayTooltip.set(true);
		const tooltipDiv = this.tooltip().nativeElement;

		tooltipDiv.textContent = tooltipText;
		tooltipDiv.style.left = event.clientX +'px';
		tooltipDiv.style.top = event.clientY + 'px';
	}

	hideTooltip(): void {
		this.displayTooltip.set(false);
	}

	updateStarShipName(newName: string) {
		this.starShip.update((current) => ({...current, name: newName}));
	}
}
