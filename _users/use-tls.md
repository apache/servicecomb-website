---
title: "Using TLS for Communication"
lang: en
ref: use-tls
permalink: /users/use-tls/
excerpt: "Using TLS for Communication"
last_modified_at: 2017-08-15T15:01:43-04:00
redirect_from:
  - /theme-setup/
---

## Scenario

Users can use simple configurations to enable TLS communication to ensure data transmission security.

## External Service Communication Configuration

The configuration related to external service  communication is set in the microservice.yaml file.

* TLS communication configuration of the service center and configuration center
   The connection between the microservice and the service and configuration centers can be changed from HTTP to HTTPS, enabling TLS communication. The configuration example is as below:

   ```yaml
   cse:
     service:
       registry:
         address: https://127.0.0.1:30100
   ```

* TLS communication enabled by the service provider
   When configuring the service listening address, the service provider can add`?sslEnabled=true` to the end of the address to enable TLS communication. For example:

   ```yaml
   cse:
     rest:
       address: 0.0.0.0:8080?sslEnabled=true
     highway:
       address: 0.0.0.0:7070?sslEnabled=true
   ```

## Configure a Certificate

The certificate configuration items are set in the microservice.yaml file. You can customize certificates in a unified manner or add tags for configuration in a small granularity. The tag configuration overwrites the global configuration, and the configuration format is as follows:

```yaml
ssl.[tag].[property]
```

For details about the certificate configuration items, see Table 1.

**Table 1 Certificate configuration items**

| Configuration Item  | Default Value                            | Value Range                              | Mandatory | Description                              | Remarks                                  |
| :------------------ | :--------------------------------------- | :--------------------------------------- | :-------- | :--------------------------------------- | :--------------------------------------- |
| ssl.protocols       | TLSv1.2                                  | -                                        | No        | Specifies the protocol list.             | Use commas (,) to separate protocols.    |
| ssl.ciphers         | TLS\_ECDHE\_RSA\_WITH\_AES\_256\_GCM\_SHA384,<br/>TLS\_RSA\_WITH\_AES\_256\_GCM\_SHA384,<br/>TLS\_ECDHE\_RSA\_WITH\_AES\_128\_GCM\_SHA256,<br/>TLS\_RSA\_WITH\_AES\_128\_GCM\_SHA256 | -                                        | No        | Specifies the algorithm list             | Use commas (,) to separate protocols.    |
| ssl.authPeer        | true                                     | -                                        | No        | Specifies whether auhentication is required for the peer end. | -                                        |
| ssl.checkCN.host    | true                                     | -                                        | No        | Whether the CN of the certificate is checked | This configuration item is available and valid only for consumers using the HTTP protocol (the rest channel). This parameter is invalid for providers and highway channels. The purpose of checking CN is to protect the server from phishing attacks. For details, see the following standard:[https://tools.ietf.org/html/rfc2818。](https://tools.ietf.org/html/rfc2818。) |
| ssl.trustStore      | trust.jks                                | -                                        | No        | Specifies the trust certificate file.    | -                                        |
| ssl.trustStoreType  | JKS                                      | -                                        | No        | Specifies the type of trust certificate  | -                                        |
| ssl.trustStoreValue | -                                        | -                                        | No        | Specifies the password of the  trust certificate file. | -                                        |
| ssl.keyStore        | server.p12                               | -                                        | No        | Specifies the identity certificate file. | -                                        |
| ssl.keyStoreType    | PKCS12                                   | -                                        | No        | Specifies the type of identity certificate. | -                                        |
| ssl.keyStoreValue   | -                                        | -                                        | No        | Specifies the password of identity certificate. | -                                        |
| ssl.crl             | revoke.crl                               | -                                        | No        | Specifies the certificate revocation list(CRL) file. | -                                        |
| ssl.sslCustomClass  | -                                        | org.apache.servicecomb.foundation.ssl.SSLCustom implementation | No        | Specifies implementation of the SSLCustom class, which is used by developers to convert passwords and file paths. | -                                        |

> **NOTE:**
>
> * The default protocol algorithm is high-strength algorithm. The JDK needs to be installed together withe the corresponding policy file. For details, visit [http://www.oracle.com/technetwork/java/javase/downloads/jce8-download-2133166.html](http://www.oracle.com/technetwork/java/javase/downloads/jce8-download-2133166.html). You can configure a non-high-strength algorithm in the configuration file.
> * The microservice consumers can specify certificates for different providers. (The current certificate is issued by HOST. Different providers use a certificate storage medium, which is used by the service center and configuration center).

## Certificate Configuration in the Service Center

Currently, the TLS authentication mode of the service center can be configured using environment variables. By default, TLS communication and bidirectional authentication are enables. During peer end authentication, whether the peer end matches the CommonName field of the certificate is checked. For details about the certificate configuration items in the service center, see table 2.

**Table 2 Configuration file of the service center**

| Configuration Item       | Default Value | Value Range                | Mandatory | Description                              | Remarks |
| :----------------------- | :------------ | :------------------------- | :-------- | :--------------------------------------- | :------ |
| CSE\_SSL\_MODE           | 1             | 1/0<br/>0:HTTPS<br/>1:HTTP | No        | Set the protocol mode.                   | -       |
| CSE\_SSL\_VERIFY\_CLIENT | 1             | 1/0<br/>0:HTTPS<br/>1:HTTP | No        | Set whether the peer end is authenticated in HTTPS mode | -       |
| CSE\_SSL\_PASSPHASE      | -             | -                          | No        | Set the password for the certificate key in HTTPS mode | -       |

The configuration file of the service center is$APP\_ROOT/conf/app.conf. For details about the configuration item, see table 3. This configuration does not support the settings of environment variables.

Table 3 Configuration file of the service center

| Configuration Items | Default Value                            | Value Range | Mandatory | Description                              | Remarks                                  |
| :------------------ | :--------------------------------------- | :---------- | :-------- | :--------------------------------------- | :--------------------------------------- |
| ssl\_protocols      | TLSv1.2                                  | -           | No        | Specifies the SSL version used for communication. | -                                        |
| ssl\_ciphers        | TLS\_ECDHE\_RSA\_WITH\_AES\_256\_GCM\_SHA384,<br/>TLS\_RSA\_WITH\_AES\_256\_GCM\_SHA384,<br/>TLS\_ECDHE\_RSA\_WITH\_AES\_128\_GCM\_SHA256,<br/>TLS\_RSA\_WITH\_AES\_128\_GCM\_SHA256,<br/>TLS\_RSA\_WITH\_AES\_128\_CBC\_SHA | -           | No        | Specifies the algorithms list used to configuration | ssl_cipher must be configured with the TLS\_ECDHE\_RSA\_WITH\_AES\_128\_GCM\_SHA256 algorithm, because th eservice center supports the HTTP/2 protocal. TLS\_RSA\_WITH\_AES\_128\_GCM\_SHA256、TLS\_RSA\_WITH\_AES\_128\_CBC\_SHA are listd in the insecure algorithm blacklist of the HTTP/2 protocol, but they need to be configured to the last bit of ssl_ciphers to ensure compatibility of the client algorithm. |

## Path for Storing Key Materials and Certificates

**Table 4 Path for storing key materials and certificate**

| Configuration Items                      | Description                              | Environment Variable | Remarks |
| :--------------------------------------- | :--------------------------------------- | :------------------- | :------ |
| /                                        | -                                        | -                    | -       |
| /opt                                     | -                                        | -                    | -       |
| /opt/CSE                                 | -                                        | INSTALL\_ROOT        | -       |
| /opt/CSE/etc                             | -                                        | -                    | -       |
| /opt/CSE/etc/cipher                      | Specifies the directory for storing key materials | CIPHER\_ROOT         | -       |
| /opt/CSE/etc/ssl                         | Specifies the directory for storing certificates. | SSL\_ROOT            | -       |
| /opt/CSE/etc/ssl/trust.cer               | Specifies the trusted CA.                | -                    | -       |
| /opt/CSE/etc/ssl/server\_key.pem         | Specifies the private key file on the encrypted server. | -                    | -       |
| /opt/CSE/etc/ssl/server.cer              | Specifies the server certificate.        | -                    | -       |
| /opt/CSE/etc/ssl/cert\_pwd               | Specifies the symmetric ciphertext file used  to store the decrypted private key. | -                    | -       |
| /opt/CSE/apps                            | -                                        | -                    | -       |
| /opt/CSE/apps/ServiceCenter              | -                                        | APP\_ROOT            | -       |
| /opt/CSE/apps/ServiceCenter/conf         | Specifies the configuration file directory of the service center. | -                    | -       |
| /opt/CSE/apps/ServiceCenter/conf/app.conf | Specifies the application configuration file. | -                    | -       |

## Sample Code

The configuration example of enabling the TLS communication in the microservicce.yaml file is as follows:
```yaml
cse:
  service:
    registry:
      address: https://127.0.0.1:30100
  rest:
    address: 0.0.0.0:8080?sslEnabled=true
  highway:
    address: 0.0.0.0:7070?sslEnabled=true

#########SSL options
ssl.protocols: TLSv1.2
ssl.authPeer: true
ssl.checkCN.host: true

#########certificates config
ssl.trustStore: trust.jks
ssl.trustStoreType: JKS
ssl.trustStoreValue: Changeme_123
ssl.keyStore: server.p12
ssl.keyStoreType: PKCS12
ssl.keyStoreValue: Changeme_123
ssl.crl: revoke.crl
ssl.sslCustomClass: org.apache.servicecomb.demo.DemoSSLCustom
```
