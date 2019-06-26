import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DateRangeType } from 'igniteui-angular';
import { FormBuilder, Validators } from '@angular/forms';

// NEW ISSUE DATA
const ALLUSERS = environment.allUsers;
const ALLGROUPS = environment.allGroups;
const ALLPCS = environment.allPcs;
const ALLCATEGORIES = environment.allCategories;
const ALLDEPARTMENTS = environment.allDepartments;
const USERPERMISSIONS = environment.userPermissions;

// EXISITING ISSUE DATA
const ISSUE = environment.issue;
const PRIORITIES = environment.priority;
const STATUSES = environment.status;
const ISSUEUSERSASND = environment.issueUsersAsnd;
const ISSUEGROUPSASND = environment.issueGroupsAsnd;
const ISSUEPCSASND = environment.issuePcsAsnd;
const ISSUENOTES = environment.issueNote;
const ISSUESUSERS = environment.usersRoleVIew;
const ISSUEGROUPS = environment.groupRoleView;
const ISSUEPCS = environment.pcView;
const ISSUEPARTS = environment.inventory;
const ISSUECATEGORIES = environment.categories;
const ISSUECHILDREN = environment.childrenIssues;
const ISSUEPARENTS = environment.parentIssues;
const ISSUEHISTORY = environment.history;
const ISSUEROLES = environment.roles;
const ISSUEUPDATED = environment.issueUpdated;
const ALLPARTS = environment.allParts;
const FILES = environment.issueFiles;
const ISSUEFILES = environment.files;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  // GENERAL VARIABLES
  public appRoot: ElementRef;
  public loading = false;
  public userPk;
  public issuePk;
  public issueBaseLink = location.origin + '/issue/';
  public postVariables;
  public userPermissions;
  public initialUpdateData;
  public submitUpdateData;
  public isAssignee = false;
  public closedIssue = false;
  @ViewChild('myPond') myPond;
  @ViewChild('privte') private;
  // NEW ISSUE DATA
  public allUsers;
  public allGroups;
  public allPcs;
  public allCategories;
  public allDepartments;
  public newSubject;
  public newUsers;
  public newGroups;
  public newPcs;
  public newCategories;
  public newDepartments;
  public existPriority;
  public existStatus;
  @ViewChild('existDate') public existDate;
  public disabledDates = [
    { type: DateRangeType.Before, dateRange: [new Date()] },
    { type: DateRangeType.Weekends }
  ];
  public myInsertUrl = '';
  public myUpdateUrl = '';

  // EXISTING ISSUE DATA

  // General Tab
  public issueData;
  public priorityData;
  public statusData;
  public asndUsersData;
  public assignedUsersName;
  public asndGroupsData;
  public assignedGroupsName;
  public asndPcsData;
  public assignedPcsName;

  public roleData;

  // Note Tab
  public issueNoteData;
  public issueFiles;
  public issueFileData;
  public filePks;

  // User Tab
  public issueUsersData; // Roles
  public addUserRole;
  public assignedUsersPk;

  // Group Tab
  public issueGroupData;
  public addGroupRole;
  public assignedGroupsPk;

  // Pc Tab
  public issuePcData;
  public assignedPcsPk;

  // Inventory Tab
  public issuePartData;
  public allPartData;
  public part;

  // Category Tab
  public issueCategoryData;
  public assignedCategoryPk;

  // Related Issues Tab
  public issueRelationData;
  public assignedIssuesPk;

  // History Tab
  public allHistoryData;

  // EDITOR STUFF
  public Editor = ClassicEditor;
  public content;
  public noteContent;
  public config = {
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      'insertTable',
      'undo',
      'redo'
    ],
    removePlugins: ['ImageCaption']
  };

  pondOptions = {
    class: 'my-filepond',
    multiple: true,
    labelIdle: '<span class="filepond--label-action"> Browse for Files </span>',
    labelButtonProcessItem: 'Upload',
    acceptedFileTypes:
      'image/jpeg, image/png, application/pdf, text/plain,\
    application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    instantUpload: true,
    allowRevert: false,
    headers: { 'Content-Type': 'multipart/form-data' },
    server: {
      url: this.issuePk === 'new_issue' ? this.myInsertUrl : this.myUpdateUrl,
      process: {
        url: '',
        method: 'POST',
        withCredentials: false,
        onload: response => (this.issuePk === 'new_issue' ? response : location.reload()),
        onerror: response => response.data,
        ondata: formData => {
          formData.append('issuePk', this.issuePk);
          formData.append('userPk', this.userPk);
          return formData;
        }
      }
    }
  };

  constructor(private elm: ElementRef, private http: HttpClient, public fb: FormBuilder) {
    this.appRoot = elm;
  }

  public ngAfterViewInit(): void {}

  public ngOnInit(): void {
    this.part = this.fb.group({
      partPk: [null, Validators.required],
      unitPk: [null, Validators.required],
      pcPk: [null, Validators.required]
    });

    this.issuePk = this.appRoot.nativeElement.getAttribute('issueId');
    this.userPk = this.appRoot.nativeElement.getAttribute('userId');

    // GET All BASIC ISSUE DATA
    this.loading = true;
    this.getData(ALLUSERS, 'allUsers', 'm_stFirstname', this.allUsers).then(
      value => (this.allUsers = value)
    );
    this.getData(ALLGROUPS, 'allGroups', 'm_stName', this.allGroups).then(
      value => (this.allGroups = value)
    );
    this.getData(ALLPCS, 'allPcs', 'm_stSearch', this.allPcs).then(value => (this.allPcs = value));
    this.getData(ALLCATEGORIES, 'allCategories', 'm_stName', this.allCategories).then(
      value => (this.allCategories = value)
    );
    this.getData(ALLDEPARTMENTS, 'allDepartments', 'm_stName', this.allDepartments).then(
      value => (this.allDepartments = value)
    );
    this.getData(PRIORITIES, 'priorities', 'm_nPosition', this.priorityData).then(
      value => (this.priorityData = value)
    );
    this.getData(STATUSES, 'statuses', 'm_nPosition', this.statusData).then(
      value => (this.statusData = value)
    );
    if (this.issuePk === 'new_issue') {
      this.getData(
        USERPERMISSIONS + this.userPk,
        'userPermissions',
        undefined,
        this.userPermissions
      ).then(value => {
        this.userPermissions = value;
        this.loading = false;
      });
    }

    // GET EXISITING ISSUE DATA
    if (this.issuePk !== 'new_issue') {
      this.getData(ISSUEUPDATED + this.issuePk, 'updated', undefined, this.initialUpdateData).then(
        value => (this.initialUpdateData = value)
      );
      this.getData(FILES + this.issuePk, 'filesAsnd', '', this.issueFiles).then(value => {
        this.issueFiles = value;
        this.filePks = this.issueFiles.map(file => file.fkFile).toString();
        this.getData(ISSUEFILES + this.filePks, 'filesInfo', '', this.issueFileData).then(
          value3 => {
            this.issueFileData = value3;
            this.loading = false;
          }
        );
      });
      this.getData(
        USERPERMISSIONS + this.userPk,
        'userPermissions',
        undefined,
        this.userPermissions
      ).then(value => (this.userPermissions = value));
      this.getData(ISSUE + this.issuePk, 'issue', '', this.issueData).then(
        value => (this.issueData = value)
      );
      this.getData(
        ISSUEUSERSASND + this.issuePk,
        'usersAsnd',
        'm_stFirstname',
        this.asndUsersData
      ).then(value => (this.asndUsersData = value));

      this.getData(
        ISSUEGROUPSASND + this.issuePk,
        'groupsAsnd',
        'm_stName',
        this.asndGroupsData
      ).then(value => (this.asndGroupsData = value));
      this.getData(ISSUEPCSASND + this.issuePk, 'pcsAsnd', 'm_stLogins', this.asndPcsData).then(
        value => (this.asndPcsData = value)
      );
      this.getData(ISSUENOTES + this.issuePk, 'notes', '', this.issueNoteData).then(
        value => (this.issueNoteData = value)
      );
      this.getData(ISSUESUSERS + this.issuePk, 'users', '', this.issueUsersData).then(value => {
        this.issueUsersData = value;
        this.isAssignee = this.issueUsersData.find(obj => obj.userPk === this.userPk);
      });
      this.getData(ISSUEGROUPS + this.issuePk, 'groups', '', this.issueGroupData).then(
        value => (this.issueGroupData = value)
      );
      this.getData(ISSUEPCS + this.issuePk, 'pcs', '', this.issuePcData).then(
        value => (this.issuePcData = value)
      );
      this.getData(ISSUEPARTS + this.issuePk, 'parts', '', this.issuePartData).then(
        value => (this.issuePartData = value)
      );
      this.getData(ALLPARTS, 'allParts', '', this.allPartData).then(
        value => (this.allPartData = value)
      );
      this.getData(ISSUECATEGORIES + this.issuePk, 'categories', '', this.issueCategoryData).then(
        value => (this.issueCategoryData = value)
      );
      this.getData(ISSUEPARENTS + this.issuePk, 'parents', '', this.issueRelationData).then(
        value => {
          this.issueRelationData = value;
          this.getData(ISSUECHILDREN + this.issuePk, 'children', '', this.issueRelationData).then(
            value2 => (this.issueRelationData = value2)
          );
        }
      );
      this.getData(ISSUEHISTORY + this.issuePk, 'history', '', this.allHistoryData).then(
        value => (this.allHistoryData = value)
      );
      this.getData(ISSUEROLES, 'roles', '', this.roleData).then(value => (this.roleData = value));
    }
  }

  async getService(url: string): Promise<any> {
    try {
      const test = await this.http.get(url).toPromise();
      return test;
    } catch (e) {
      return e;
    }
  }

  sendPost(url: string, variables: HttpParams, newIssue: boolean, test = false) {
    let temp;
    this.http
      .post(url, variables, {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      })
      .subscribe(
        data => {
          temp = data;
        },
        (error: HttpErrorResponse) => {
          if (error.error instanceof Error) {
            console.log('Client-side error occurred.');
          } else {
            console.log('Server-side error occurred.');
          }
        },
        () => {
          if (test) {
            console.log(temp);
          } else {
            if (newIssue) {
              window.location.href = this.issueBaseLink + temp;
            } else {
              location.reload();
            }
          }
        }
      );
    return;
  }

  public async getData(url: string, intrface: string, sort: string, dataContainer: any) {
    const data = await this.getService(url);

    if (sort) {
      data.sort((a, b) => {
        if (typeof a[sort] === 'string') {
          if (a[sort] < b[sort]) {
            return -1;
          }
          if (a[sort] > b[sort]) {
            return 1;
          }
          return 0;
        } else {
          return a[sort] - b[sort];
        }
      });
    }
    if (intrface === 'updated') {
      dataContainer = [];
    } else {
      if (!dataContainer) {
        dataContainer = [];
      }
    }

    data.forEach((value: any) => {
      switch (intrface) {
        case 'allUsers':
          if (value.m_stActive) {
            dataContainer.push({
              pk: value.m_nPk,
              name:
                value.m_stFirstname === null
                  ? value.m_stLogin
                  : value.m_stFirstname + ' ' + value.m_stLastname
            });
          }
          break;

        case 'allGroups':
          dataContainer.push({
            pk: value.m_nPk,
            name: value.m_stName
          });
          break;

        case 'allPcs':
          const matchingId = dataContainer.find(pc => pc.id === value.m_nId);
          if (matchingId) {
            matchingId.search += ' ' + value.m_stSearch;
          } else {
            dataContainer.push({
              search: value.m_stSearch,
              id: value.m_nId
            });
          }
          break;

        case 'allCategories':
          dataContainer.push({
            pk: value.m_nPk,
            name: value.m_stName
          });
          break;

        case 'allDepartments':
          dataContainer.push({
            pk: value.m_nPk,
            name: value.m_stName
          });
          break;

        case 'userPermissions':
          dataContainer.push(value.m_stPermissionsName);
          break;

        case 'issue':
          if (value.m_nFkStatus === 5 || value.m_nFkStatus === 6) {
            this.closedIssue = true;
          }
          dataContainer.push({
            pk: value.m_nPk,
            subject: value.m_stSubject,
            status: value.m_nFkStatus,
            priority: value.m_nFkPriority,
            dueDate: value.m_timesDueDate ? new Date(value.m_timesDueDate) : null,
            createdDate: value.m_timesCreated ? new Date(value.m_timesCreated) : null,
            updatedDate: value.m_timesUpdated ? new Date(value.m_timesUpdated) : null,
            completedDate: value.m_timesCompleted ? new Date(value.m_timesCompleted) : null,
            resumeDate: value.m_timesReleaseDate ? new Date(value.m_timesReleaseDate) : null,
            details: value.m_stDetails
          });
          this.existPriority = value.m_nFkPriority;
          this.existStatus = value.m_nFkStatus;
          break;

        case 'priorities':
          dataContainer.push({
            pk: value.m_nPk,
            name: value.m_stName
          });
          break;

        case 'statuses':
          dataContainer.push({
            pk: value.m_nPk,
            name: value.m_stName
          });
          break;
        case 'usersAsnd':
          dataContainer.push({
            pk: value.m_nUserPk,
            name: value.m_stLastname
              ? value.m_stFirstname + ' ' + value.m_stLastname
              : value.m_stDisplayName
              ? value.m_stDisplayName
              : value.m_nUserPk
          });
          this.assignedUsersName = dataContainer.map(value2 => value2.name);

          break;

        case 'groupsAsnd':
          dataContainer.push({
            pk: value.m_nGroupPk,
            name: value.m_stName
          });
          this.assignedGroupsName = dataContainer.map(value2 => value2.name);
          break;

        case 'pcsAsnd':
          dataContainer.push({
            pk: value.m_nFkPc,
            name: value.m_stLogins ? value.m_stLogins + ' ' + value.m_stTitle : value.m_stTitle
          });
          this.assignedPcsName = dataContainer.map(value2 => value2.name);
          this.assignedPcsPk = dataContainer.map(value2 => value2.pk);
          break;

        case 'filesAsnd':
          dataContainer.push({
            fileLink: 'https://its3-dev.greenecountymo.gov/file/file.php?id=' + value.m_nFkFile,
            fkFile: value.m_nFkFile
          });
          break;
        case 'filesInfo':
          dataContainer.push({
            fileTitle: value.m_stTitle,
            fileDate: value.m_timesPosted,
            fullInfo: value.m_stTitle + ' ' + new Date(value.m_timesPosted).toLocaleDateString()
          });
          break;

        case 'notes':
          dataContainer.push({
            userPk: value.m_nFkUser,
            firstName: value.m_stFirstname,
            lastName: value.m_stLastname,
            createdDate: new Date(value.m_timesCreated).toLocaleString(),
            private: value.m_stPrivate ? 'private' : '',
            note: value.m_stInfo,
            displayName: value.m_stDisplayName
          });
          break;

        case 'users':
          dataContainer.push({
            userPk: value.m_nUserPk,
            roleName: value.m_stRoleName,
            Active: value.m_bActive,
            displayName: value.m_stDisplayName
              ? value.m_stDisplayName
              : value.m_stFirstname
              ? value.m_stFirstname + ' ' + value.m_stLastname
              : value.m_nUserPk
          });
          this.assignedUsersPk = dataContainer.map(value2 => value2.userPk);
          break;

        case 'groups':
          dataContainer.push({
            groupPk: value.m_nGroupPk,
            name: value.m_stName,
            roleName: value.m_stRolesName
          });
          this.assignedGroupsPk = dataContainer.map(value2 => value2.groupPk);

          break;

        case 'pcs':
          dataContainer.push({
            pcPk: value.m_nFkPc,
            login: value.m_stLogins ? value.m_stLogins : 'Not Available',
            title: value.m_stTitle
          });
          break;

        case 'parts':
          dataContainer.push({
            unitPk: value.m_nFkUnit,
            name: value.m_stPart,
            partPk: value.m_nPartId,
            pcName: value.m_stPc ? value.m_stPc : 'Not Available'
          });
          break;

        case 'allParts':
          dataContainer.push({
            title: value.m_stTitle,
            Description: value.m_stDescription,
            Barcode: value.m_stBarcode
          });
          break;

        case 'categories':
          dataContainer.push({
            relationPk: value.m_nRelationPk,
            categoryPk: value.m_nFkProject,
            name: value.m_stName
          });
          this.assignedCategoryPk = dataContainer.map(value2 => value2.categoryPk);
          break;

        case 'children':
          dataContainer.push({
            relationPk: value.m_nPk,
            issuePk: value.m_nFkIssueSecond,
            relation: 'Child'
          });
          this.assignedIssuesPk = dataContainer.map(value2 => value2.issuePk);
          break;

        case 'parents':
          dataContainer.push({
            relationPk: value.m_nPk,
            issuePk: value.m_nFkIssueFirst,
            relation: 'Parent'
          });
          if (this.assignedIssuesPk) {
            this.assignedIssuesPk.push(dataContainer.map(value2 => value2.issuePk));
          } else {
            this.assignedIssuesPk = dataContainer.map(value2 => value2.issuePk);
          }

          break;

        case 'history':
          dataContainer.push({
            userName: value.m_stUsername,
            change: value.m_stChanged,
            value: value.m_stValue,
            time: new Date(value.m_timesTime)
          });
          break;

        case 'roles':
          if (value.m_stName === 'Assignee' || value.m_stName === 'Watcher') {
            dataContainer.push({
              pk: value.m_nPk,
              name: value.m_stName
            });
          }
          break;

        case 'updated':
          dataContainer.push({
            time: new Date(value.m_timesUpdated)
          });
          break;

        default:
          break;
      }
    });

    // console.log(dataContainer);
    // console.log(this.loading);

    return dataContainer;
  }

  public onNewIssueSubmit(newIssue) {
    // console.log(newIssue);
    const sure = confirm('Are you sure you want to create this new issue?');
    this.postVariables = new HttpParams().set('userPk', this.userPk);
    if (sure) {
      if (newIssue[0].value) {
        this.postVariables = this.postVariables.set('subject', newIssue[0].value.trim());
      } else {
        return alert('You must enter a Subject.');
      }
      if (newIssue[1]) {
        const users = newIssue[1].map(user => user.pk);
        this.postVariables = this.postVariables.set('users', users);
      }
      if (newIssue[2]) {
        const groups = newIssue[2].map(group => group.pk);
        this.postVariables = this.postVariables.set('groups', groups);
      }
      if (newIssue[3]) {
        const pcs = newIssue[3].map(pc => pc.id);
        this.postVariables = this.postVariables.set('pcs', pcs);
      }
      if (newIssue[4]) {
        const categories = newIssue[4].map(category => category.pk);
        this.postVariables = this.postVariables.set('categories', categories);
      }
      if (newIssue[5]) {
        const departments = newIssue[5].map(department => department.pk);
        this.postVariables = this.postVariables.set('departments', departments);
      }
      if (newIssue[6].value) {
        this.postVariables = this.postVariables.set('dueDate', newIssue[6].value);
      }
      if (newIssue[7]) {
        if (newIssue[7].editorInstance.ui.view.element.children[2].textContent !== '') {
          this.postVariables = this.postVariables.set(
            'details',
            newIssue[7].editorInstance.ui.view.element.children[2].innerHTML
          );
        } else {
          return alert('Issue details must include text.');
        }
      } else {
        return alert('You must enter issue details.');
      }
      // console.log(this.postVariables);
      // this.sendPost(this.myInsertUrl, this.postVariables, true, true); // testing
      this.sendPost(this.myInsertUrl, this.postVariables, true);
    }
  }

  public onExistingIssueSubmit(existIssue) {
    // console.log(existIssue);
    // console.log(this.existPriority);
    // console.log(this.existStatus);
    // check if issue is out of date
    this.getData(ISSUEUPDATED + this.issuePk, 'updated', undefined, this.submitUpdateData).then(
      value => {
        this.submitUpdateData = value;
        if (this.submitUpdateData[0].time.getTime() !== this.initialUpdateData[0].time.getTime()) {
          const ignore = confirm(
            'Issue is out of date do you want to continue with changes anyways?'
          );
          if (ignore) {
            // post variables
            this.postVariables = new HttpParams().set('userPk', this.userPk);
            if (existIssue[0].value) {
              this.postVariables = this.postVariables.set('subject', existIssue[0].value.trim());
            } else {
              return alert('You must enter a Subject.');
            }
          } else {
            location.reload();
          }
        } else {
          // post variables
          this.postVariables = new HttpParams()
            .set('userPk', this.userPk)
            .set('issuePk', this.issuePk);
          if (!existIssue[0].value) {
            return alert('You must enter a Subject.');
          }
          if (existIssue[3]) {
            if (existIssue[3].editorInstance.ui.view.element.children[2].textContent === '') {
              return alert('You must enter issue details.');
            }
          } else {
            return alert('You must enter issue details.');
          }
          // check changed
          const subjectChanged = this.isChanged(
            this.issueData[0].subject,
            existIssue[0].value,
            'subject'
          );
          const priorityChanged = this.isChanged(
            this.issueData[0].priority,
            this.existPriority,
            'priority'
          );
          const statusChanged = this.isChanged(
            this.issueData[0].status,
            this.existStatus,
            'status'
          );
          const dateChanged = this.isChanged(
            this.issueData[0].dueDate ? this.issueData[0].dueDate.getTime() : null,
            existIssue[1].value ? existIssue[1].value.getTime() : null,
            'dueDate'
          );

          const resumeDate = this.isChanged(
            this.issueData[0].resumeDate ? this.issueData[0].resumeDate.getTime() : null,
            existIssue[2].value ? existIssue[2].value.getTime() : null,
            'resumeDate'
          );

          const arrayDetails = Array.from(existIssue[3].elementRef.nativeElement.children[1]
            .children[2].children[0].children as HTMLAllCollection);
          if (arrayDetails[arrayDetails.length - 1].localName === 'div') {
            arrayDetails.pop();
          }
          // console.log(arrayDetails[arrayDetails.length - 1]);
          const editedDetails = arrayDetails.map(value2 => value2.outerHTML);

          const detailsChanged = this.isChanged(
            this.issueData[0].details,
            editedDetails.join(''),
            'details'
          );

          if (
            subjectChanged ||
            statusChanged ||
            priorityChanged ||
            dateChanged ||
            detailsChanged ||
            resumeDate
          ) {
            console.log(this.postVariables);
            console.log(this.issueData[0].details);
            console.log(editedDetails.join(''));
            // this.sendPost(this.myUpdateUrl, this.postVariables, true, true); // testing
            this.sendPost(this.myUpdateUrl, this.postVariables, false);
          }
        }
      }
    );
  }

  public isChanged(oldValue, newValue, param) {
    if (oldValue !== newValue) {
      if (param === 'dueDate' || param === 'resumeDate') {
        this.postVariables = this.postVariables.set(param, new Date(newValue));
        return true;
      } else {
        this.postVariables = this.postVariables.set(param, newValue);
        return true;
      }
    }
  }

  public deselect(combo, value) {
    combo.deselectAllItems();
    value = undefined;
    combo.open();
  }

  public checkAssigned(container: string, input, rle) {
    // console.log(container);
    // console.log(input);
    let role;
    if (rle) {
      role = rle.selectedItems().map(value => value.pk);
      // console.log(role);
    }

    if (container === 'user') {
      const selected = input.selectedItems().map(value => value.pk);
      if (selected.length === 0) {
        return alert('Must select a user');
      }
      if (role.length === 0) {
        return alert('Must include a role');
      }

      if (this.assignedUsersPk) {
        if (this.assignedUsersPk.some(pk => selected.includes(pk))) {
          return alert('A selected user is already assigned a role on this issue.');
        }
      }
      this.postVariables = new HttpParams()
        .set('userPk', this.userPk)
        .set('issuePk', this.issuePk)
        .set('users', selected)
        .set('role', role);

      this.sendPost(this.myUpdateUrl, this.postVariables, false);
    }

    if (container === 'groups') {
      const selected = input.selectedItems().map(value => value.pk);
      if (selected.length === 0) {
        return alert('Must select a group');
      }
      if (role.length === 0) {
        return alert('Must include a role');
      }
      if (this.assignedGroupsPk) {
        console.log(this.assignedGroupsPk);
        if (this.assignedGroupsPk.some(pk => selected.includes(pk))) {
          return alert('A selected group is already assigned a role on this issue.');
        }
      }
      this.postVariables = new HttpParams()
        .set('userPk', this.userPk)
        .set('issuePk', this.issuePk)
        .set('groups', selected)
        .set('role', role);

      this.sendPost(this.myUpdateUrl, this.postVariables, false);
    }

    if (container === 'pc') {
      const selected = input.selectedItems().map(value => value.id);
      if (selected.length > 0) {
        if (this.assignedPcsPk) {
          if (this.assignedPcsPk.some(pk => selected.includes(pk))) {
            return alert('A selected pc is already assigned to this issue.');
          }
        }
      }
      this.postVariables = new HttpParams()
        .set('userPk', this.userPk)
        .set('issuePk', this.issuePk)
        .set('pcs', selected);

      this.sendPost(this.myUpdateUrl, this.postVariables, false);
    }

    if (container === 'categories') {
      const selected = input.selectedItems().map(value => value.pk);
      if (selected.length > 0) {
        if (this.assignedCategoryPk) {
          if (this.assignedCategoryPk.some(pk => selected.includes(pk))) {
            return alert('A selected category is already assigned to this issue.');
          }
        }
      }
      this.postVariables = new HttpParams()
        .set('userPk', this.userPk)
        .set('issuePk', this.issuePk)
        .set('categories', selected);

      this.sendPost(this.myUpdateUrl, this.postVariables, false);
    }

    let relatedIssue;
    if (container === 'issue') {
      console.log(input.value);
      // CHECK FOR EXISITING ISSUE DATA
      if (this.issuePk === input.value) {
        return alert('You cannot have the issue relate to itself');
      }
      this.getData(ISSUE + input.value, 'issue', '', relatedIssue).then(value => {
        relatedIssue = value;
        if (value.length === 0) {
          return alert('That is not a valid issue number');
        } else {
          if (this.assignedIssuesPk) {
            if (this.assignedIssuesPk.includes(parseInt(input.value, 10))) {
              return alert('That issue is already related');
            }
          }
          this.postVariables = new HttpParams()
            .set('userPk', this.userPk)
            .set('issuePk', this.issuePk)
            .set('relatedIssue', input.value);

          this.sendPost(this.myUpdateUrl, this.postVariables, false);
        }
      });
    }
  }

  public addNote(note) {
    const someNote = note.elementRef.nativeElement.children[1].children[2].children[0].innerText;
    if (someNote === '\n') {
      return alert('You must enter notes before submit');
    } else {
      const noteDetails = Array.from(note.elementRef.nativeElement.children[1].children[2]
        .children[0].children as HTMLAllCollection);
      if (noteDetails[noteDetails.length - 1].localName === 'div') {
        noteDetails.pop();
      }
      const editedDetails = noteDetails.map(value2 => value2.outerHTML);
      this.postVariables = new HttpParams()
        .set('userPk', this.userPk)
        .set('issuePk', this.issuePk)
        .set('note', editedDetails.join())
        .set('private', this.private.checked);
      this.sendPost(this.myUpdateUrl, this.postVariables, false);
    }
  }

  public checkPriority(priority) {
    this.existPriority = priority.newSelection.value;
  }

  public checkStatus(status) {
    this.existStatus = status.newSelection.value;
    if (status.newSelection.value === 7) {
      document.getElementById('resumeDate').hidden = false;
    } else {
      document.getElementById('resumeDate').hidden = true;
    }
  }

  public formatDate(date: Date) {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  removeAssigned(removed, assigned) {
    this.postVariables = new HttpParams()
      .set('userPk', this.userPk)
      .set('issuePk', this.issuePk)
      .set(removed, assigned);

    this.sendPost(this.myUpdateUrl, this.postVariables, false);
  }

  public addPart() {
    console.log(this.part);
  }

  public removeFile(fileId) {
    console.log(fileId);
    this.postVariables = new HttpParams()
      .set('userPk', this.userPk)
      .set('issuePk', this.issuePk)
      .set('filePk', fileId);

    this.sendPost(this.myUpdateUrl, this.postVariables, false);
  }
}
