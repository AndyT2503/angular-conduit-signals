import { inject, Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterStateSnapshot, TitleStrategy } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class TitleStrategyService extends TitleStrategy {
  private readonly titleService = inject(Title);

  updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);
    if (title) {
      this.titleService.setTitle(`${title} - Conduit`);
    }
  }

}
