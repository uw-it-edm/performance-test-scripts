var payload = new java.lang.String(
    java.nio.file.Files.readAllBytes(
        java.nio.file.Paths.get('./payload/create-item-template.json')
    )
);

payload = payload.replace('my-profile', vars.get('profile'));

var writer = new java.io.FileWriter('./out/create-item-payload.json');
writer.write(payload);
writer.close();