import { LightningElement,api,track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'
import getFiles from '@salesforce/apex/CaseController.getFiles'; 

export default class ViewFilesList extends NavigationMixin(LightningElement) {
 @track files=[]; 
    @api recordId; 
    connectedCallback() { 
        console.log('ChildCaseFileList -> recordId:', this.recordId); 
        this.LoadFiles(); 
    } 
    @api refreshFiles() { 
        this.LoadFiles(); 
    }

    LoadFiles() { 
        getFiles({caseId:this.recordId}) 
        .then(result=>{ 
            console.log('Loaded files:', result); 
            this.files=result; }) 
            .catch(error=>{ 
                console.log(error); 
            }); 
        }

     

handlePreview(event) {
    const docId = event.target.dataset.id; // Use ContentDocumentId
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: docId,
            objectApiName: 'ContentDocument',
            actionName: 'view'
        }
    });
}

    handleDownload(event) {
    const versionId = event.target.dataset.id; // This should be ContentVersion.Id
    window.open('/sfc/servlet.shepherd/version/download/' + versionId, '_blank');
}

    
    get noFiles() {
         return this.files && this.files.length === 0;
         }
          handleRefresh() 
          {
             //this.template.querySelector('c-child-case-file-list')?.refreshFiles(); 
             this.refreshFiles();
            }
            get fileCount() {
    return this.files.length;
}
         }