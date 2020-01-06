---
title: "ServiceComb Toolkit Release Notes"
lang: en
ref: release
permalink: /release/toolkit-release-notes/
excerpt: "ServiceComb Toolkit Release Notes"
last_modified_at: 2019-09-02T14:06:43-55:00
---


        Release Notes - Apache ServiceComb - Version toolkit-0.2.0
            
<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1485'>SCB-1485</a>] -         Fix bug that generated public class name is inconsistent with the filename
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1486'>SCB-1486</a>] -         Fix bug that generated public class name is inconsistent with the filename
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1633'>SCB-1633</a>] -         README of servicecomb-toolkit must be update
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1657'>SCB-1657</a>] -         fix test error on windows
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1660'>SCB-1660</a>] -         change deploy.sh format
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1676'>SCB-1676</a>] -         nested complex properties are not parsed and added to the component
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1679'>SCB-1679</a>] -         adjust main class package
</li>
</ul>
            
<h2>        New Feature
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1580'>SCB-1580</a>] -         Configurable oas style check rules
</li>
</ul>
    
<h2>        Improvement
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1639'>SCB-1639</a>] -         the configuration about deploying jars  to snapshot repository
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1651'>SCB-1651</a>] -         toolkit style check wrong exit code when not passed.
</li>
</ul>
            
<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1487'>SCB-1487</a>] -         add support for general jax-rs
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1493'>SCB-1493</a>] -         Support generating SpringCloud project
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1553'>SCB-1553</a>] -         Integrate oas-validator compliance check to cli
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1555'>SCB-1555</a>] -         Integrate oas-validator compability check to cli
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1569'>SCB-1569</a>] -         Merge branch import-oas-validator to master
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1570'>SCB-1570</a>] -         Translate javadocs of oas-validator
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1573'>SCB-1573</a>] -         Cleanup third party dep version
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1579'>SCB-1579</a>] -         Translate oas-validator readme
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1591'>SCB-1591</a>] -         Sonarcloud.io Integration
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1612'>SCB-1612</a>] -         Rename oas-validator-compliance to oas-validator-style
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1619'>SCB-1619</a>] -         translate  comments of oas-generator
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1620'>SCB-1620</a>] -         optimize the configuration of the oas-generator
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1621'>SCB-1621</a>] -         use case with Apache ServiceComb Syncer
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1640'>SCB-1640</a>] -         add binary packaging configuration
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1645'>SCB-1645</a>] -         update license
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1659'>SCB-1659</a>] -         Upgrade maven-assembly-plugin to 3.2.0
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1663'>SCB-1663</a>] -         add scripts
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1667'>SCB-1667</a>] -         add addition properties that can be referenced by the mustache templates
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1673'>SCB-1673</a>] -         Parse the remaining information of RequestMapping
</li>
</ul>
                                                                                                                                          


        Release Notes - Apache ServiceComb - Version toolkit-0.1.0

<h2> New and Noteworthy </h2>
  <ul>
    <li> Extract the microservice project, OpenAPI contract file and document from the code</li>
    <li> Generate the microservice project and document from contract</li>
    <li> Contract verify </li>
  </ul>

<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1358'>SCB-1358</a>] -         the issue of invalid naming of generated contract files
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1359'>SCB-1359</a>] -         the issue of generating document failure
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1360'>SCB-1360</a>] -         the issue of verifying contract file is not correct
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1361'>SCB-1361</a>] -         optimize toolkit user experience 
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1412'>SCB-1412</a>] -         some redudent folder generated after running test
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1456'>SCB-1456</a>] -         Fix the plugin bug that throws some exception when specifying configuration property contractLocation as a file
</li>
</ul>
                
<h2>        Improvement
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1383'>SCB-1383</a>] -         support toolkit maven plugin commands that generating code
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1384'>SCB-1384</a>] -         refact the code to optimize user experience
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1428'>SCB-1428</a>] -         Improve toolkit-maven-plugin test to make it running is not dependent by maven plugin
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1444'>SCB-1444</a>] -         support to generate mutiple modules in the same project
</li>
</ul>
            
<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1315'>SCB-1315</a>] -         IP clearance for ServiceComb Toolkit
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1329'>SCB-1329</a>] -         Cleanup unclear license dependencies
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1334'>SCB-1334</a>] -         Enable the Travis CI of the servicecomb-toolkit
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1351'>SCB-1351</a>] -         Some issues about using toolkit plugin
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1363'>SCB-1363</a>] -         update licenses and notice
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1400'>SCB-1400</a>] -         Complement and improve unit test
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1422'>SCB-1422</a>] -         optimize classmaker
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1426'>SCB-1426</a>] -         Support for configuring the toolkit maven plugin in the parent pom
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1433'>SCB-1433</a>] -         Remove unit test for constant
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1436'>SCB-1436</a>] -         Model is not generated, but the related package is imported
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1447'>SCB-1447</a>] -         Add samples
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1452'>SCB-1452</a>] -         update README
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1454'>SCB-1454</a>] -         The modules tag is not generated in the pom file when using cli
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1455'>SCB-1455</a>] -         Adjust the directory where the document is generated
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1458'>SCB-1458</a>] -         add settings for distribution
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1459'>SCB-1459</a>] -         Add information about the release
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1460'>SCB-1460</a>] -         Skip the deployment of samples and it
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-1463'>SCB-1463</a>] -         Optimize samples readme
</li>
</ul>
                                                                                                                                        