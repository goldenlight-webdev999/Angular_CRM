import { Component, OnInit, OnChanges, SimpleChanges, Input, HostListener, ViewChild, Inject } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MetacleanerAPIService } from '../../services/metacleaner-api.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { SessionService } from '../../services/session.service';
import { FileObject } from '../../models/file-object.model';
import * as ExiftoolTag from "./exiftool.json"
import { saveAs } from 'file-saver';
import b64toBlob from 'b64-to-blob';
import _ from "lodash";

@Component({
    selector: 'app-uploader',
    templateUrl: './uploader.component.html',
    styleUrls: ['./uploader.component.scss'],
    animations: [
        trigger('detailExpand', [
          state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
          state('expanded', style({height: '*'})),
          transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
      ],
})
export class UploaderComponent implements OnInit, OnChanges {

    @Input() allowedExtensions: Array<string>;
    @Input() maxFileSize: number;
    @Input() userTraffic: number;
    @Input() trafficLimit: number;
    @Input() authenticated: boolean;
    @Input() extended: boolean;
    @Input() fileInfo: Array<FileInfo>;

    computedAcceptedExtension: string;
    defaultMaxFileSize: number;
    defaultTrafficLimit: number;

    filename: string;
    metadata: any;
    metadataCount: number;

    loading: boolean;

    fileList: Array<File>;
    displayedColumns: string[] = ['select', 'name', 'type', 'size', 'status', 'action'];
    dataSource: any;
    selection: any;
    expandedElement: FileInfo;

    @ViewChild(MatTable) table: MatTable<FileInfo>;

    /**
     * UploaderComponent constructor
     *
     * @param api
     * @param analytics
     * @param sessionHandler
     */
    constructor(
        public api: MetacleanerAPIService,
        public analytics: GoogleAnalyticsService,
        public sessionHandler: SessionService,
        public dialog: MatDialog
    ) {
        this.defaultMaxFileSize = 5242880;
        this.defaultTrafficLimit = 1073741824;
        this.fileList = [];
        this.fileInfo = [];
        this.dataSource = new MatTableDataSource<FileInfo>(this.fileInfo);
        this.selection = new SelectionModel<FileInfo>(true, []);
    }

    /**
     * OnInit method
     */
    ngOnInit(): void {
        this.authenticated = this.sessionHandler.isAuthenticated();
    }

    /**
     * OnChanges method
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('allowedExtensions')) {
            this.computedAcceptedExtension = changes.allowedExtensions.currentValue.join(', .');
        }

        if (!this.maxFileSize) {
            this.maxFileSize = this.defaultMaxFileSize;
        }

        if (!this.trafficLimit || this.trafficLimit === 0) {
            this.trafficLimit = this.defaultTrafficLimit;
        }

        if (!this.userTraffic) {
            this.userTraffic = 0;
        }
    }

    /**
     * Method to proccess the files with metacleaner api
     *
     * @param event
     */
    processFiles($event: any): void {
        for (const selectedFile of this.selection.selected) {
            let file = this.fileList[selectedFile.index];
            if (selectedFile.status != "Cleaned" && file.size < this.maxFileSize && this.verifyTrafficLimit(file.size)) {
                this.loading = true;
                this.getBase64(file).then(data => {
                    this.api.uploadFile(new FileObject(file.name, data), this.authenticated).subscribe(
                        responseData => {
                            this.selection.clear();
                            this.metadata = Object.entries(responseData['metadata']);
                            this.metadataCount = Object.keys(responseData['metadata']).length;
                            this.filename = responseData['filename'];
                            this.fileInfo[selectedFile.index].status = "Cleaned";
                            this.fileInfo[selectedFile.index].metadata = Object.entries(responseData['metadata']);
                            saveAs(b64toBlob(responseData['content'], null), 'mc-' + this.filename);

                            this.loading = false;
                            this.analytics.eventTrack('upload-file', file.type, 'Upload File', 'User');
                        },
                        response => {
                            this.loading = false;
                            this.handleResponse(file.name, response);
                        }
                    );
                });
            } else {
                this.sessionHandler.showMessage('File is too large - Please select one of our premium plans to continue');
            }
        }
    }
    /** Method to update the metadata with metadata update api */
    updateMetadata(row: FileInfo): void{
        let file = this.fileList[row.index];
        if(file.size < this.maxFileSize && this.verifyTrafficLimit(file.size)) {
            this.loading = true;
            this.getBase64(file).then(data => {
                this.api.updateFileMetaData(new FileObject(file.name, data), row.metadata).subscribe(
                    responseData => {
                        this.selection.clear();
                        this.metadata = Object.entries(responseData['metadata']);
                        this.metadataCount = Object.keys(responseData['metadata']).length;
                        this.filename = responseData['filename'];
                        this.fileInfo[row.index].status = "Updated";
                        this.fileInfo[row.index].metadata = Object.entries(responseData['metadata']);
                        saveAs(b64toBlob(responseData['content'], null), 'mc-' + this.filename);

                        this.loading = false;
                        this.analytics.eventTrack('upload-file', file.type, 'Upload File', 'User');
                    },
                    response => {
                        this.loading = false;
                        this.handleResponse(file.name, response);
                    }
                );
            });
        } else {
            this.sessionHandler.showMessage('File is too large - Please select one of our premium plans to continue');
        }
    }
    /**
     * Method to get metadata of file
     *
     */
    getMetadata():void {
        let nFiles = this.fileInfo.filter(f => f.metadata === null);
        for(const mFile of nFiles){
            let file = this.fileList[mFile.index];
            if (mFile.status == "New" && file.size < this.maxFileSize && this.verifyTrafficLimit(file.size)) {
                this.loading = true;
                this.getBase64(file).then(data => {
                    this.api.getFileMetaData(new FileObject(file.name, data)).subscribe(
                        responseData => {
                            this.selection.clear();
                            this.metadata = Object.entries(responseData['metadata']);
                            this.fileInfo[mFile.index].metadata = Object.entries(responseData['metadata']);
                            this.fileInfo[mFile.index].writable = responseData['writable'];
                            this.loading = false;
                        },
                        response => {
                            this.loading = false;
                            this.handleResponse(file.name, response);
                        }
                    );
                });
            }else{
                this.sessionHandler.showMessage('File is too large - Please select one of our premium plans to continue');
            }
        }
    }

    /**
     * Method to get the file on base64
     *
     * @param file
     */
    private getBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () =>  {
                const data = (<string>reader.result).split(',');
                data.shift();
                resolve(data.join(','));
            };
            reader.onerror = error => reject(error);
        });
    }

    /**
     * Method to check and load files
     *
     * @param files
     */
    private loadFiles(files: Array<File>): void {
        if (files.length > 0) {
            const invalidFileNames: Array<string> = [];
            const invalidExtensions: Array<string> = [];
            let index = this.fileInfo.length;
            for (const file of files) {
                const extension = file.name.split('.')[file.name.split('.').length - 1];
                if (this.allowedExtensions.lastIndexOf(extension) !== -1) {
                    this.fileList.push(file);
                    let fInfo = {
                        name: file.name, 
                        type: file.type, 
                        size: Math.floor(file.size/1024), 
                        index:index, 
                        status: "New",
                        metadata: null,
                        writable: false
                    }
                    this.fileInfo.push(fInfo);
                    if(!this.authenticated || !this.extended){
                        this.selection.toggle(fInfo);
                    }
                    index ++;
                } else {
                    invalidFileNames.push(file.name);
                    if (invalidExtensions.lastIndexOf(extension) === -1) {
                        invalidExtensions.push(extension);
                    }
                }
            }
            if (invalidFileNames.length) {
                let isPlural = false;
                let lastFile;

                if (invalidFileNames.length > 1) {
                    isPlural = true;
                    lastFile = invalidFileNames.pop();
                }

                let extensionsList = invalidFileNames.join(', ');

                if (lastFile) {
                    extensionsList += ' and ' + lastFile;
                }

                this.sessionHandler.showMessage(extensionsList + (isPlural ? ' have invalid extensions' : ' has an invalid extension'));
            }
            if(this.table != undefined)
                this.table.renderRows();
            if(this.authenticated && this.extended){
                this.getMetadata();
            }else {
                this.processFiles(true);
            }
            // console.log(this.api)
            // if (invalidExtensions.length) {
            //     // Api request for invalid extensions
            //     this.api.invalidExtensions(invalidExtensions).subscribe(
            //         responseData => {
            //             console.log(responseData);
            //         },
            //         response => {
            //             this.handleResponse('', response);
            //         }
            //     );
            // }
        }
    }

    /**
     * Method to check traffic limit
     *
     * @param fileSize
     */
    private verifyTrafficLimit(fileSize: any): boolean {
        const sum = this.userTraffic + fileSize;
        if (sum > this.trafficLimit) {
            return false;
        }

        return true;
    }

    /**
     * Handler http response
     *
     * @param info
     * @param response
     */
    private handleResponse(info: string, response: any): void {
        if (response.status < 200) {
            // Informational responses
            if (response.status === 0) {
                this.sessionHandler.showMessage('File is too large - Please select one of our premium plans to continue');
            }
        } else if ( response.status < 300 ) {
            // Success responses

        } else if ( response.status < 400 ) {
            // Redirection responses

        } else if ( response.status < 500 ) {
            // Client errors
            switch (response.status) {
                case 401: // Unauthorized
                    this.sessionHandler.deleteSession();
                    break;
                case 413: // Payload Too Large
                    // this.sessionHandler.showMessage(info + ' is too large (maximum size: ' + String(this.maxFileSize / 1048576) + ' MB)');
                    this.sessionHandler.showMessage('File is too large - Please select one of our premium plans to continue');
                    break;
                case 429: // Too Many Requests
                    if (!this.authenticated) {
                        this.sessionHandler.showMessage('Max number of files reached, please upgrade your account');
                    } else {
                        this.sessionHandler.showMessage('You have reached the cleaned maximum of files for today');
                    }
                    break;
                default:
                    this.sessionHandler.showMessage(response.error.error);
            }
        } else if ( response.status < 600 ) {
            // Server errors
            this.sessionHandler.showMessage('Server error');
        } else {
            // Unknown code
            this.sessionHandler.showMessage('Unknown error code ' + '(' + response.status + ')');
        }
    }

    /**
     * Method to load files when they are dropped
     *
     * @param event
     */
    private onFilesDropped(event: any): void {
        this.loadFiles(event.dataTransfer.files);
    }

    /**
     * Files event handler
     *
     * @param event
     */
    onFilesChanged(event: any): void {
        this.loadFiles(event.target.files);
    }

    /**
     * Drop event handler
     *
     * @param event
     */
    @HostListener('drop', ['$event']) public onDrop(event: any): void {
        event.preventDefault();
        event.stopPropagation();
        this.onFilesDropped(event);
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.filter(row => row.status != "Cleaned").length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.filter(row => row.status != "Cleaned").forEach(row => this.selection.select(row));
    }

    /** open metadata dialog of selected file
     * @param row: fileinfo
     */
    openDialog(row) {
        let originData = _.cloneDeep(row);
        let res = row;
        let exiftoolTags = ExiftoolTag.default.taginfo.table;
        if(res.hasOwnProperty('metadata')){
            for(var k = 0 ; k < res.metadata.length ; k ++){
                let name = res.metadata[k][1][1];
                if(res.metadata[k][1][2] == true){
                    for(var i = 0 ; i < exiftoolTags.length; i ++){
                        let check = _.findIndex(exiftoolTags[i].tag, ['name', [name]]);
                        if(check != -1){
                            if(exiftoolTags[i].tag[check].hasOwnProperty('values')){
                                let values = [];
                                for(let j = 0 ; j < exiftoolTags[i].tag[check].values[0].key.length; j++)
                                    values.push(exiftoolTags[i].tag[check].values[0].key[j].val[0]['_']);
                                res.metadata[k].push(values);
                            }else{
                            }
                            break;
                        }
                    }
                }
            }
        }
        const dialogRef = this.dialog.open(DialogMetadata,{data:res, disableClose: true, autoFocus: true, minWidth: "60vw"});
        dialogRef.afterClosed().subscribe(result => {
            if(result == null){
                this.fileInfo[row.index] = originData;
                this.table.renderRows();
            }else{
                this.updateMetadata(result);
            }
        });

    }
      
}
export interface FileInfo{
    name: string;
    type: string;
    size: number;
    index: number;
    status: string;
    metadata: any;
    writable: boolean;
}
@Component({
    selector: 'dialog-metadata',
    templateUrl: 'dialog-metadata.html',
})
export class DialogMetadata {

    fileInfo: FileInfo;
    originalData: FileInfo;
    currentPlan: string;
    extendable: boolean;

    constructor(
        public dialogRef: MatDialogRef<DialogMetadata>,
        @Inject(MAT_DIALOG_DATA) public data: FileInfo,
        public sessionHandler: SessionService) {
            this.fileInfo = data;
        }   

    /**
     * OnInit method
     */
     ngOnInit() {
        const session = this.sessionHandler.getSession();
        this.currentPlan = session['plan'];
        this.extendable = session['plan'] == 'free' ? false : this.fileInfo.writable ;
    }


    /** add new metadata */
    addMetadata(){
        this.fileInfo.metadata.push(["", ["",""]]);
    }

    /** delete metadata 
     * @param index
    */
    deleteMetadata(index){
        this.fileInfo.metadata.splice(index,1);
    }

    /** save metadata */
    saveMetadata(){
        if(this.validateMetadata() === true )
            this.dialogRef.close(this.fileInfo);
        
    }
    
    /** update meatadata
     * @param event
     * @param metadata index
     * @param metadata value,title
    */
    handleMetadataChange(event, index, i){
        if( i == 0){
            this.fileInfo.metadata[index][i] = event.target.value;
            this.fileInfo.metadata[index][1][1] = event.target.value;
        }
        else if( i == 1)
            this.fileInfo.metadata[index][i][0] = event.target.value;
    }

    /** close dialog */ 
    closeDialog(){
        this.dialogRef.close(null);
    }

    /** validate metadata */
    validateMetadata() {
        for(let i = 0 ; i < this.fileInfo.metadata.length ;i ++){
            if(this.fileInfo.metadata[i][0] == "" || this.fileInfo.metadata[i][1][0] == "")
                return false;
        }
        return true;
    }

    isObject(val){
        return typeof val === 'object';
    }
}