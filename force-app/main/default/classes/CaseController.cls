public with sharing class CaseController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getRelatedChild(Id caseId){
        return [select Id,CaseNumber,ParentId from Case where ParentId=:caseId WITH SECURITY_ENFORCED];     
    }
    @AuraEnabled(cacheable=true)
    public static List<FileWrapper> getFiles(Id caseId) {
        List<ContentDocumentLink> links = [
            SELECT ContentDocumentId
            FROM ContentDocumentLink
            WHERE LinkedEntityId = :caseId
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