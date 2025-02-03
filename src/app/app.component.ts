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
	// use model in there somewhere to show it off
	// update this to not just have a few buttons but a dropdown with some valid selections and more cool stuff
	// in component store starship in a signal and show how editing it works with update, demo set some more.
	// Also need to show off effects
	// Also add in some event handlers like mouse move and stuff that only go off at certain times to show how change detection is better
	// add comments throughout where I want to talk about stuff
	readonly starship = linkedSignal<StarShip>(() => {
		if (this.starshipSelected()) {
			return this.#_starWarsService.currentStarShip()!;
		} else {
			return DEMO_STARSHIP;
		}
	});

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
}
