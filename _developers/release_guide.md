---
title: "Release guide for ServiceComb"
lang: en
ref: release_guide
permalink: /developers/release-guide/
excerpt: "Release guide for doing the releases in Apache"
last_modified_at: 2018-04-03T18:33:43+08:00
author: Asif Siddiqui
tags: [release]
redirect_from:
  - /theme-setup/
---
{% include toc %}

This Guide helps you to do the release in Apache for ServiceComb projects.

## Pre-Requisite
To prepare or perform a released you MUST BE at least an Apache ServiceComb committer.

1. The CI for the project should be green.
2. Should have the version number for the project.
3. Should have Sign Key for signing the release, the keys should be published to public key server.
4. Get familiar with the release settings in the parent Apache POM

## Maven 2 Setup
As ServiceComb Java Chassis and Saga are using maven for the release, you should do some maven 2 setup before releasing these two projects.
Before you deploy anything to the maven repository using Maven 2, you should configure your ~/.m2/settings.xml file so that the file permissions of the deployed artifacts are group writable. If you do not do this, other developers will not able to overwrite your SNAPSHOT releases with newer versions. The settings follow the [guidelines](http://maven.apache.org/developers/committer-settings.html) used by the Maven project. Please pay particular attention to the [password encryption recommendations](http://maven.apache.org/guides/mini/guide-encryption.html).

```
<settings>
  ...
  <servers>
    <!-- Per http://maven.apache.org/developers/committer-settings.html -->

    <!-- To publish a snapshot of some part of Maven -->
    <server>
      <id>apache.snapshots.https</id>
      <username> <!-- YOUR APACHE LDAP USERNAME --> </username>
      <password> <!-- YOUR APACHE LDAP PASSWORD --> </password>
    </server>
    <!-- To publish a website of some part of Maven -->
    <server>
      <id>apache.website</id>
      <username> <!-- YOUR APACHE LDAP USERNAME --> </username>
      <filePermissions>664</filePermissions>
      <directoryPermissions>775</directoryPermissions>
    </server>
    <!-- To stage a release of some part of Maven -->
    <server>
      <id>apache.releases.https</id>
      <username> <!-- YOUR APACHE LDAP USERNAME --> </username>
      <password> <!-- YOUR APACHE LDAP PASSWORD --> </password>
    </server>
    <!-- To stage a website of some part of Maven -->
    <server>
      <id>stagingSite</id> <!-- must match hard-coded repository identifier in site:stage-deploy -->
      <username> <!-- YOUR APACHE LDAP USERNAME --> </username>
      <filePermissions>664</filePermissions>
      <directoryPermissions>775</directoryPermissions>
    </server>

  </servers>
  ...
  <profiles>
    <profile>
      <id>apache-release</id>
      <properties>
        <gpg.useagent>false</gpg.useagent>
        <gpg.passphrase><!-- YOUR GPG PASSPHRASE --></gpg.passphrase>
        <test>false</test>
      </properties>
    </profile>

  </profiles>
...
</settings>
```

## Major Steps for doing Service-Center Release

***Make and Verify the Release***

1. Clone the service-center code.
```
git@github.com:apache/incubator-servicecomb-service-center.git
cd incubator-servicecomb-service-center
gvt restore
```

2. Create a Tag from the master branch based on the version number which needs to be released.

3. Run RAT tool to ensure no license issues are there, follow the guide over [here](https://github.com/apache/incubator-servicecomb-service-center/tree/master/docs/release)

4. Run the make_release.sh to make the release for windows and linux following the guide over [here](https://github.com/apache/incubator-servicecomb-service-center/tree/master/scripts/release).

5. Last Step will make the releases in root folder.

6. Run the releases of frontend and service-center in both linux and windows.

7. Run the [integration test](https://github.com/apache/incubator-servicecomb-service-center/tree/master/integration) on the release.

8. If all the test passes then send the release candidate to peers to test in different machines.

9. Push the tag to master.

***Sign the Release***

1. Once the tag is pushed then using the tag download the source code from git [tag](https://github.com/apache/incubator-servicecomb-service-center/tags). 

2. Sign the 3 releases(linux, windows, src) and checksum.

3. Create a new directory [Apache dev Release SVN](https://dist.apache.org/repos/dist/dev/incubator/servicecomb/incubator-servicecomb-service-center/) with release package name and release candidate number. (for example : if you want to release 1.0.0-m2 and this is the second attempt of the release then the folder structure will be `1.0.0-m2/rc02`)

4. Upload the release to the directory created in last step.

5. Download all the releases from SVN and verify the signature and checksum.

***PPMC Approval***

1. Send the voting mail in ***dev@servicecomb.apache.org*** for PPMC approval.

2. Wait for 72 hours or unless you get 3 +1 binding vote with no -1 vote. If you get even one -1 binding vote then fix the issue and start again from ***Step 1***.

3. Publish the result of the vote in dev@servicecomb.apache.org.

***IPMC approval***

1. Send the voting mail in ***general@incubator.apache.org*** for IPMC approval.

2. Wait for 72 hours or unless you get 3 +1 binding vote with no -1 vote.If you get even one -1 binding vote then fix the issue and start again from ***Step 1***

3. Publish the result of the vote in general@incubator.apache.org.

***Announcements***

1. Upload the releases to [Apache release repository](https://dist.apache.org/repos/dist/release/incubator/servicecomb/incubator-servicecomb-service-center/).

2. Wait for 24 hours to replicate the release in all the mirrors.

3. Upload the release page of ServiceComb Website.

4. Send the announcement mails to dev@servicecomb.apache.org, general@incubator.apache.org, announce@apache.org




## Major Steps for doing Java-Chassis Release

***Make and Verify the Release***

1. Clone the java-chassis code.
```
git clone git@github.com:apache/incubator-servicecomb-java-chassis.git
```

2. Cut the release using perl command to replace all the versions in pom.xml files
```
find . -name 'pom.xml'|xargs perl -pi -e 's/1.0.0-m2-SNAPSHOT/1.0.0-m2/g'
```

3. Create a Tag from the master branch using the version number.

4. Clear all the redundant servicecomb releases in repository.apache.org

5. Add the keys in a reference folder.

6. Update the key path and passphrase in ~/.m2/settings.xml file.

7. Update the apache account username and password in the settings file.

8. Run the maven deploy command.
```
mvn deploy -DskipTests -Prelease -Pdistribution -Ppassphrase
```

9. Once every thing is uploaded then use the staging repo to verify the build using Company workshop.

10. Share the staging repo with peers to verify on different OS and machines using the demo.

11. If everything is fine then push the tag to master.

12. Close the staging repo is apache repositories

***Sign the Releases***

1. Download the source code and distribution from the staging repo.

2. Sign the 2 releases(distribution, src) and checksum.

3. Create a new directory [Apache dev Release SVN](https://dist.apache.org/repos/dist/dev/incubator/servicecomb/incubator-servicecomb-java-chassis/) with release package name and release candidate number. (for example : if you want to release 1.0.0-m2 and this is the first attempt of the release then the folder structure will be `1.0.0-m2/rc01`)

4. Upload the release to  directory created in last step.

5. Download all the releases from SVN and verify the signature and checksum.

***PPMC approval***

1. Send the voting mail in dev@servicecomb.apache.org for PPMC approval.

2. Wait for 72 hours or unless you get 3 +1 binding vote with no -1 vote. If you get even one -1 binding vote then fix the issue and start again from Step 1.

3. Publish the result of the vote in dev@servicecomb.apache.org.

***IPMC approval***

1. Send the voting mail in general@incubator.apache.org

2. Wait for 72 hours or unless you get 3 +1 binding vote with no -1 vote. If you get even one -1 binding vote then fix the issue and start again from Step 1.

3. Publish the result of the vote in general@incubator.apache.org.

***Announcements***

1. Upload the releases to [Apache release repository](https://dist.apache.org/repos/dist/release/incubator/servicecomb/incubator-servicecomb-java-chassis/).

2. Wait for 24 hours to replicate the release in all the mirrors.

3. Upload the release page of ServiceComb Website.

4. Send the announcement mails to dev@servicecomb.apache.org, general@incubator.apache.org, announce@apache.org




## Major Steps for doing Saga Release

***Make and Verify the Release***
1. Clone the saga code.
```
git@github.com:apache/incubator-servicecomb-saga.git
```

2. Cut the release using per command to replace all the versions in pom.xml files

3. Create a Tag from the master branch using the version number.
```
find . -name 'pom.xml'|xargs perl -pi -e 's/1.0.0-m2-SNAPSHOT/1.0.0-m2/g'
```

4. Clear all the redundant servicecomb releases in repository.apache.org

5. Add the keys in a reference folder.

6. Update the key path and passphrase in your ~/.m2/settings.xml file.

7. Update the apache account username and password in the settings.xml file.

8. Run the maven deploy command.
```
mvn deploy -DskipTests -Ppassphrase -Prelease
```

9. Once every thing is uploaded then use the staging repo to verify the build using the acceptance test.

10. Share the staging repo with peers to verify on different OS and machines using the demo.

11. If everything is fine then push the tag to master.

12. Close the staging repo is apache repositories.

***Sign the Releases***

1. Download the source code and distribution from the staging repo.

2. Sign the 2 releases(distribution, src) and checksum.

3. Create a new directory [Apache dev Release SVN](https://dist.apache.org/repos/dist/dev/incubator/servicecomb/incubator-servicecomb-saga/) with release package name and release candidate number. (for example : if you want to release 1.0.0-m2 and this is the third attempt of the release then the folder structure will be `1.0.0-m2/rc03`)

4. Upload the release to  directory created in last step.

5. Download all the releases from SVN and verify the signature and checksum.

***PPMC approval***

1. Send the voting mail in dev@servicecomb.apache.org.

2. Wait for 72 hours or unless you get 3 +1 binding vote with no -1 vote. If you get even one -1 binding vote then fix the issue and start again from Step 1.

3. Publish the result of the vote in dev@servicecomb.apache.org.

***IPMC approval***

1. Send the voting mail in general@incubator.apache.org

2. Wait for 72 hours or unless you get 3 +1 binding vote with no -1 vote. If you get even one -1 binding vote then fix the issue and start again from Step 1.

3. Publish the result of the vote in general@incubator.apache.org.

***Announcements***

1. Upload the releases to [Apache release repository](https://dist.apache.org/repos/dist/release/incubator/servicecomb/incubator-servicecomb-saga/).


2. Wait for 24 hours to replicate the release in all the mirrors.

3. Upload the release page of ServiceComb Website.

4. Send the announcement mails to dev@servicecomb.apache.org, general@incubator.apache.org, announce@apache.org


**NOTE**
 - The whole process generally takes 2 weeks to complete assuming you don't get any -1 from PPMC and IMPC, so please plan the release activity before hand.
 - Make sure to clear all the release candidates from the dev-svn after the publishing the releases.
 
