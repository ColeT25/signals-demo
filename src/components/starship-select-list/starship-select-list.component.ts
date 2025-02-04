import { ChangeDetectionStrategy, Component, ElementRef, input, output, signal, viewChildren } from '@angular/core';
import { StarShip } from '../../services/star-wars.service';


@Component({
	selector: 'starship-select-list',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@let selected = selectedShips();
		@for (ship of starShips(); track $index) {
			<div #ship tabindex="-1"
				[class.selected]="selected.has(ship)"
				[class.hovered]="hoveredShip() === ship"
				(mouseenter)="hoverShip(ship)"
				(mouseleave)="clearHover()"
				(click)="toggleShipSelection(ship)"
				(contextmenu)="removeShip($event, ship)"
				(keydown)="onKeydown($event, $index, ship)"
				(pointerdown)="$event.preventDefault()"
				>
				{{ship.name}}
			</div>
		}
	`,
	styleUrl: './starship-select-list.component.scss'
})
export class StarshipSelectListComponent {
	readonly starShips = input.required<Set<StarShip>>();
	readonly selectedShips = input.required<Set<StarShip>>();
	readonly hoveredShip = signal<StarShip | null>(null);

	readonly toggleStarShipSelection = output<StarShip>();
	readonly removeStarShip = output<StarShip>();

	readonly shipDivs = viewChildren<ElementRef<HTMLElement>>('ship');

	removeShip(event: MouseEvent, ship: StarShip): void {
		event.preventDefault();
		event.stopPropagation();
		this.removeStarShip.emit(ship);
	}

	hoverShip(ship: StarShip): void {
		this.hoveredShip.set(ship);
	}

	clearHover(): void {
		this.hoveredShip.set(null);
	}

	toggleShipSelection(ship: StarShip): void {
		this.toggleStarShipSelection.emit(ship);
	}

	onKeydown(event: KeyboardEvent, currentShipIndex: number, currentShip: StarShip): void {
		if (event.key === 'Tab') {
			event.stopPropagation();
			event.preventDefault();
			const shipDivs = this.shipDivs();

			if (currentShipIndex !== shipDivs.length - 1) {
				shipDivs[currentShipIndex + 1].nativeElement.focus();
			} else {
				shipDivs[0].nativeElement.focus();
			}
		} else if (event.key === 'Enter' || event.key === ' ') {
			event.stopPropagation();
			event.preventDefault();
			this.toggleShipSelection(currentShip);
		}
	}

	focusFirstShip(): void {
		const shipDivs = this.shipDivs();
		if (shipDivs.length > 0) {
			this.shipDivs()[0].nativeElement.focus();
		}
	}

}
