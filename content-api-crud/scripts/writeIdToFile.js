var writer = new java.io.FileWriter('./data/id.csv');
writer.append('id\n');
var i = 1;
while(vars.get('id_' + i) != null) {
  writer.append(vars.get('id_' + i));
  writer.append('\n');
  i++;
}
writer.close();