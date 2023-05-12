import { inject } from "@angular/core";
import { CanMatchFn, Router } from "@angular/router";
import { AuthStore } from "../store";

export const nonAuthGuard: CanMatchFn = () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);
    return (
      !authStore.selectors.isAuthenticated() ?? router.createUrlTree(['/'])
    );
  };