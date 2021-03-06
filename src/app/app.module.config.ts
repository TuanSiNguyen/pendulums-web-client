// ng and 3rd party modules
import { BrowserModule }          from '@angular/platform-browser';

// app modules
import { AppRoutingModule }       from './app-routing.module';
import { CoreModule }             from './core/core.module';
import { AuthenticationModule }   from './authentication/authentication.module';
import { DashboardModule }        from './dashboard/dashboard.module';
import { NoteModule }             from './note/note.module';

// components
import { AppComponent }           from './app.component';
import { NotFoundComponent }      from './not-found/not-found.component';
import { CookieService } from 'ngx-cookie-service';

export const AppModuleConfig = {
    declarations: [
        AppComponent,
        NotFoundComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        AuthenticationModule,
        DashboardModule,
        NoteModule
    ],
    providers: [CookieService],
    bootstrap: [AppComponent]
}
