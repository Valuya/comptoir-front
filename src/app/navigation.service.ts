import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private lastNavigatedUrl: string;
  private curUrl: string;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    // Keep the previous url to check whether we want to go back or up
    this.location.onUrlChange((url, state) => {
      this.lastNavigatedUrl = this.curUrl;
      this.curUrl = url;
    });
  }

  navigateBackOrToParentWithRedirectCheck() {
    this.activatedRoute.queryParams.pipe(
      take(1),
    ).subscribe(params => this.doUnlessRedirectParams(params,
      () => this.navigateBackOrToParent()
    ));
  }

  navigateWithRedirectCheck(link: any[]) {
    this.activatedRoute.queryParams.pipe(
      take(1),
    ).subscribe(params => this.doUnlessRedirectParams(params,
      () => this.router.navigate(link)
    ));
  }

  navigateToLoginWithReason(reasonValue: string, redirect?: string) {
    const currentUrl = this.router.url;
    this.router.navigate(['/login'], {
      queryParams: {
        reason: reasonValue,
        redirectUrl: redirect || currentUrl
      }
    });
  }

  private doUnlessRedirectParams(params: Params, callback: () => void) {
    const redirectParam = params.redirect;
    const redirectUrlParam = params.redirectUrl;

    if (redirectParam != null) {
      this.router.navigate(redirectParam);
    } else if (redirectUrlParam != null) {
      this.router.navigateByUrl(redirectUrlParam);
    } else {
      callback();
    }
  }

  private navigateBackOrToParent() {
    const path = this.location.path();
    const prevUrl = this.lastNavigatedUrl;
    if (prevUrl == null || prevUrl.startsWith('/login')) {
      // Navigate to parent path
      const segments = path.split('/');
      if (segments.length > 0) {
        const newPath = segments.slice(0, segments.length - 1);
        const newUrl = newPath.reduce((c, n) => `${c}/${n}`);
        const normalizedNewUrl = this.location.normalize(newUrl);
        this.router.navigate([normalizedNewUrl]);
        return;
      }
    }
    this.location.back();
  }
}
