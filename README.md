**Performance Test Scripts**

**Setup**

Install [Taurus](https://gettaurus.org/docs/Installation/)
    
    brew install bzt

**Run**

*content-api-crud*

1. `cd content-api-crud`
2. Create `system.properties` file and provide the keystore path and password (see `system.properties.example`)
3. Execute `bzt` and override the corresponding values for host, path, x-uw-act-as, profile. 
Adding `-report` generates a temporary online report.  
```
    bzt ./run-config.yml 
      -o scenarios.content.default-address=http://my.host
      -o scenarios.content.variables.path=/my/path/
      -o scenarios.content.headers.x-uw-act-as=me
      -o scenarios.content.variables.profile=myprofile
      -report
```

The load can be adjusted by overriding the corresponding `execution` values. 
For example, to run the same test with 10 concurrent threads:
```
    bzt ./run-config.yml -o execution.concurrency=10
```

**Reporting**

Results are written to `results/[timestamp]/kpi.jtl`.  