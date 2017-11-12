import { Component, Input, ViewContainerRef }         from '@angular/core';
import { Observable }                                 from 'rxjs/Observable';
import { ModalService }                               from '../../../core/modal/modal.service';
import { CreateProjectComponent }                     from '../create-project/create-project.component';
import { Project }                                    from '../../../shared/state/project/project.model';
import { Activity }                                   from '../../../shared/state/current-activity/current-activity.model';
import { Status }                                     from '../../../shared/state/status/status.model';

@Component({
  selector: 'list-of-project',
  templateUrl: './list-of-project.component.html',
  styleUrls: ['./list-of-project.component.sass'],
})

export class ListOfProjectComponent {
  @Input() projects: Observable<Project>;
  @Input() user: Observable<Project>;
  @Input() status: Observable<Status>;
  @Input() currentActivity: Observable<Activity>;

  constructor (
    private modalService: ModalService,
    private viewContainerRef: ViewContainerRef
  ) {}

  openCreateProjectModal() {
    this.modalService.show({
      component: CreateProjectComponent,
      containerRef: this.viewContainerRef
    });
  }
}
