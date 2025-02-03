import { ChangeDetectionStrategy, Component, ElementRef, linkedSignal, signal, viewChildren } from '@angular/core';
import { StarShip } from '../../services/star-wars.service';


@Component({
	selector: 'starship-select-list',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@let selected = selectedShips();
		@for (ship of starShips(); track $index) {
			<div #ship tabindex="0"
				[class.selected]="selected.has(ship)"
				[class.hovered]="hoveredShip() === ship"
				(mouseenter)="hoverShip(ship)"
				(mouseleave)="clearHover()"
				(click)="toggleShipSelection(ship)"
				(keydown)="onKeydown($event, $index, ship)"
				(pointerdown)="$event.preventDefault()"
				>
				Name: {{ship.name}}, ID: {{ship.id}}
			</div>
		}
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

	toggleShipSelection(ship: StarShip): void {
		this.selectedShips.update(prev => {
			if (prev.has(ship)) {
				prev.delete(ship);
			} else {
				prev.add(ship);
			}

			return new Set(prev);
		});
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
