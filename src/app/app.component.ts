import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { exampleStarshipNameIdMap, INVALID_ID, StarShip, StarWarsService } from '../services/star-wars.service';
import { StarshipDisplayComponent } from '../components/starship-display/starship-display.component';
import { StarshipSelectListComponent } from "../components/starship-select-list/starship-select-list.component";

const DEMO_STARSHIP: StarShip = {
	cost_in_credits: 10000,
	crew: 10,
	hyperdrive_rating: 5,
	length: 50,
	manufacturer: 'Angular',
	model: 'Angular signals',
	name: 'demo',
	id: INVALID_ID
}

@Component({
    selector: 'app-root',
	changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [StarshipDisplayComponent, StarshipSelectListComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
	readonly #_starWarsService = inject(StarWarsService);

	readonly isLoadingStarShip = this.#_starWarsService.isLoading;
	readonly allowNameEdits = signal<boolean>(false);
	readonly showMeme = signal<boolean>(true);
	readonly allShipsMap = exampleStarshipNameIdMap;

	readonly likedShips = signal<Set<StarShip>>(new Set());
	readonly selectedLikedShips = linkedSignal<Set<StarShip>, Set<StarShip>>({
		source: this.likedShips,
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

	readonly starshipIsSelectedToDisplay = computed<boolean>(() => {
		const starWarsService = this.#_starWarsService;
		const currentStarShip = this.currentStarShip();
		if (currentStarShip === starWarsService.currentStarShip()) {
			return !starWarsService.isLoading();
		}

		return currentStarShip !== DEMO_STARSHIP;
	});

	readonly currentStarShip = linkedSignal<StarShip>(() => {
		const currentShip = this.#_starWarsService.currentStarShip();
		if (currentShip !== null) {
			return currentShip;
		} else {
			return DEMO_STARSHIP;
		}
	});

	readonly shipSelect = viewChild.required<ElementRef<HTMLSelectElement>>('shipSelect');
	readonly shipList = viewChild.required(StarshipSelectListComponent);
	readonly container = viewChild.required<ElementRef<HTMLElement>>('container');

	constructor() {
		effect(() => {
			const currentStarShipId = this.currentStarShip().id;
			const starShipSelect = this.shipSelect().nativeElement;
			if (currentStarShipId !== starShipSelect.value) {
				starShipSelect.value = currentStarShipId;
			}
		})
	}

	ngAfterViewInit(): void {
		this.shipSelect().nativeElement.selectedIndex = -1;
		this.container().nativeElement.focus();
	}

	likeCurrentStarShip(): void {
		this.likedShips.update(prev => new Set([...prev, this.currentStarShip()]));
	}

	selectStarshipFromDropdown(starshipId: string): void {
		this.#_starWarsService.selectStarShipById(starshipId)
	}

	toggleLikedStarshipSelection(starship: StarShip): void {
		let shouldDisplayShip = false;
		this.selectedLikedShips.update(currentLiked => {
			if (currentLiked.has(starship)) {
				currentLiked.delete(starship);
			} else {
				currentLiked.add(starship);
				shouldDisplayShip = true;
			}

			return new Set(currentLiked);
		});

		if (shouldDisplayShip) this.currentStarShip.set(starship);
	}

	clearStarship(): void {
		this.#_starWarsService.clearSelectedStarship();
	}

	toggleAllowNameEdits(): void {
		this.allowNameEdits.update(val => !val);
	}

	removeSelectedLikedShips(): void {
		this.likedShips.update(likedShips => {
			const currentSelected = this.selectedLikedShips();
			for (const selectedShip of currentSelected) {
				likedShips.delete(selectedShip);
			}
			return new Set(likedShips);
		})
	}

	removeLikedShip(starShip: StarShip): void {
		this.likedShips.update(currentLiked => {
			currentLiked.delete(starShip);
			return new Set(currentLiked);
		})
	}

	toggleShowMeme(): void {
		this.showMeme.update(val => !val);
	}

	onKeydown(event: KeyboardEvent): void {
		if (event.key === 'Tab') {
			event.preventDefault();
			event.stopPropagation();
			this.shipList().focusFirstShip();
		}
	}
}
