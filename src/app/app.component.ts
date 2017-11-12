import 'rxjs/add/operator/debounceTime';
import { Component, OnInit, ViewContainerRef }    from '@angular/core';
import { Router }                                 from '@angular/router';
import { Observable }                             from 'rxjs/Observable';
import { Store }                                  from '@ngrx/store';
import { AppState }                               from './shared/state/appState';
import { UserActions }                            from './shared/state/user/user.actions';
import { AuthenticationService }                  from './core/services/authentication.service';
import { ProjectsActions }                        from './shared/state/project/projects.actions';
import { StatusActions }                          from './shared/state/status/status.actions';
import { CurrentActivityActions }                 from './shared/state/current-activity/current-activity.actions';
import { ErrorService }                           from './core/error/error.service';
import { SyncService }                            from './core/services/sync.service';
import { Status }                                 from './shared/state/status/status.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  private user: Observable<any>;
  private projects: Observable<any>;
  private currentActivity: Observable<any>;
  private status: Observable<any>;
  private SideMenuIsActive = false;
  private netConnected: boolean;
  private previousLoginStatus = null;

  constructor(
    private authService: AuthenticationService,
    private store: Store<AppState>,
    private userActions: UserActions,
    private projectsActions: ProjectsActions,
    private currentActivityActions: CurrentActivityActions,
    private statusActions: StatusActions,
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private errorService: ErrorService,
    private syncService: SyncService
  ) {
    // to initialize state
    this.user = store.select('user');
    this.projects = store.select('projects');
    this.currentActivity = store.select('currentActivity');
    this.status = store.select('status');
  }

  ngOnInit(): void {
    this.errorService.setViewContainerRef(this.viewContainerRef);
    // to initialize webSocket connection
    this.syncService.init();

    // To handle connection indicator
    this.status.subscribe((state) => {
      if (!state.netStatus) {
        console.log('net is not connected!');
        this.netConnected = false;
      }
      if (state.netStatus) {
        console.log('net is connected!');
        this.netConnected = true;
      }
    });

    // to handle 403 interceptor by isLogin that has been handle in signOut and authInterceptor
    this.status.subscribe((status: Status) => {
      if ((status.isLogin === false) && status.isLogin !== this.previousLoginStatus) {
        this.store.dispatch(this.userActions.clearUser());
        this.store.dispatch(this.projectsActions.clearProjects());
        this.store.dispatch(this.currentActivityActions.clearCurrentActivity());
        this.store.dispatch(this.statusActions.clearStatus());
        this.syncService.closeConnection();
        this.router.navigate(['signIn']);
      }
      this.previousLoginStatus = status.isLogin;
    });
  }

  signOut() {
    this.authService.signOut()
      .then(() => {});
  }

  showSideMenu() {
    this.SideMenuIsActive = !this.SideMenuIsActive;
  }
}


