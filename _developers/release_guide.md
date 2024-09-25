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
3. Should have [Sign Key](https://www.apache.org/dev/openpgp.html#generate-key) for [signing the release](https://www.apache.org/dev/release-signing), the keys should be published to public key server.
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
git clone https://github.com/apache/servicecomb-service-center.git
cd servicecomb-service-center
gvt restore
```

2. Create a Tag from the master branch based on the version number which needs to be released.

3. Run RAT tool to ensure no license issues are there, follow the guide over [here](https://github.com/apache/servicecomb-service-center/tree/master/docs/release)

4. Run the make_release.sh to make the release for windows and linux following the guide over [here](https://github.com/apache/servicecomb-service-center/tree/master/scripts/release).

5. Last Step will make the releases in root folder.

6. Run the releases of frontend and service-center in both linux and windows.

7. Run the [integration test](https://github.com/apache/servicecomb-service-center/tree/master/integration) on the release.

8. If all the test passes then send the release candidate to peers to test in different machines.

9. Push the tag to master.

***Sign the Release***

1. Once the tag is pushed then using the tag download the source code from git [tag](https://github.com/apache/servicecomb-service-center/tags).

2. Sign the 4 releases(linux, windows, darwin, src) and checksum.

3. Create a new directory [Apache dev Release SVN](https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-service-center/) with release package name and release candidate number. (for example : if you want to release 1.0.0-m2 and this is the second attempt of the release then the folder structure will be `1.0.0-m2/rc02`)

4. Upload the release to the directory created in last step.

5. Download all the releases from SVN and verify the signature and checksum.

***PMC Approval***

1. Send the voting mail in ***dev@servicecomb.apache.org*** for 1PMC approval.

2. Wait for 72 hours or unless you get 3 +1 binding vote with no -1 vote. If you get even one -1 binding vote then fix the issue and start again from ***Step 1***.

3. Publish the result of the vote in dev@servicecomb.apache.org.

***Announcements***

1. Upload the releases to [Apache release repository](https://dist.apache.org/repos/dist/release/servicecomb/servicecomb-service-center/).

2. Wait for 24 hours to replicate the release in all the mirrors.

3. Delete old releases from [dev](https://dist.apache.org/repos/dist/dev) and [release] (https://dist.apache.org/repos/dist/release) and check for the old release in archive, update the same links in the website for old releases.

4. Upload the release page of ServiceComb Website.

5. Send the announcement mails to dev@servicecomb.apache.org, announce@apache.org


## Major Steps for doing Java-Chassis Release

Before release, make sure all apache issues are closed. Log in
 [apache issue website](https://issues.apache.org/jira/projects/SCB), click `release` and generate release notes. 

***Prepare the release code***

clone java-chassis code to your development environment, change version to release version and push to github.
Assume code version is `2.0.0-SNAPSHOT` and release version is `2.0.0`. 

Run:

```shell script
mvn versions:set -DgenerateBackupPoms=false -DnewVersion=2.0.0
```

Then:

```shell script
mvn clean install -Pit
```

If the build is successful, submit a PR and merge code after review.

***Release maven artifacts***

Prepare Linux environment, and make sure can upload artifacts to maven central.

1. Copy GPG keys to `~/.gnupg`

        ```
        gpg.conf
        pubring.gpg
        random_seed
        secring.gpg
        trustdb.gpg
        ```

2. Update PGR password in `~/.m2/settings.xml`

3. Update apache maven server user name and password in `~/.m2/settings.xml`

4. clone java-chassis

        ```
        git clone https://github.com/apache/servicecomb-java-chassis.git
        ```
   
5. Run

        ```
        mvn clean deploy -DskipTests -Prelease -Pdistribution -Ppassphrase
        ```

6. If failed in step 5, `drop` the temporary repository in apache Nexus and start from step 5 again.

7. If step 5 is successful, all artifacts are uploaded to a temporary repository. Using your apache account and 
   log in to  [Apache Nexus](https://repository.apache.org/). Click  `Staging Repositories`, search `servicecomb`,
   find the latest repository, click "close", and get the staging repository link like `https://repository.apache.org/content/repositories/orgapacheservicecomb-1385`

8. In servicecomb-java-chassis  release page，click release， do a `pre release`

***Sign the distributions***

1. Download binary distributions from the temporary repository. e.g.

        ```  
        https://repository.apache.org/content/repositories/orgapacheservicecomb-1385/org/apache/servicecomb/apache-servicecomb-java-chassis-distribution/1.2.0/apache-servicecomb-java-chassis-distribution-1.2.0-bin.zip  
        https://repository.apache.org/content/repositories/orgapacheservicecomb-1385/org/apache/servicecomb/apache-servicecomb-java-chassis-distribution/1.2.0/apache-servicecomb-java-chassis-distribution-1.2.0-bin.zip.asc
        ```

2. Download source distributions from the temporary repository. e.g.

        ```
        https://repository.apache.org/content/repositories/orgapacheservicecomb-1385/org/apache/servicecomb/apache-servicecomb-java-chassis-distribution/1.2.0/apache-servicecomb-java-chassis-distribution-1.2.0-src.zip  
        https://repository.apache.org/content/repositories/orgapacheservicecomb-1385/org/apache/servicecomb/apache-servicecomb-java-chassis-distribution/1.2.0/apache-servicecomb-java-chassis-distribution-1.2.0-src.zip.asc
        ```

3. generate checksum. e.g.

        ```
        sha512sum -b apache-servicecomb-java-chassis-distribution-1.2.0-bin.zip > apache-servicecomb-java-chassis-distribution-1.2.0-bin.zi.sha512  
        sha512sum -b apache-servicecomb-java-chassis-distribution-1.2.0-src.zip > apache-servicecomb-java-chassis-distribution-1.2.0-src.zip.sha512  
        ```

4. upload all file to [Apache development svn](https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-java-chassis/).  Run

        ```
        svn co https://dist.apache.org/repos/dist/dev/servicecomb/servicecomb-java-chassis
        cd serviecomb-java-chassis
        mkdir -p 1.2.0/rc01
        cp xxx/* 1.2.0/rc01
        svn add 1.2.0
        svn ci 1.2.0
        ```

5. download the files and verify the sign.

***Sending mail for permission***

1. Send mail to `dev@servicecomb.apache.org` and waiting for voting result.

2. Waiting 72 hours and if got three + 1 and no -1, the voting is successful. If there are some problems,
    start a new round of release. (According to the problem, please notice to clean up release notes,
    temporary svn files, and temporary stating repositories. )

3. Send the voting result to `dev@servicecomb.apache.org`


***Update documents and announcements***

1. In servicecomb-java-chassis  github release page，set `pre release` to `formal release` and write release notes.

2. Move [dev](https://dist.apache.org/repos/dist/dev) to [release](https://dist.apache.org/repos/dist/release)
 
        ```
        cp dev/servicecomb/servicecomb-java-chassis/2.0.0/* release/servicecomb/servicecomb-java-chassis/2.0.0/
        cd release/servicecomb/servicecomb-java-chassis/
        svn add 2.0.0
        svn ci 2.0.0
        ```
        
    And delete [dev](https://dist.apache.org/repos/dist/dev)
    
        ```
        svn rm 1.2.0
        svn ci .
        ```

3. Log in to [Apache Nexus](https://repository.apache.org/), find `Staging Repositories` and search 
    `servicecomb`，find the last `closed` repository, and click `release`. If there are any temporary `Staging Repositories`,
    `drop` them. 

4. Waiting for 24 hour for all mirror in sync.

5. Update the servicecomb-website, see [1.3.0 RP](https://github.com/apache/servicecomb-website/pull/210)
or [2.0.0 RP](https://github.com/apache/servicecomb-website/pull/240)

6. Send announcements to `dev@servicecomb.apache.org`， `announce@apache.org`。
