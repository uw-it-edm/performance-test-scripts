var response = vars.get('response');
response = response.replace('RevisionId', 'something');

var writer = new java.io.FileWriter('./out/update-item-2.json');
writer.write(response);
writer.close();