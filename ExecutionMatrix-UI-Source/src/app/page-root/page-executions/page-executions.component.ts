import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import { Observable } from 'rxjs';
import { TestWithExecution } from '../../models/test-with-execution.model';
import {ExecutionResult} from "../../models/execution-result";
import {DatePipe} from "@angular/common";
import {ExecutionInTest} from "../../models/execution-in-test.model";
import {TestExecution} from "../../models/test-execution.model";
import {UtilsService} from "../../services/utils.service";
import {GlobalsService} from "../../services/globals.service";

class FilterOption {
  id: number;
  name?: string;

  constructor(id: number, name?: string) {
    this.id = id;
    this.name = name;
  }
}

interface IFilter {
  filterName: string;
  filterTag: string;

  initFilterOptions(onLoaded: () => any):void;

  selectedFilter: FilterOption | undefined;

  get
  filterOptions():  FilterOption[];
}

class ClassFilter implements IFilter {
  filterName: string = 'Test Class';
  filterTag: string = 'testClassId';

  cachedOptions: FilterOption[] = [];
  selectedFilter: FilterOption | undefined = undefined;



  constructor(public api: ApiServiceService) {}

  get filterOptions(): FilterOption[] {
    return this.cachedOptions;
  }

  initFilterOptions(onLoaded: () => any): void {
    let observable:Observable<void> = new Observable<void>();
    if (this.cachedOptions.length == 0)
      this.api.getTestClasses().subscribe((testClasses) => {
        for (const testClass of testClasses) {
          if (!testClass.id || !testClass.className) continue;
          let filterOption = new FilterOption(testClass.id, testClass.className);
          this.cachedOptions.push(filterOption);
          if (!this.selectedFilter)
            this.selectedFilter = filterOption;
        }
        onLoaded();
      });
    else
      onLoaded();

    // return observable;
  }
}

class VersionFilter implements IFilter {
  filterName: string = 'Version';
  filterTag: string = 'versionId';

  cachedOptions: FilterOption[] = [];
  selectedFilter: FilterOption | undefined = undefined;

  constructor(public api: ApiServiceService) {}

  get filterOptions(): FilterOption[] {
    return this.cachedOptions;
  }

  initFilterOptions(onLoaded: () => any): void {
    if (this.cachedOptions.length == 0)
      this.api.getVersions().subscribe((versions) => {
        for (const version of versions) {
          if (!version.id || !version.name) continue;
          let filterOption = new FilterOption(version.id, version.name);
          this.cachedOptions.push(filterOption);
          if (!this.selectedFilter || this.selectedFilter.id === filterOption.id) this.selectedFilter = filterOption;
        }
        onLoaded();
      })
    else
      onLoaded();
  }
}

class FeatureFilter implements IFilter {
  filterName: string = 'Feature';
  filterTag: string = 'featureId';

  cachedOptions: FilterOption[] = [];
  selectedFilter: FilterOption | undefined = undefined;

  constructor(public api: ApiServiceService) {}

  get filterOptions(): FilterOption[] {
    return this.cachedOptions;
  }

  initFilterOptions(onLoaded: () => any): void {
    if (this.cachedOptions.length == 0)
      this.api.getFeatures().subscribe((features) => {
        for (const feature of features) {
          if (!feature.id || !feature.featureName) continue;
          let filterOption = new FilterOption(feature.id, feature.featureName);
          this.cachedOptions.push(filterOption);
          if (!this.selectedFilter) this.selectedFilter = filterOption;
        }
        onLoaded();
      })
    else
      onLoaded();
  }
}


@Component({
  selector: 'app-page-executions',
  templateUrl: './page-executions.component.html',
  styleUrls: ['./page-executions.component.css'],
  providers: [DatePipe]
})
export class PageExecutionsComponent implements OnInit {

  availableFilters: IFilter[] = [
    new FeatureFilter(this.api),
    new ClassFilter(this.api),
    new VersionFilter(this.api),
  ];

  usedFilters: IFilter[] = [];

  testsWithExecutions:TestWithExecution[] = []

  ExecutionResult = ExecutionResult;

  selectedTest?:TestWithExecution;
  selectedExecutionId?:number;

  isTestListInit = false;

  @ViewChild('pageContainer', { static: true }) pageContainer: ElementRef | undefined;

  selectedTestExecutionResult?:TestExecution;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public api: ApiServiceService,
    public datePipe: DatePipe,
    public utils:UtilsService,
    public globals:GlobalsService
  ) {}

  ngOnInit(): void {

    const that = this;

    function init() {
      const testExecutionId = that.route.snapshot.queryParamMap.get('testExecution');

      if (!that.isTestListInit) {
        that.initTestsList(true);
        that.isTestListInit = true;
      }
      that.unLoadTestExecution();

      if (testExecutionId) {
        that.loadTestExecution(parseInt(testExecutionId));
      }
    }

    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd)
    //     init();
    // });

    init();


  }


  private initTestsList(_loadFiltersFromQuery = true) {

    const that = this;


    function loadFilterFromQuery(filterTag:string) {
      const filterValue = that.route.snapshot.queryParamMap.get(filterTag);
      if (filterValue) {
        let foundFilter = that.getAvailableFilterByTag(filterTag);
        if (foundFilter) {
          foundFilter.selectedFilter = new FilterOption(parseInt(filterValue))
          that.onAddFilterEvent(foundFilter);
        }
      }
    }

    if (_loadFiltersFromQuery) {
      loadFilterFromQuery('testClassId');
      loadFilterFromQuery('versionId');
      loadFilterFromQuery('featureId');
    }

    let versionId, testClassId, featureId;
    let testClassFilter = this.getUsedFilterByTag('testClassId');
    if (testClassFilter) testClassId = testClassFilter.selectedFilter?.id;
    let featureFilter = this.getUsedFilterByTag('featureId')
    if (featureFilter) featureId = featureFilter.selectedFilter?.id;
    let versionFilter = this.getUsedFilterByTag('versionId');
    if (versionFilter) versionId = versionFilter.selectedFilter?.id;

    this.api.getTestsWithExecutions(versionId,testClassId,featureId).subscribe(testsWithExecutions => {

      if (this.selectedExecutionId) {
        for (let ex of testsWithExecutions) {
          if (!ex.executions) continue;
          for (let exc of ex.executions)
            if (this.selectedExecutionId === exc.id) {
              ex.isExpanded = true;
              this.loadTestExecution(this.selectedExecutionId,ex);
              break;
            }
          if (ex.isExpanded)
            break;
        }


      }
      this.testsWithExecutions = testsWithExecutions;
    });
  }


  onAddFilterEvent(filter: IFilter) {
    const index = this.availableFilters.indexOf(filter);
    if (index == -1) return;
    this.availableFilters.splice(index, 1);
    this.usedFilters.push(filter);
    filter.initFilterOptions(() => {
      this.updateFiltersInQueryUrl();
    });

  }

  onRemoveFilterEvent(filter: IFilter) {
    const index = this.usedFilters.indexOf(filter);
    if (index == -1) return;
    this.usedFilters.splice(index, 1);
    this.availableFilters.push(filter);
    this.updateFiltersInQueryUrl();

    this.initTestsList(false);
  }

  private updateFiltersInQueryUrl() {



    for (let filter of this.usedFilters) {
      if (!filter.filterTag || !filter.selectedFilter?.id)
        continue

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { [filter.filterTag]: filter.selectedFilter?.id },
        queryParamsHandling: 'merge',
      });
    }

    for (let filter of this.availableFilters) {
      const filterVal = this.route.snapshot.queryParamMap.get(filter.filterTag);
      if (filterVal && filterVal !== '') {
        this.router.navigate([], {
          // relativeTo: this.route,
          queryParams: { [filter.filterTag]: null },
          queryParamsHandling: 'merge',
        });
      }
    }


  }

  private getAvailableFilterByTag(filterTag: string): IFilter | null {
    for (let filter of this.availableFilters) {
      if (filterTag === filter.filterTag) return filter;
    }
    return null;
  }

  private getUsedFilterByTag(filterTag:string) : IFilter | null {
    for (let filter of this.usedFilters) {
      if (filterTag === filter.filterTag) return filter;
    }
    return null;
  }

  onTestToggleExpand(testWithExecution: TestWithExecution) {
    testWithExecution.isExpanded = !testWithExecution.isExpanded;
  }


  loadTestExecution(testExecutionId: number,selectedTest?:TestWithExecution) {
    this.selectedExecutionId = testExecutionId;
    if (selectedTest)
      this.selectedTest = selectedTest;
  }

  private unLoadTestExecution() {
    this.selectedExecutionId = undefined;
    this.selectedTest = undefined;
  }

  get bottomHeight() {
    if (!this.pageContainer) return 0;
    return this.globals.rootElement ? this.globals.rootElement.offsetHeight - this.pageContainer.nativeElement.offsetHeight - 20 : 0
  }

  onSelectedExecutionResult($event: TestExecution) {
    this.selectedTestExecutionResult = $event;
  }


  shouldShowTestWithExecution(testWithExecution:TestWithExecution):boolean {
    for (let filter of this.usedFilters) {
      if (!filter.selectedFilter) continue;
      if (filter instanceof ClassFilter) {
        if (filter.selectedFilter.id !== testWithExecution.testClass?.id)
          return false;
      } else if (filter instanceof FeatureFilter) {
        if (!testWithExecution.features)
          continue;

        let featureFound = false;
        for (let feature of testWithExecution.features) {
          if (filter.selectedFilter?.id === feature.id) {
            featureFound = true;
            break;
          }
        }

        if (!featureFound)
          return false;
      } else if (filter instanceof VersionFilter) {
        if (!testWithExecution.executions)
          continue;

        let versionFound = false;
        for (let execution of testWithExecution.executions) {
          if (filter.selectedFilter?.id === execution.version?.id) {
            versionFound = true;
          }
        }
        if (!versionFound)
          return false;
      }
    }
    return true;
  }

  onSelectFilterValue(filter: IFilter, filterOption:FilterOption) {

    filter.selectedFilter = filterOption;

    this.testsWithExecutions = [];
    this.updateFiltersInQueryUrl();
    this.initTestsList(false);
  }
}