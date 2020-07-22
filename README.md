
# Performance Test Scripts

## Setup 

Install [Taurus](https://gettaurus.org/docs/Installation/)
    
    brew install bzt

## Run

### content-api-crud

`run-config.yml` runs all CRUD actions on content-api.
1. `cd content-api-crud`
2. Create `system.properties` file and provide the keystore path and password (see `system.properties.example`)
3. Execute `bzt ./run-config.yml` and override the corresponding values for host, path, headers, profile. 
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
1. Run `bzt ./delete.yml` and override the corresponding values for host, path, headers.
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
1. Run `bzt ./search.yml` and override the corresponding values for host, path, headers, search index.
```
bzt ./search.yml 
-o modules.jmeter.properties.hostname=my.host.name
-o scenarios.search.headers="key: 'value'"
-o scenarios.search.variables.path=/my/path
-o scenarios.search.variables.index=my-search-index
```
* This will generate a list of ids under `out/id.csv`. This file can then be used for [Delete](#delete)
* Additional optional config overrides: 
```
scenarios.search.requests.body-file=/path/file # path to body payload file [default: ./payload/search-body.json]
```

#### Create and Search

Two scenarios are run concurrently:
1. Create new items
2. Loop to continuously call Search until newly created item is found

To run: 
1. Create the create body payload file under `content-api-crud/payload/create-body.json`. 
See example in `content-api-crud/payload/create-item-template.json`
1. Run `bzt ./create-and-search.yml` and override the corresponding values for host, path, headers, search index.
```
bzt ./create-and-search.yml \
-o modules.jmeter.properties.hostname=my.host.name \
-o scenarios.create.headers="key: 'value'" \
-o scenarios.create.variables.create-path=/create/path \
-o scenarios.create-search.headers="key: 'value'" \
-o scenarios.create-search.variables.create-path=/create/path \
-o scenarios.create-search.variables.search-path=/search/path \
-o scenarios.create-search.variables.index=search-index-name \
```

* Additional optional config overrides: :
```
-o execution.0.concurrency=2 # number of concurrent calls [default: 1]
-o execution.0.iterations=2000 # number of iterations [default: 10]
```

#### Update and Search

Two scenarios are run concurrently:
1. Read and update items
2. Create new item and then loop to continuously call Search until newly created item is found

To run: 
1. Run [Search](#search) to generate id file. 
1. Create the create body payload file under `content-api-crud/payload/create-body.json`. 
See example in `content-api-crud/payload/create-item-template.json`
1. Run `bzt ./update-and-search.yml` and override the corresponding values for host, path, headers, search index.
```
bzt ./update-and-search.yml \
-o modules.jmeter.properties.hostname=my.host.name \
-o scenarios.update.headers="key: 'value'" \
-o scenarios.update.variables.create-path=/create/path \
-o scenarios.create-search.headers="key: 'value'" \
-o scenarios.create-search.variables.create-path=/create/path \
-o scenarios.create-search.variables.search-path=/search/path \
-o scenarios.create-search.variables.index=search-index-name \
```

* Additional optional config overrides: :
```
-o execution.0.concurrency=2 # number of concurrent calls [default: 1]
-o execution.0.iterations=2000 # number of iterations [default: 10]
```

#### Search and Bulk Edit

Run `bzt ./search-and-bulk-edit.yml` and override the corresponding values for host, paths, headers, search index.

```
bzt ./search-and-bulk-edit.yml \
-o modules.jmeter.properties.hostname=my.host.name \
-o scenarios.search-bulk-edit.headers="key: 'value'" \
-o scenarios.search-bulk-edit.variables.search-path=/search/path \
-o scenarios.search-bulk-edit.variables.index=search-index-name \
-o scenarios.search-bulk-edit.variables.edit-path=/bulk-edit/path \
```

* Additional optional config overrides: :
```
-o execution.0.concurrency=50 # number of concurrent calls [default: 1]
-o execution.0.iterations=1 # number of iterations [default: 10]
-o execution.0.ramp-up=5m # ramp-up time to reach target concurrency  [default: 0s]
-o execution.0.hold-for=15m # time to hold target concurrency [default: 0s]
```

## Reporting

Results are written to `results/[timestamp]/kpi.jtl`.  
To override this path:
```
settings.artifact-dir=path/myreports
```
## Distributed Testing
Tests can also be run on remote/distributed test machine(s).
The tests can be run from a master machine, which then distributes the load
to remote/slave machine(s). Both master and slave machines must be in the same subnet.

### Setup Remote Machine(s)

Launch remote machine(s) on AWS EC2. See [Setup Remote Machines](https://wiki.cac.washington.edu/display/EBS/Performance+Testing)

### Update Test Config
In the test config yml file:
1. Add `distributed` to the `execution` key:
    ```
    execution:
    - concurrency: 1
      ...
      distributed:
        - [remote_machine_private_ip_address_1]
        - [remote_machine_private_ip_address_2]
    ```
1. Add jmeter property to turn off SSL: 
    ```
   modules:
     jmeter:
       properties:
         server.rmi.ssl.disable: true
    ``` 
### Start Remote Jmeter Server(s)
From the master machine, start the Jmeter servers on the remote machines, 
`pem_file` is the private key file used to ssh to the remote machines:
```
./distributed-testing/start-remote-servers.sh pem_file remote_machine_public_ip_address_1 [remote_machine_public_ip_address_2]
```
### Run Tests
From the master machine, follow the same instructions as running in regular mode documented above.
Consolidated results from all remote machine(s) will be written as specified in [Reporting](## Reporting)