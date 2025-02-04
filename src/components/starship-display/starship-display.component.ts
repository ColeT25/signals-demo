import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, input, model, output, signal, viewChild } from '@angular/core';
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
			<div (mouseenter)="setTooltip($event, 'Starship name')" (mouseleave)="hideTooltip()">
				Name: {{currentStarShip.name}}
			</div>
		}

		<div (mouseenter)="setTooltip($event, 'Starship model')" (mouseleave)="hideTooltip()">
			Model: {{currentStarShip.model}}
		</div>

		<div (mouseenter)="setTooltip($event, 'Starship maker')" (mouseleave)="hideTooltip()">
			Manufacturer: {{currentStarShip.manufacturer}}
		</div>

		<div (mouseenter)="setTooltip($event, 'Hyperdrive rating')" (mouseleave)="hideTooltip()">
			Hyperdrive Rating: {{currentStarShip.hyperdrive_rating}}
		</div>

		<div (mouseenter)="setTooltip($event, 'Crew size')" (mouseleave)="hideTooltip()">
			Crew Size: {{currentStarShip.crew}}
		</div>

		<div (mouseenter)="setTooltip($event, 'Starship length')" (mouseleave)="hideTooltip()">
			Length: {{currentStarShip.length}}
		</div>

		<div (mouseenter)="setTooltip($event, 'Cost in credits')" (mouseleave)="hideTooltip()">
			Cost: {{currentStarShip.cost_in_credits}}
		</div>

		<button (click)="likeStarShip.emit()">Like StarShip</button>


		<span class="tooltip" #tooltip [style.display]="displayTooltip() ? 'block' : 'none'"></span>
	`,
	styleUrl: './starship-display.component.scss'
})
export class StarshipDisplayComponent {
	readonly starShip = model.required<StarShip>();
	readonly allowEdit = input<boolean>(false);

	readonly likeStarShip = output<void>();

	readonly tooltipInfo = signal<{text: string, left: string, top: string} | null>(null);
	readonly displayTooltip = computed<boolean>(() => this.tooltipInfo() !== null);

	readonly tooltip = viewChild.required<ElementRef<HTMLElement>>('tooltip');

	constructor() {
		effect(() => {
			const tooltipInfo = this.tooltipInfo();
			if (tooltipInfo !== null) {
				const tooltipDiv = this.tooltip().nativeElement;

				tooltipDiv.textContent = tooltipInfo.text;
				tooltipDiv.style.left = tooltipInfo.left;
				tooltipDiv.style.top = tooltipInfo.top;
			}
		});
	}

	setTooltip(event: MouseEvent, text: string) {
		this.tooltipInfo.set({
			text: text,
			left: event.clientX + 'px',
			top: event.clientY + 'px'
		});
	}

	hideTooltip(): void {
		this.tooltipInfo.set(null);
	}

	updateStarShipName(newName: string) {
		this.starShip.update((current) => ({...current, name: newName}));
	}
}
