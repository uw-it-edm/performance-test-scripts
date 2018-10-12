var writer = new java.io.FileWriter('./out/update-item.json');
writer.write(vars.get('response'));
writer.close();