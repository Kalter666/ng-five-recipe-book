import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import { Store } from '@ngrx/store';
import { HttpClient, HttpRequest } from '@angular/common/http';

import * as RecipeActions from './recipe.actions';
import { Recipe } from '../recipe.model';
import * as fromRecipes from './recipe.reducers';

@Injectable()
export class RecipeEffects {
  @Effect()
  recipeFetch = this.actions$
    .ofType(RecipeActions.FETCH_RECIPES)
    .switchMap((action: RecipeActions.FetchRecipes) => {
      return this.httpClient.get<Recipe[]>('https://recipe-book-ffd00.firebaseio.com/recipes.json', {
          observe: 'body',
          responseType: 'json'
        });
    })
    .map(
      (recipes) => {
        for (const recipe of recipes) {
          if (!recipe.ingredients) {
            recipe.ingredients = [];
          }
        }
        return {
          type: RecipeActions.SET_RECIPES,
          payload: recipes
        };
      }
    );

  @Effect({dispatch: false})
  recipeStore = this.actions$
    .ofType(RecipeActions.STORE_RECIPES)
    .withLatestFrom(this.store.select('recipes'))
    .switchMap(([action, state]) => {
      const req = new HttpRequest(
        'put',
        'https://recipe-book-ffd00.firebaseio.com/recipes.json',
        state.recipes, {
          reportProgress: true,
          // params: new HttpParams().set('auth', token)
        });
      return this.httpClient.request(req);
    });

  constructor(private actions$: Actions, private httpClient: HttpClient,
               private store: Store<fromRecipes.FeatureState>) {
  }
}
