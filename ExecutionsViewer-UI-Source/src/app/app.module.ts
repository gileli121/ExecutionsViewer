import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {ToastrModule} from 'ngx-toastr'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {ErrorInterceptor} from "./interceptors/error.interceptor";
import { PageNotFound } from './page-root/page-not-found/page-not-found.component';
import {CollapseModule} from "ngx-bootstrap/collapse";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CompNavbar } from './page-root/comp-navbar/comp-navbar.component';
import { CompVersionSelectorComponent } from './page-root/comp-version-selector/comp-version-selector.component';
import { PageTestsComponent } from './page-root/page-tests/page-tests.component';
import {NgxResizableModule} from "@3dgenomes/ngx-resizable";
import {PageExecutionsComponent} from "./page-root/page-executions/page-executions.component";
import { CompShowTestExecutionComponent } from './page-root/page-executions/comp-show-test-execution/comp-show-test-execution.component';
import { CompExecutionConsoleComponent } from './page-root/page-executions/comp-execution-console/comp-execution-console.component';
import {MatSelectModule} from "@angular/material/select";
import { PageFeaturesComponent } from './page-root/page-features/page-features.component';
import {MatTableModule} from "@angular/material/table";
import { CompPageMessageComponent } from './page-root/comp-page-message/comp-page-message.component';
import { CompPercentageCircleComponent } from './page-root/comp-percentage-circle/comp-percentage-circle.component';
import {CircleProgressOptions, NgCircleProgressModule} from "ng-circle-progress";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";
import { CompConsoleShowDiffsDialogComponent } from './page-root/page-executions/comp-execution-console/comp-console-show-diffs-dialog/comp-console-show-diffs-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {NgxTextDiffModule} from "ngx-text-diff";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {MatTooltipModule} from "@angular/material/tooltip";
import { PageMainFeaturesComponent } from './page-root/page-main-features/page-main-features.component';
import { CompFeaturesPerVersionComponent } from './page-root/page-features/comp-features-per-version/comp-features-per-version.component';
import { CompFeaturesAllVersionsComponent } from './page-root/page-features/comp-features-all-versions/comp-features-all-versions.component';
import {ChartModule} from "primeng/chart";
import { CompMainFeaturesPerVersionComponent } from './page-root/page-main-features/comp-main-features-per-version/comp-main-features-per-version.component';
import { CompMainFeaturesAllVersionsComponent } from './page-root/page-main-features/comp-main-features-all-versions/comp-main-features-all-versions.component';
import { CompTestsPerVersionComponent } from './page-root/page-tests/comp-tests-per-version/comp-tests-per-version.component';
import { CompTestsAllVersionsComponent } from './page-root/page-tests/comp-tests-all-versions/comp-tests-all-versions.component';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFound,
    CompNavbar,
    CompVersionSelectorComponent,
    PageTestsComponent,
    PageExecutionsComponent,
    CompShowTestExecutionComponent,
    CompExecutionConsoleComponent,
    PageFeaturesComponent,
    CompPageMessageComponent,
    CompPercentageCircleComponent,
    CompConsoleShowDiffsDialogComponent,
    PageMainFeaturesComponent,
    CompFeaturesPerVersionComponent,
    CompFeaturesAllVersionsComponent,
    CompMainFeaturesPerVersionComponent,
    CompMainFeaturesAllVersionsComponent,
    CompTestsPerVersionComponent,
    CompTestsAllVersionsComponent
  ],
    imports: [
        BrowserModule,
        ScrollingModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-right',
        }),
        BsDropdownModule.forRoot(),
        CollapseModule.forRoot(),
        NgxResizableModule,
        MatSelectModule,
        MatTableModule,
        NgCircleProgressModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatMenuModule,
        MatDividerModule,
        MatDialogModule,
        NgxTextDiffModule,
        MatTooltipModule,
        ChartModule
    ],
  providers: [
    HttpClient,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {provide: CircleProgressOptions}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
