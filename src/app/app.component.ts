import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { exampleStarshipNameIdMap, StarShip, StarWarsService } from '../services/star-wars.service';
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
	id: '0'
}

@Component({
    selector: 'app-root',
	changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [StarshipDisplayComponent, StarshipSelectListComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
	readonly #_starWarsService = inject(StarWarsService);

	readonly isLoadingStarShip = this.#_starWarsService.isLoading;
	readonly allowNameEdits = signal<boolean>(false);
	readonly allShipsMap = exampleStarshipNameIdMap;

	readonly starshipSelected = computed<boolean>(() => {
		const starWarsService = this.#_starWarsService;
		return starWarsService.currentStarShip() !== null && !starWarsService.isLoading();
	});

	readonly starship = linkedSignal<StarShip>(() => {
		if (this.starshipSelected()) {
			return this.#_starWarsService.currentStarShip()!;
		} else {
			return DEMO_STARSHIP;
		}
	});

	readonly shipSelect = viewChild.required<ElementRef<HTMLSelectElement>>('shipSelect');

	selectStarship(starshipId: string): void {
		this.#_starWarsService.selectStarShipById(starshipId)
	}

	clearStarship(): void {
		this.shipSelect().nativeElement.selectedIndex = -1;
		this.#_starWarsService.clearSelectedStarship();
	}

	toggleAllowNameEdits(): void {
		this.allowNameEdits.update(val => !val);
	}
}
