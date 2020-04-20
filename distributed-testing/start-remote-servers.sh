#!/bin/bash

# Script to start Jmeter Servers on the remote machines from master.

set_vars()
{
  JMETER_PATH="/home/ec2-user/.bzt/jmeter-taurus/"
  JMETER_VERSION=`ls $JMETER_PATH`
  JMETER_HOME=$JMETER_PATH/$JMETER_VERSION
}

usage()
{
  echo "usage: $0 pem_file ip_address_1 [ip_address_2 ...]"
}

## Main

# Parse args
if [ "$#" -lt 2 ]; then
    echo "Illegal number of arguments. PEM file and at least 1 ip address is required. "
    usage
    exit 1
fi
PEMFILE=$1
shift

# Start servers
set_vars
for ip in "$@"; do
   echo ""
   echo " *** Starting Remote Server on $ip ..."
   ssh -o StrictHostKeyChecking=no -i $PEMFILE ec2-user@$ip "$JMETER_HOME/bin/jmeter -s -Jserver.exitaftertest=true -Jserver.rmi.ssl.disable=true > /dev/null 2>&1" &

done