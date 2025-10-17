public with sharing class CaseController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getRelatedChild(Id caseId){
        return [select Id,CaseNumber,ParentId from Case where ParentId=:caseId WITH SECURITY_ENFORCED];     
    }
    @AuraEnabled(cacheable=true)
    public static List<FileWrapper> getFiles(Id caseId) {

        Set<Id> caseIds = new Set<Id>();
    caseIds.add(caseId);

    // Find child cases
    for (Case child : [
        SELECT Id FROM Case WHERE ParentId = :caseId WITH SECURITY_ENFORCED
    ]) {
        caseIds.add(child.Id);
    }
        //ContentDocumentLink This object represents the link between a file and a Salesforce record
        //LinkedEntityId:The ID of the record the file is attached to
        //ContentDocumentId: The actual file document ID.
        List<ContentDocumentLink> links = [
            SELECT ContentDocumentId
            FROM ContentDocumentLink
            WHERE LinkedEntityId = :caseIds
        ];

        Set<Id> docIds = new Set<Id>();
        for (ContentDocumentLink link : links) {
            docIds.add(link.ContentDocumentId);
        }

        

        if (docIds.isEmpty()) return new List<FileWrapper>();

        List<ContentVersion> versions = [
            SELECT Id, Title, ContentDocumentId
            FROM ContentVersion
            WHERE ContentDocumentId IN :docIds
           
        ];

        List<FileWrapper> wrappers = new List<FileWrapper>();
        for (ContentVersion cv : versions) {
            wrappers.add(new FileWrapper(
                cv.Id,
                cv.Title,
                cv.ContentDocumentId
            ));
        }
        return wrappers;
    }

    public class FileWrapper {
        @AuraEnabled public Id versionId;
        @AuraEnabled public String title;
        @AuraEnabled public Id contentDocumentId;

        public FileWrapper(Id versionId, String title, Id contentDocumentId) {
            this.versionId = versionId;
            this.title = title;
            this.contentDocumentId = contentDocumentId;
        }
    }
}