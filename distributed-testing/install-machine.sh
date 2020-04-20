#!/bin/bash

# Install Blazemeter Taurus and dependencies.
# See https://gettaurus.org/install/Installation/#Linux
sudo yum update
sudo yum remove java-1.7.0-openjdk # remove AMI pre-installed old Java version
sudo yum install java-1.8.0 python36  python36-devel  python36-pip libxml2-devel.x86_64 libxslt-devel.x86_64 zlib-static.x86_64 gcc
sudo pip install --upgrade pip
sudo python3 -m pip install bzt
sudo python3 -m pip install --upgrade bzt

# Install Jmeter
bzt ./install-bzt-jmeter.yml