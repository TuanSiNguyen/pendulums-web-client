import * as _ from 'lodash';
import * as moment from 'moment';
import { Component, Inject, Input, OnInit,
  Output, EventEmitter }                    from '@angular/core';
import { APP_CONFIG }                       from '../../../app.config';
import { Activity }                         from '../../../shared/state/current-activity/current-activity.model';
import { ActivityService }                  from '../../shared/activity.service';
import { ModalService }                     from '../../../core/modal/modal.service';
import { ErrorService }                     from '../../../core/error/error.service';

@Component({
  selector: 'create-activity',
  templateUrl: './activity-add-edit-manually.component.html',
  styleUrls: ['./activity-add-edit-manually.component.sass']
})
export class AddManuallyActivityComponent implements OnInit {
  @Output() responseActivity = new EventEmitter();
  @Input() currentActivity: Activity;
  @Input() activity: Activity;
  @Input() projectId: string;
  activityModel: Activity;
  fromCalenderShow = false;
  toCalenderShow = false;

  toTimeError = false;
  fromTimeError = false;
  timeError: string;

  fromCalenderError = false;
  toCalenderError = false;
  dateError: string;

  toDate: string;
  toTime: string;

  fromDate: string;
  fromTime: string;

  constructor (@Inject(APP_CONFIG) private config,
               private activityService: ActivityService,
               private modalService: ModalService,
               private errorService: ErrorService) {}

  ngOnInit() {
    if (this.activity) {
      this.activityModel = _.cloneDeep(this.activity);
      this.fromDate = moment(Number(this.activityModel.startedAt)).format('dddd, MMMM Do YYYY');
      this.toDate = moment(Number(this.activityModel.stoppedAt)).format('dddd, MMMM Do YYYY');
      this.fromTime = moment(Number(this.activityModel.startedAt)).format('HH:mm');
      this.toTime = moment(Number(this.activityModel.stoppedAt)).format('HH:mm');
    } else {
      this.activityModel = new Activity();
    }
  }

  showFromCalender() {
    this.fromCalenderShow = true;
  }

  closeFromCalender() {
    this.fromCalenderShow = false;
  }

  showToCalender() {
    this.toCalenderShow = true;
  }

  closeToCalender() {
    this.toCalenderShow = false;
  }

  updateToTime() {
    this.toTimeError = this.checkTime();
    if (this.toTimeError) {
      this.timeError = 'End time could not be before start time';
    } else {
      this.fromTimeError = false;
    }
  }

  updateFromTime() {
    this.fromTimeError = this.checkTime();
    if (this.fromTimeError) {
      this.timeError = 'Start time could not be after end time';
    } else {
      this.toTimeError = false;
    }
  }

  checkTime(): boolean {
    if (this.fromTime && this.toTime) {
      if (this.fromDate && this.toDate) {
        const tempFromDate = moment(this.fromDate, 'dddd, MMMM Do YYYY').hours(0).minutes(0).seconds(0);
        const tempToDate = moment(this.toDate, 'dddd, MMMM Do YYYY').hours(0).minutes(0).seconds(0);
        if (tempToDate.isSame(tempFromDate)) {
          const fromTimeArray = this.fromTime.split(':');
          const toTimeArray = this.toTime.split(':');
          if (Number(fromTimeArray[0]) > Number(toTimeArray[0])) {
            console.log('invalid time error.');
            return true;
          }
          if (Number(fromTimeArray[0]) === Number(toTimeArray[0])) {
            if (Number(fromTimeArray[1]) >= Number(toTimeArray[1])) {
              console.log('invalid time error.');
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  updateToDate(event) {
    this.toDate = event.format('dddd, MMMM Do YYYY');
    this.toCalenderError = this.checkDate();
    if (this.toCalenderError) {
      this.dateError = 'End date could not be before start date';
    } else {
      this.fromCalenderError = false;
    }
    this.toCalenderShow = false;
  }

  updateFromDate(event) {
    this.fromDate = event.format('dddd, MMMM Do YYYY');
    this.fromCalenderError = this.checkDate();
    if (this.fromCalenderError) {
      this.dateError = 'Start date could not be after end date';
    } else {
      this.toCalenderError = false;
    }
    this.fromCalenderShow = false;
  }

  checkDate(): boolean {
    if (this.fromDate && this.toDate) {
      const tempFromDate = moment(this.fromDate, 'dddd, MMMM Do YYYY').hours(0).minutes(0).seconds(0);
      const tempToDate = moment(this.toDate, 'dddd, MMMM Do YYYY').hours(0).minutes(0).seconds(0);

      // anyway timeCheck should run to check times are ok or not
      const tempCheck = this.checkTime();
      this.fromTimeError = tempCheck;
      this.toTimeError = tempCheck;
      if (tempCheck) {
        this.timeError = 'Please check chosen times';
      }

      if (tempToDate.isBefore(tempFromDate)) {
        return true;
      }
    }
    return false;
  }

  addActivity() {
    const validation = this.validateForm();
    if (validation) {
      if (this.activity) {
        this.activityService.editOldActivity(this.projectId,  this.activityModel).then((activity) => {
          this.showError('Activity was edited');
          this.responseActivity.emit(activity);
          this.modalService.close();
        })
          .catch(error => {
            this.showError('Server error happened');
            console.log('error is: ', error);
          });
      } else {
        this.activityService.createManually(this.projectId,  this.activityModel).then((activity) => {
          this.showError('Activity was created');
          this.responseActivity.emit(activity);
          this.modalService.close();
        })
          .catch(error => {
            this.showError('Server error happened');
            console.log('error is: ', error);
          });
      }
    }
  }

  validateForm(): boolean {
    let finalCheck = true ;
    if (this.IsNullOrWhiteSpace(this.activityModel.name)) {
      this.activityModel.name = 'Untitled name';
    }
    if (this.fromDate && this.toDate) {
      const tempCheck = this.checkDate();
      if (tempCheck) {
        finalCheck = false;
        this.toCalenderError = tempCheck;
        this.fromCalenderError = tempCheck;
        this.dateError = 'Please check chosen dates';
      }
      if (this.toTimeError || this.toTimeError) {
        finalCheck = false;
        this.timeError = 'Please check chosen times';
      }
    }
    if (!this.fromDate || !this.toDate) {
      this.fromCalenderError = !this.fromDate;
      this.toCalenderError = !this.toDate;
      this.dateError = 'Please choose a date';
      finalCheck = false;
    }
    if (!this.fromTime || !this.toTime) {
      this.fromTimeError = !this.fromTime;
      this.toTimeError = !this.toTime;
      this.timeError = 'Please choose a time';
      finalCheck = false;
    }
    if (finalCheck) {
      const now = moment().valueOf();
      const fromTimeArray = this.fromTime.split(':');
      const toTimeArray = this.toTime.split(':');
      const tempFromDate = moment(this.fromDate, 'dddd, MMMM Do YYYY').hours(Number(fromTimeArray[0]))
        .minutes(Number(fromTimeArray[1])).seconds(0).valueOf();
      const tempToDate = moment(this.toDate, 'dddd, MMMM Do YYYY').hours(Number(toTimeArray[0]))
        .minutes(Number(toTimeArray[1])).seconds(0).valueOf();
      if (now < tempFromDate) {
        finalCheck = false;
        this.showError('Start time could not be later now');
      }
      if (now < tempToDate) {
        finalCheck = false;
        this.showError('End time could not be after now');
      }
      if (this.currentActivity) {
        if (this.currentActivity.startedAt) {
          console.log('this.currentActivity', this.currentActivity);
          if (Number(this.currentActivity.startedAt) < tempFromDate) {
            finalCheck = false;
            console.log('From time cant be after than currentActivity started time');
            this.showError('From time is after currentActivity startedAt!');
          }
          if (Number(this.currentActivity.startedAt) < tempToDate) {
            finalCheck = false;
            console.log('To time cant be after than currentActivity started time');
            this.showError('To time is after than currentActivity startedAt!');
          }
        }
      }
      this.activityModel.startedAt = tempFromDate.toString();
      this.activityModel.stoppedAt = tempToDate.toString();
    }
    return finalCheck;
  }

  IsNullOrWhiteSpace(value: string): boolean {
    if (value == null || value === 'undefined') {
      return true;
    }
    return value.toString().replace(/\s/g, '').length < 1;
  }

  showError(error) {
    this.errorService.show({
      input: error
    });
  }
}


