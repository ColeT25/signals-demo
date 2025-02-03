import { computed, Injectable, resource, signal } from '@angular/core';


export const exampleStarshipNameIdMap: Map<string, string> = new Map([['Death Star', '9'], ['Millennium Falcon', '10']]);

export interface StarShip {
	cost_in_credits: number;
	crew: number;
	hyperdrive_rating: number;
	length: number;
	manufacturer: string;
	model: string;
	name: string;
	id: string;
}

type StarShipRequest = {
	id: string;
}

export const INVALID_ID: string = '-1';
const baseStarShipRequestUrl = `http://swapi.dev/api/starships/`;

@Injectable({
  	providedIn: 'root'
})
export class StarWarsService {
	readonly #_starShipId = signal<string>(INVALID_ID);

	readonly #_starShipResource = resource<StarShip | null, StarShipRequest>({
		request: () => ({id: this.#_starShipId()}),
		loader: async ({request}) => {
			const id = request.id;
			if (id !== INVALID_ID) {
				const response = await fetch(`${baseStarShipRequestUrl}${id}`);
				return ({id: id, ...(await response.json())});
			}
			return null;
		}
	});

	readonly isLoading = this.#_starShipResource.isLoading;

	readonly currentStarShip = computed<StarShip | null>(() => {
		const currentResourceValue = this.#_starShipResource.value();
		return currentResourceValue ? currentResourceValue : null;
	});

	selectStarShipById(id: string) {
		this.#_starShipId.set(id);
	}

	clearSelectedStarship() {
		this.#_starShipId.set(INVALID_ID);
	}
}
