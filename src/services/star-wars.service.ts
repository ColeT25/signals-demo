import { computed, Injectable, linkedSignal, resource, signal } from '@angular/core';
import { Flavor } from '../utils/utils';


export const exampleStarshipNameIdMap: {[starShipName: string]: string} = {'Death Star': '9'};
export interface StarShip {
	cost_in_credits: number;
	crew: number;
	hyperdrive_rating: number;
	length: number;
	manufacturer: string;
	model: string;
	name: string;
	films: SwapiUrl[]
}

export const DEMO_STARSHIP: StarShip = {
	cost_in_credits: 10000,
	crew: 10,
	hyperdrive_rating: 5,
	length: 50,
	manufacturer: 'Angular',
	model: 'Angular signals',
	name: 'demo',
	films: []
}

type StarShipRequest = {
	id: string;
}
type SwapiUrl = Flavor<string, 'SwapiUrl'>;

const INVALID_ID: string = '-1';
const baseRequestUrl = 'http://swapi.dev/api/'
const baseStarShipRequestUrl = `${baseRequestUrl}starships/`;

// todo clean up + more type safety
@Injectable({
  	providedIn: 'root'
})
export class StarWarsService {
	readonly #_starShipName = signal<string>('');

	readonly #_starShipId = linkedSignal<string>(() => {
		const currentName = this.#_starShipName();
		return currentName !== '' ? exampleStarshipNameIdMap[currentName] : INVALID_ID;
	});

	readonly #_starShipRequest = computed<StarShipRequest>(() => ({id: this.#_starShipId()}));

	readonly #_starShipResource = resource<StarShip | null, StarShipRequest>({
		request: () => this.#_starShipRequest(),
		loader: async ({request}) => {
			if (request.id !== INVALID_ID) {
				const response = await fetch(`${baseStarShipRequestUrl}${request.id}`);
				return await response.json();
			}
			return null;
		}
	});

	readonly isLoading = this.#_starShipResource.isLoading;

	readonly currentStarShip = computed<StarShip | null>(() => {
		const currentResourceValue = this.#_starShipResource.value();
		return currentResourceValue ? currentResourceValue : null;
	});

	selectStarShipByName(name: string) {
		this.#_starShipName.set(name);
	}

	selectStarShipById(id: string) {
		this.#_starShipId.set(id);
	}

	clearSelectedStarship() {
		this.#_starShipName.set('');
	}
}
