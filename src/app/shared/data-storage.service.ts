import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class DataStorageService {
  constructor(private httpClient: HttpClient, private recipeService: RecipeService, private authService: AuthService) {
  }

  storeRecipes() {
    // const token = this.authService.getToken();
    // const header = new HttpHeaders().set('Authorization', 'Bearer 123');
    /*    return this.httpClient.put('https://recipe-book-ffd00.firebaseio.com/recipes.json',
          this.recipeService.getRecipes(),
          {
            observe: 'body',
            params: new HttpParams().set('auth', token)
            // headers: header
          });*/
    const req = new HttpRequest(
      'put',
      'https://recipe-book-ffd00.firebaseio.com/recipes.json',
      this.recipeService.getRecipes(), {
        reportProgress: true,
        // params: new HttpParams().set('auth', token)
      });
    return this.httpClient.request(req);
  }

  getRecipes() {
    // const token = this.authService.getToken();
    this.httpClient.get<Recipe[]>('https://recipe-book-ffd00.firebaseio.com/recipes.json')
      .map(
        (recipes) => {
          for (const recipe of recipes) {
            if (!recipe.ingredients) {
              recipe.ingredients = [];
            }
          }
          return recipes;
        }
      )
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipeService.setRecipes(recipes);
        }
      );
  }
}
