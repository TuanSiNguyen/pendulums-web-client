import {Component, Input} from '@angular/core';
import {Project} from '../../../../shared/state/project/project.model';
import {ProjectService}  from '../../../shared/projects.service';
import {userRoleInProject} from '../../../shared/utils';
import {User} from '../../../../shared/state/user/user.model';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'project-members',
  templateUrl: './project-members.component.html',
  styleUrls: ['./project-members.component.sass']
})

export class ProjectMembersComponent {
  @Input() project: Project;
  @Input() user: User;

  constructor(private projectServices: ProjectService) {
  }

  userEmailHash(email) {
    return Md5.hashStr(email);
  }

  getUserRole() {
    return userRoleInProject(this.project, this.user.id);
  }

  removeMember(id) {
    console.log(id);
    // TODO: arminghm 22 Jul 2017 Show a popup menu to accept the delete process
    this.projectServices.removeMember(this.project._id, id)
      .then(response => {
        // TODO: arminghm 22 Jul 2017 Remove the deleted members from state
      })
      .catch(error => {
        console.log('error is: ', error);
      });
  }
}