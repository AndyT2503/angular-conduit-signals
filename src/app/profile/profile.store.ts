import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { OnStoreInit, tapResponse } from '@ngrx/component-store';
import { defer, exhaustMap, switchMap } from 'rxjs';
import { Profile } from '../shared/models';
import { ProfileService } from '../shared/services';
import { ComponentStoreWithSelectors } from '../shared/utils';

interface ProfileState {
  profile: Profile | null;
}

@Injectable()
export class ProfileStore
  extends ComponentStoreWithSelectors<ProfileState>
  implements OnStoreInit
{
  readonly #profileService = inject(ProfileService);
  readonly #router = inject(Router);
  readonly #title = inject(Title);
  ngrxOnStoreInit(): void {
    this.setState({
      profile: null,
    });
  }

  readonly getProfile = this.effect<string>(
    switchMap((username) =>
      this.#profileService.getProfile(username).pipe(
        tapResponse(
          (response) => {
            this.#title.setTitle(`${response.profile.username} - Conduit`);
            this.patchState({
              profile: response.profile,
            });
          },
          (error) => {
            console.error('Get Profile Failed', error);
            this.#router.navigate(['/']);
          }
        )
      )
    )
  );

  readonly toggleFollow = this.effect<Profile>(
    exhaustMap((profile) =>
      defer(() => {
        if (profile.following) {
          return this.#profileService.unfollowUser(profile.username);
        } else {
          return this.#profileService.followUser(profile.username);
        }
      }).pipe(
        tapResponse(
          () => {
            this.getProfile(profile.username);
          },
          (error) => {
            console.error('Toggle Follow User Failed', error);
          }
        )
      )
    )
  );
}
