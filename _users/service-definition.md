---
title: "Service Definition"
lang: en
ref: service-definition
permalink: /users/service-definition/
excerpt: "Service Definition"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## Concept Description

A service definition identifies a microservice. It defines the service name, version, and the application that the service belongs to. The service definition can also contain extended information defining the attribute metadata of a service.

## Scenario

To define a new microservice or modify its basic information, you may need to create and modify service definitions.

## Configuration

This section describe the following configration items related to the microservice.yaml file in the src\main\resources\ directory.

| Configuration on Item                    | Default | Range | Mandatory | Description                              | Remarks                                  |
| :--------------------------------------- | :------ | :---- | :-------- | :--------------------------------------- | :--------------------------------------- |
| APPLICATION\_ID                          | -       | -     | Yes       | Indicates an application name.           | -                                        |
| service\_description.name                | -       | -     | Yes       | Indicates a microservice name            | The microservice name should be unique within an application. The name can contain digits, uppercase and lowercase letters, hyphens(-), underscores(_), and periods(.); and can neither start nor end with punctuations. The naming rule is as follows: ^\[a-zA-Z0-9\]+$\|^\[a-zA-Z0-9\]\[a-zA-Z0-9\_-.\]\*\[a-zA-Z0-9\]$. |
| service\_description.version             | -       | -     | Yes       | Indicates a service version.             | -                                        |
| service\_description.properties          | -       | -     | No        | Configures microservice metadata(in the microservice.yaml file). | -                                        |
| service\_description.propertyExtendedClass | -       | -     | No        | Configures microservice metadata(through the PropertyExtended API). | The configurations returned through the API will overwrite those with the same keys in the configuration file. |
| instance\_description.properties         | -       | -     | No        | Configures instance metadata(in the microservice.yaml file) |                                          |
| instance\_description.propertyExtendedClass | -       | -     | No        | Configures microservice metadata(through the PropertyExtended API). | The configurations returned through the API will overwrite thos with the same keys in the configuration file. |

> NOTE：
- The metadata of a service is registered to the service center with the service. It is changed together with the service version. Changing metadata in the service center will keep the version unchanged.
- By default, one microservice can be called by only one APPLICATION_ID. You can set allowCrossApp=true in microservice properties to access a microservice acroos APPLICATION_ID.

## Sample Code

```yaml
APPLICATION_ID: helloTest #Application name
service_description: #Service description
  name: helloServer #Microservice name
  version: 0.0.1 #Service version
  properties: #Metadata
    allowCrossApp: false
    key1: value1
    key2: value2
  propertyExtendedClass: org.apache.servicecomb.serviceregistry.MicroServicePropertyExtendedStub
instance_description: #Instance description
  properties: #Metadata
    key3: value3
  propertyExtendedClass: org.apache.servicecomb.serviceregistry.MicroServicePropertyExtendedStub
```
