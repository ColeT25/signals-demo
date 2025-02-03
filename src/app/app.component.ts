import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { DEMO_STARSHIP, StarShip, StarWarsService } from '../services/star-wars.service';
import { StarshipDisplayComponent } from '../components/starship-display/starship-display.component';
import { StarshipSelectListComponent } from "../components/starship-select-list/starship-select-list.component";


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
	readonly starshipSelected = computed<boolean>(() => {
		const starWarsService = this.#_starWarsService;
		return starWarsService.currentStarShip() !== null && !starWarsService.isLoading();
	});

	// todo create component with signal inputs to pass starship into
	// update this to not just have a few buttons but a dropdown with some valid selections and more cool stuff
	// Also need to show off effects
	readonly starship = linkedSignal<StarShip>(() => {
		if (this.starshipSelected()) {
			return this.#_starWarsService.currentStarShip()!;
		} else {
			return DEMO_STARSHIP;
		}
	});

	readonly allowNameEdits = signal<boolean>(false);

	// doesn't work if you go from selecting by ID to selecting by name since the name isn't changing the ID signal doesn't update. Tricky tricky, may be worth demoing
	testStarshipSelect(): void {
		this.#_starWarsService.selectStarShipByName('Death Star')
	}

	testStarshipSelectById(): void {
		this.#_starWarsService.selectStarShipById('10')
	}

	testStarshipClear(): void {
		this.#_starWarsService.clearSelectedStarship();
	}

	toggleAllowNameEdits(): void {
		this.allowNameEdits.update(val => !val);
	}
}
