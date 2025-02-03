import { Component, input, model, output } from '@angular/core';
import { StarShip } from '../../services/star-wars.service';

@Component({
	selector: 'starship-display',
	imports: [],
	template:`

	`,
	styleUrl: './starship-display.component.scss'
})
export class StarshipDisplayComponent {
	readonly starShip = model.required<StarShip>();
	readonly allowEdit = input<boolean>(false);

	readonly buyStarShip = output<number>();
	readonly likeStarShip = output<boolean>();
}
