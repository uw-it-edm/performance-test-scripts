
# Performance Test Scripts

## Setup 

Install [Taurus](https://gettaurus.org/docs/Installation/)
    
    brew install bzt

## Run

### content-api-crud

`run-config.yml` runs a all CRUD actions on content-api.
1. `cd content-api-crud`
2. Create `system.properties` file and provide the keystore path and password (see `system.properties.example`)
3. Execute `bzt` and override the corresponding values for host, path, headers, profile. 
Adding `-report` generates a temporary online report.  
```
    bzt ./run-config.yml 
      -o scenarios.content.default-address=http://my.host
      -o scenarios.content.variables.path=/my/path/
      -o scenarios.content.headers="key: 'value'"
      -o scenarios.content.variables.profile=myprofile
      -report
```

The load can be adjusted by overriding the corresponding `execution` values. 
For example, to run the same test with 10 concurrent threads:
```
    bzt ./run-config.yml -o execution.concurrency=10
```

#### Delete

1. Update `content-api-crud/data/id.csv` with list of ids to be deleted. 
    * This list can be manually generated or you can first run [Search](#search)
1. Run `bzt` and override the corresponding values for host, path, headers.
```
bzt ./delete.yml
-o modules.jmeter.properties.hostname=my.host.name
-o scenarios.delete.headers="key: 'value'"
-o scenarios.delete.variables.path=/my/path/
```
* Additional optional config overrides: 
```
execution.iterations=1000 # number of rows from id file to run [default: 20]
scenarios.delete.think-time=1000ms # time delay between each call [default: 100ms]
scenarios.delete.data-sources.path=/path/id.csv # path to id file [default: ./data/id.csv]
scenarios.delete.data-sources.loop=true # loop over in case of end-of-file reached if true, stop executing if false [default: false]
```

#### Search

1. Create the search body payload file under `content-api-crud/payload/search-body.json`
1. Run `bzt` and override the corresponding values for host, path, headers, search index.
```
bzt ./search.yml 
-o modules.jmeter.properties.hostname=my.host.name
-o scenarios.search.headers="key: 'value'"
-o scenarios.search.variables.path=/my/path
-o scenarios.search.variables.index=my-search-index
```
* This will generate a list of ids under `out/id.csv`. This file can then be used for [Delete](#delete)
## Reporting

Results are written to `results/[timestamp]/kpi.jtl`.  
