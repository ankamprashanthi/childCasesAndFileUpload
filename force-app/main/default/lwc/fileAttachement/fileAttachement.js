import { LightningElement,api } from 'lwc';
import shareFileWithParentCase from '@salesforce/apex/CaseController.shareFileWithParentCase';


export default class FileAttachement extends LightningElement {
    @api recordId;
    @api parentCaseId;
   
     acceptedFormats = ['.pdf','.png','.jpg','.jpeg'];
     /*handleUploadFinished(event){
         const uploadedFiles = event.detail.files;
         alert('No. of files uploaded : ' + uploadedFiles.length);

        //child to parent communication .notifying the parent component to refresh the file list
       const evt = new CustomEvent('filerefresh');
        this.dispatchEvent(evt);
     }*/
     
     handleUploadFinished(event) {
    const uploadedFiles = event.detail.files;

    // Share with parent case if available
    if (this.parentCaseId) {
        uploadedFiles.forEach(file => {
            shareFileWithParentCase({
                parentCaseId: this.parentCaseId,
                contentDocumentId: file.documentId
            }).catch(error => {
                console.error('Error linking file to parent:', error);
            });
        });
    }

    // Notify parent to refresh file list
    this.dispatchEvent(new CustomEvent('filerefresh'));
}
}