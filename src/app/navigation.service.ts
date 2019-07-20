import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  navigateBackWithRedirectCheck() {
    this.activatedRoute.queryParams.pipe(
      take(1),
    ).subscribe(params => this.navigateBackWithRedirectParamsCheck(params));
  }

  private navigateBackWithRedirectParamsCheck(params: Params) {
    const redirectParam = params.redirect;
    const redirectUrlParam = params.redirectUrl;

    if (redirectParam != null) {
      this.router.navigate(redirectParam);
    } else if (redirectUrlParam != null) {
      this.router.navigateByUrl(redirectUrlParam);
    } else {
      this.location.back();
    }
  }
}
