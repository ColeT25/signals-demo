import { Component, ElementRef, linkedSignal, signal, viewChildren } from '@angular/core';
import { StarShip } from '../../services/star-wars.service';


@Component({
	selector: 'starship-select-list',
	imports: [],
	template: `
		<div (keydown)="onKeydown($event)">
			@let selected = selectedShips();
			@for (ship of starShips(); track $index) {
				<div #ship tabindex="-1" [class.selected]="selected.has(ship)" [class.hovered]="hoveredShip() === ship"
					(mouseenter)="hoverShip(ship)" (mouseleave)="clearHover()" (click)="selectShip(ship)"
					>
					Name: {{ship.name}}, ID: {{ship.id}}
				</div>
			}
		</div>
	`,
	styleUrl: './starship-select-list.component.scss'
})
export class StarshipSelectListComponent {
	readonly starShips = signal<Set<StarShip>>(new Set());
	readonly hoveredShip = signal<StarShip | null>(null);
	readonly selectedShips = linkedSignal<Set<StarShip>, Set<StarShip>>({
		source: this.starShips,
		computation: (newShips, previousSelected) => {
			const selections = new Set<StarShip>();
			const prevSelections = previousSelected?.value;

			if (prevSelections) {
				for (const prevSelection of prevSelections) {
					if (newShips.has(prevSelection)) {
						selections.add(prevSelection);
					}
				}
			}

			return selections;
		}
	});

	readonly shipDivs = viewChildren<ElementRef<HTMLElement>>('ship');

	addShipToList(newShip: StarShip): void {
		this.starShips.update((prev) => (new Set([...prev, newShip])));
	}

	removeSelectedShips(): void {
		const selectedShips = this.selectedShips();
		this.starShips.update(prev => {
			const newShips = new Set<StarShip>();
			for (const ship of prev) {
				if (!selectedShips.has(ship)) {
					newShips.add(ship);
				}
			}
			return newShips;
		});
	}

	hoverShip(ship: StarShip): void {
		this.hoveredShip.set(ship);
	}

	clearHover(): void {
		this.hoveredShip.set(null);
	}

	selectShip(ship: StarShip): void {
		this.selectedShips.update(prev => new Set([...prev, ship]));
	}

	onKeydown(event: KeyboardEvent): void {
		if (event.key === 'Tab') {
			let currentlyFocusedDivIndex: number | null = null;
			let shipDivs = this.shipDivs();
			for (let i = 0; i < shipDivs.length; i++) {
				if (shipDivs[i].nativeElement === document.activeElement) {
					currentlyFocusedDivIndex = i;
					break;
				}
			}

			if (currentlyFocusedDivIndex !== null && currentlyFocusedDivIndex !== shipDivs.length - 1) {
				shipDivs[currentlyFocusedDivIndex + 1].nativeElement.focus();
			} else {
				shipDivs[0].nativeElement.focus();
			}
		}
	}

}
