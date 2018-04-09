---
title: "Release guide for ServiceComb"
lang: en
ref: release_guide
permalink: /cn/developers/release-guide/
excerpt: "Release guide for doing the releases in Apache"
last_modified_at: 2018-04-03T18:33:43+08:00
author: Asif Siddiqui
tags: [release]
redirect_from:
  - /theme-setup/
---


This Guide helps you to do the release in Apache for ServiceComb projects.

## Pre-Requisite

1. The CI for the project should be green.
2. Should have the version number for the project.
3. Should have Sign Key for signing the release, the keys should be published to public key server.

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

10. Once the tag is pushed then using the tag download the source code from git [tag](https://github.com/apache/incubator-servicecomb-service-center/tags).

11. Sign the 3 releases(linux, windows, src) and checksum.

12. Upload the release to dev/incubator/servicecomb Apache Svn.

13. Download all the releases from SVN and verify the signature and checksum.

***PPMC Approval***

14. Send the voting mail in ***dev@servicecomb.apache.org*** for PPMC approval.

15. Wait for 72 hours or unless you get 3 +1 binding vote with no -1 vote. If you get even one -1 binding vote then fix the issue and start again from ***Step 1***.

16. Publish the result of the vote in dev@servicecomb.apache.org.

***IPMC approval***

17. Send the voting mail in ***general@incubator.apache.org*** for IPMC approval.

18. Wait for 72 hours or unless you get 3 +1 binding vote with no -1 vote.If you get even one -1 binding vote then fix the issue and start again from ***Step 1***

19. Publish the result of the vote in general@incubator.apache.org.

***Announcements***

20. Upload the releases to release/incubator/servicecomb Apache Svn.

21. Wait for 24 hours to replicate the release in all the mirrors.

22. Upload the release page of ServiceComb Website.

23. Send the announcement mails to dev@servicecomb.apache.org, general@incubator.apache.org, announce@apache.org




## Major Steps for doing Java-Chassis Release

***Make and Verify the Release***

1. Clone the java-chassis code.
```
git clone git@github.com:apache/incubator-servicecomb-java-chassis.git
```

2. Cut the release using per command to replace all the versions in pom.xml files

3. Create a Tag from the master branch using the version number.

4. Clear all the redundant servicecomb releases in repository.apache.org

5. Add the keys in a reference folder.

6. Update the key path and passphrase in .travis.settings file.

7. Update the apache account username and password in the travis file.

8. Run the maven deploy command.
```
mvn deploy -DskipTests -Prelease -Pdistribution -Ppassphrase --settings .travis.settings.xml
```

9. Once every thing is uploaded then use the staging repo to verify the build using Company workshop.

10. Share the staging repo with peers to verify on different OS and machines using the demo.

11. If everything is fine then push the tag to master.

12. Close the staging repo is apache repositories

***Sign the Releases***

13. Download the source code and distribution from the staging repo.

14. Sign the 2 releases(distribution, src) and checksum.

15. Upload the release to dev/incubator/servicecomb Apache Svn.

16. Download all the releases from SVN and verify the signature and checksum.

***PPMC approval***

17. Send the voting mail in dev@servicecomb.apache.org for PPMC approval.

18. Wait for 72 hours or unless you get 3 +1 binding vote with no -1 vote. If you get even one -1 binding vote then fix the issue and start again from Step 1.

19. Publish the result of the vote in dev@servicecomb.apache.org.

***IPMC approval***

20. Send the voting mail in general@incubator.apache.org

21. Wait for 72 hours or unless you get 3 +1 binding vote with no -1 vote. If you get even one -1 binding vote then fix the issue and start again from Step 1. 

22. Publish the result of the vote in general@incubator.apache.org.

***Announcements***

23. Upload the releases to release/incubator/servicecomb Apache Svn.

24. Wait for 24 hours to replicate the release in all the mirrors.

25. Upload the release page of ServiceComb Website.

26. Send the announcement mails to dev@servicecomb.apache.org, general@incubator.apache.org, announce@apache.org




## Major Steps for doing Saga Release

***Make and Verify the Release***
1. Clone the saga code.
```
git@github.com:apache/incubator-servicecomb-saga.git
```

2. Cut the release using per command to replace all the versions in pom.xml files

3. Create a Tag from the master branch using the version number.

4. Clear all the redundant servicecomb releases in repository.apache.org

5. Add the keys in a reference folder.

6. Update the key path and passphrase in .travis.settings file.

7. Update the apache account username and password in the travis file.

8. Run the maven deploy command.
```
mvn deploy -DskipTests --settings .travis.settings.xml -Ppassphrase -Prelease
```

9. Once every thing is uploaded then use the staging repo to verify the build using Company workshop.

10. Share the staging repo with peers to verify on different OS and machines using the demo.

11. If everything is fine then push the tag to master.

12. Close the staging repo is apache repositories.

***Sign the Releases***

13. Download the source code and distribution from the staging repo.

14. Sign the 2 releases(distribution, src) and checksum.

15. Upload the release to dev/incubator/servicecomb Apache Svn.

16. Download all the releases from SVN and verify the signature and checksum.

***PPMC approval***

17. Send the voting mail in dev@servicecomb.apache.org.

18. Wait for 72 hours or unless you get 3 +1 binding vote with no -1 vote. If you get even one -1 binding vote then fix the issue and start again from Step 1.

19. Publish the result of the vote in dev@servicecomb.apache.org.

***IPMC approval***

20. Send the voting mail in general@incubator.apache.org

21. Wait for 72 hours or unless you get 3 +1 binding vote with no -1 vote. If you get even one -1 binding vote then fix the issue and start again from Step 1.

22. Publish the result of the vote in general@incubator.apache.org.

***Announcements***

23. Upload the releases to release/incubator/servicecomb Apache Svn.

24. Wait for 24 hours to replicate the release in all the mirrors.

25. Upload the release page of ServiceComb Website.

26. Send the announcement mails to dev@servicecomb.apache.org, general@incubator.apache.org, announce@apache.org


**NOTE**
The whole process generally takes 2 weeks to complete assuming you don't get any -1 from PPMC and IMPC, so please plan the release activity before hand.
