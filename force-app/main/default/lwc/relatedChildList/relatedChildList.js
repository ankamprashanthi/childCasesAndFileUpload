import { LightningElement,api } from 'lwc';
import getchildList from '@salesforce/apex/CaseController.getRelatedChild';

export default class RelatedChildList extends LightningElement {
    @api recordId;
    childList=[];
columns=[
    {label:'Child caseId',fieldName:'Id',sortable: false
},
    {
      label: 'Case Number',
        fieldName: 'caseUrl',
        type: 'url',
        typeAttributes: {
            label: { fieldName: 'CaseNumber' },
            target: '_blank' // opens in new tab
        },
                sortable: false

    },
    {label:'ParentId',fieldName:'ParentId', sortable: false}
]

   connectedCallback(){
    getchildList({caseId:this.recordId})
    .then((result)=>{
       this.childList = result.map(record => {
                return {
                    ...record,
                    caseUrl: `/lightning/r/Case/${record.Id}/view`
                };
            });
    })
    .catch((error)=>
    {
        console.log(error);
        this.childList=[];
    })

    }

    get hasChildCases() {
    return this.childList && this.childList.length > 0;
}
     get childCaseCount()
     {
        return this.childList.length;
     }
}