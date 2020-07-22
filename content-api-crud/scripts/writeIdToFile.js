// JSR223 script used internally by search tests
// Writes IDs and Revision IDs from search results to a file.

var writer = new java.io.FileWriter('./data/id.csv');
writer.append('id, revisionId\n');
var i = 1;
while(vars.get('id_' + i) != null) {
  writer.append(vars.get('id_' + i) + ',');
  writer.append(vars.get('revisionId_' + i))
  writer.append('\n');
  i++;
}
writer.close();