var writer = new java.io.FileWriter('./data/id.csv');
writer.append('id\n');
for (var i=1; i <= vars.get('totalCount'); i++) {
  writer.append(vars.get('id_'+ i));
  writer.append('\n');
}
writer.close();