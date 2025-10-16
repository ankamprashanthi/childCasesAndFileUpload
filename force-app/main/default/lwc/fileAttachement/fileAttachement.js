import { LightningElement,api } from 'lwc';

export default class FileAttachement extends LightningElement {
    @api recordId;
   
     acceptedFormats = ['.pdf','.png','.jpg','.jpeg'];
     handleUploadFinished(event){
         const uploadedFiles = event.detail.files;
         alert('No. of files uploaded : ' + uploadedFiles.length);

        //child to parent communication .notifying the parent component to refresh the file list
       const evt = new CustomEvent('filerefresh');
        this.dispatchEvent(evt);
     }
     
}