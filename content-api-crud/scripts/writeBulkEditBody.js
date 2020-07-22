// JSR223 script used internally by search-and-bulk-edit.yml
// Reads list of IDs, Revision Ids and writes the request body to be used by
// content-api bulk edit.

var idList = new java.util.ArrayList(
    java.nio.file.Files.readAllLines(
        java.nio.file.Paths.get('./data/id.csv')
    )
);

var writer = new java.io.FileWriter('./payload/bulk-edit-body.json');

writer.append('[\n');

for (var i=1; i<idList.size(); i++) {
    var id = idList.get(i).split(',')[0];
    var revisionId = idList.get(i).split(',')[1];

    writer.append('{"id": "' + id + '",');
    writer.append('"metadata": {"DataApiList": ["2","3"],"ProfileId": "Demo",');
    writer.append('"RevisionId": "'+ revisionId + '"}}');

    if (i < idList.size()-1) {
        writer.append(',\n');
    }
}

writer.append('\n]');
writer.close();