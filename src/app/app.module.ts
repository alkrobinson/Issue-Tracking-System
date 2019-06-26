import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  IgxInputGroupModule,
  IgxIconModule,
  IgxComboModule,
  IgxDatePickerModule,
  IgxButtonModule,
  IgxSelectModule,
  IgxTabsModule,
  IgxCheckboxModule,
  IgxGridModule,
  IgxDialogModule
} from 'igniteui-angular';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import filepond module
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import { MatListModule } from '@angular/material/list';

// import and register filepond file type validation plugin
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
registerPlugin(FilePondPluginFileValidateType);



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    IgxTabsModule,
    IgxInputGroupModule,
    IgxIconModule,
    IgxComboModule,
    IgxDatePickerModule,
    CKEditorModule,
    IgxButtonModule,
    IgxSelectModule,
    IgxCheckboxModule,
    IgxGridModule,
    IgxDialogModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
    FilePondModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
