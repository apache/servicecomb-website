---
title: "Service Using API Definitions"
lang: en
ref: use-service-contract
permalink: /docs/users/use-service-contract/
excerpt: "Service Using API Definitions"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

{% include toc %}
## Scenario

When a consumer calls a service from a provider, you need to register a service API definition. You can obtain service API definition from your provider for your consumer in two ways. One is to obtain the service API definition from the provider off-line and manually configure the API definition to the project. Another is to automatically download the service API definition from the service center.

## Configuration

> You can obtain service API definition in either way, regardless of the development mode of service consumers.

In the microservice.yaml file, configure a provider for the consumer. The following is an example of the configuration:

```yaml
servicecomb:
  # other configurations omitted
  references:
    springmvc:
      version-rule: 0.0.1
```

> There are four kind of rule for version-rule:
>
> * Accurate Matching Rule: such as `version-rule: 0.0.1`, it indicates that only those  providers whose version is 0.0.1 can be matched.
> * Later Matching Rule: such as `version-rule: 1.0.0+`, it indicates that those providers whose version is later that 1.0.0 can be matched.
> * Latest Matching Rule: such as `version-rule: latest`, it indicates that only  those providers whose version number is latest can be matched.
> * Range Matching Rule: such as`1.0.0-2.0.2`,  it indicates that those provider whose version number is between 1.0.0 and 2.0.2 can be matched, including 1.0.0 and 2.0.2
>
> The default version rule of version-rule is `latest`.

### Manually Configuring Service API Definition

After you obtained the API definition of your consumer from the provider, configure it in a specified directory of the consumer project. The directory is the one mentioned in the configuration description [Service Contract](/users/service-contract/).

Each directory under the microservices directory indecates a microservice, and each .yaml file under the jaxrs directory represents a schema API definition. The file name is the schema ID. The service API definitions whose application IDs need to be specified are stored under the applications directory for cross-application calls. The directory structure is as follows:
```txt
resources
  - microservices
      - serviceName            # Microservice name
          - schemaId.yaml      # Schema API definition
  - applications
      - appId                  # Application ID
          - serviceName        # Microservice name
              - schemaId.yaml  # Schema API definition
```

### Automatically Downloading API Definition from Service Center

If a consumer does not explicitly store the API definition in the project directory, when the application is started, the ServiceComb framework automatically downloads the information about the API definition from the service center based on the provider's microservices name and version configured in microservice.yaml.
