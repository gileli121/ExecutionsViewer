import {Component, OnInit} from '@angular/core';
import {GlobalsService} from '../../services/globals.service';
import {ApiServiceService} from '../../services/api-service.service';
import {FeatureSummary} from "../../models/feature-summary.model";
import {TestClassSummary} from "../../models/test-class-summary.model";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-page-tests',
  templateUrl: './page-tests.component.html',
  styleUrls: ['./page-tests.component.css'],
})
export class PageTestsComponent implements OnInit {

  classesSummaries: TestClassSummary[] = [];

  columnsToDisplay = ['className', 'coverage', 'passRatio', 'totalTests'];

  constructor(
    private api: ApiServiceService,
    private globals: GlobalsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {

    const that = this;
    this.route.queryParams.subscribe(() => that.loadTableData());

    this.loadTableData();

  }


  private loadTableData() {
    this.api.getTestClassesSummary(this.globals.selectedVersionId).subscribe(classesSummaries => {
      this.classesSummaries = classesSummaries;
    })
  }

  onRowClicked(testClass: TestClassSummary) {

    this.router.navigate(['/executions'], {
      queryParams: {
        versionId: this.globals.selectedVersionId ? this.globals.selectedVersionId : null,
        testClassId: testClass.id
      }
    });
  }
}