---
title: "Release guide for ServiceComb"
lang: en
ref: release_guide
permalink: /developers/release-guide/
excerpt: "Release guide for doing the releases in Apache"
last_modified_at: 2026-11-10T00:00:00+00:00
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

## Release approval and completion

A Git tag, GitHub release or successful vote alone does not complete an Apache release. Follow the [ASF release policy](https://www.apache.org/legal/release-policy.html) and [download page requirements](https://infra.apache.org/release-download-pages.html).

### PMC approval

- Before calling the vote, verify the exact signed source package, its checksum, build and tests, and licensing (including `LICENSE`, `NOTICE`, ASF source headers and bundled third-party material). Review RAT findings; a count alone is not a licensing decision. Publish the signing public key in the project's `KEYS` file and verify the candidate with it.
- Start a `[VOTE]` on `dev@servicecomb.apache.org` identifying the candidate URL and SVN revision, Git tag/commit, checksums, `KEYS` and any staging repository.
- Release votes SHOULD remain open for at least 72 hours. Do not close early merely because three positive votes have arrived. A shorter vote call MUST explain the exceptional reason for expediting it, and policy deviations MUST be reported to the Board, normally in the next scheduled report.
- Approval requires at least three binding +1 votes from PMC members and more binding positive than negative votes. Release votes cannot be vetoed; investigate negative votes and resolve policy violations before publication.
- Post a `[RESULT]` to `dev@servicecomb.apache.org` with the actual opening and closing times, binding tally, vote thread and exact approved candidate. Do not rebuild, replace or silently change the voted packages after approval.

### Publication checklist

The release manager records the evidence for each item before calling the release complete:

- [ ] Promote the exact approved packages, signatures (`.asc`) and checksums (`.sha512`) from the selected RC under `dist/dev/servicecomb` to the component/version directory under `dist/release/servicecomb`. Record the SVN revision and artifact hashes. If the release manager cannot write to `dist/release`, ask an authorized PMC member to publish it.
- [ ] Wait for distribution synchronization, then download every published package, signature, checksum and the project `KEYS` from `https://downloads.apache.org/servicecomb/`. Verify signatures with the published key, verify checksums, and compare the packages with the approved RC. An SVN commit or elapsed waiting period alone is not proof of availability. Keep the existing 24-hour project waiting period before announcing; ASF guidance requires at least one hour before updating the download page or announcing.
- [ ] Deploy the English and Chinese download pages and release notes. Follow `closer.lua` links through to the actual current-release files; link signatures, checksums and `KEYS` directly over HTTPS to `downloads.apache.org`. Check every changed link on the deployed pages, including exact filenames and version directories. Do not publish links to missing optional binaries. Before removing an old release, verify its files in `archive.apache.org/dist/servicecomb/` and update or remove affected links.
- [ ] Only after the ASF distribution and download pages are verified, publish any GitHub release metadata with links to the official project download page. Direct end users only to ASF-distributed releases, not GitHub-generated source archives, `dist/dev` candidates or staging repositories. Keep unfinished GitHub release notes as an unpublished draft.
- [ ] Send the announcement with the official project download-page link. Retain the vote/result links, SVN revision, verification results, deployed-page checks and announcement link in the release record. If a check fails, fix it before announcing or marking the release complete.

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

3. Run RAT and review its findings against the licensing checks above, including the distinction between ASF source and bundled third-party material. Follow the guide [here](https://github.com/apache/servicecomb-service-center/tree/master/docs/release).

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

Follow [PMC approval](#pmc-approval), including candidate verification, vote duration and the result email.

***Announcements***

Complete the [publication checklist](#publication-checklist) in order: publish the approved candidate to the [Apache release repository](https://dist.apache.org/repos/dist/release/servicecomb/servicecomb-service-center/), verify ASF downloads, deploy and check the website, then publish GitHub release metadata and send announcements to `dev@servicecomb.apache.org` and `announce@apache.org`.


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

8. Prepare the release notes as an unpublished GitHub draft. Do not publish a GitHub pre-release or direct end users to the candidate.

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

***PMC Approval***

Follow [PMC approval](#pmc-approval), including candidate verification, vote duration and the result email.

***Update documents and announcements***

1. Promote only the selected approved RC's packages, signatures and checksums to the version directory in the [Apache release repository](https://dist.apache.org/repos/dist/release/servicecomb/servicecomb-java-chassis/). Do not copy all RC directories or rebuild from a Git tag.

2. Complete the distribution checks in the [publication checklist](#publication-checklist). Keep the staged candidate until the published files have been verified.

3. Log in to [Apache Nexus](https://repository.apache.org/) and release the exact closed staging repository identified in the vote. Do not select a repository merely because it is the latest one. Maven publication does not replace ASF source distribution.

4. Deploy and verify the English and Chinese website download pages and release notes. See [1.3.0 PR](https://github.com/apache/servicecomb-website/pull/210) or [2.0.0 PR](https://github.com/apache/servicecomb-website/pull/240) for the website structure; use verified URLs for the version being released. Verify archival and update affected links before cleaning up old releases.

5. After the ASF download checks and website deployment pass, publish the GitHub release notes with the official project download-page link.

6. Complete the announcement and evidence items in the publication checklist, sending announcements to `dev@servicecomb.apache.org` and `announce@apache.org` only after the checks pass.
