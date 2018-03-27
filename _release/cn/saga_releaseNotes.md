---
title: "Release Notes"
lang: cn
ref: release
permalink: /cn/release/saga-release-notes/
excerpt: "Release Notes"
last_modified_at: 2018-03-28T00:50:43-55:00
---

        Release Notes - Apache ServiceComb - Version saga-0.1.0
    
<h2>        Sub-task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-237'>SCB-237</a>] -         [pack] acceptance tests of success scenarios
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-278'>SCB-278</a>] -         [pack] acceptance test of transaction failure and successful compensation scenario
</li>
</ul>
        
<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-130'>SCB-130</a>] -         Update the Git PR template
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-323'>SCB-323</a>] -         inconsistent port in saga demo
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-404'>SCB-404</a>] -         The base folder name is the same for source and binary release
</li>
</ul>
            
<h2>        New Feature
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-95'>SCB-95</a>] -         [pack] able to link sub-transactions as a single global transaction
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-96'>SCB-96</a>] -         [pack] intercept sub-transaction commits
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-97'>SCB-97</a>] -         [pack] update alpha about transaction state
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-98'>SCB-98</a>] -         [pack] send compensate context from alpha to omegas
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-99'>SCB-99</a>] -         [pack] compensate on transaction failure
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-100'>SCB-100</a>] -         [pack] async transaction support
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-101'>SCB-101</a>] -         [pack] design doc
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-138'>SCB-138</a>] -         [pack] omega&#39;s callback about transaction state
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-151'>SCB-151</a>] -         [pack] pack usage demo
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-152'>SCB-152</a>] -         [pack] update alpha on compensation completed
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-212'>SCB-212</a>] -         [pack] sub-transaction timeout support
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-227'>SCB-227</a>] -         [pack] stop sub transaction from running when global tx failed
</li>
</ul>
    
<h2>        Improvement
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-140'>SCB-140</a>] -         [pack] do not compensate duplicate transaction events
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-141'>SCB-141</a>] -         [pack] support multiple sub transaction in a single service
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-149'>SCB-149</a>] -         [pack] service/instance aware omega callback
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-164'>SCB-164</a>] -         [pack] alpha connection recovery on crash
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-167'>SCB-167</a>] -         [pack] inform alpha about omega id on connection
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-168'>SCB-168</a>] -         [pack] resend events on connection loss &amp; load balance
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-169'>SCB-169</a>] -         [pack] omega get notified whether events are sent successfully or not
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-173'>SCB-173</a>] -         [pack] mark start of saga
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-174'>SCB-174</a>] -         [pack] object serialization/deserialization
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-183'>SCB-183</a>] -         [pack] omega callback cleanup on connection loss
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-211'>SCB-211</a>] -         [pack] exponential backoff resending event on cluster down or network down
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-213'>SCB-213</a>] -         [pack] proper timing to send out SagaEndedEvent on asynchronous compensation
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-218'>SCB-218</a>] -         [pack] stateless alpha
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-220'>SCB-220</a>] -         [pack] duplicate abort event filter to avoid redundant compensation
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-228'>SCB-228</a>] -         Update to replace the type of TxEvent with Enum
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-232'>SCB-232</a>] -         EventType should be same between omega and alpha
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-233'>SCB-233</a>] -         Don&#39;t deploy if building with the PR
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-234'>SCB-234</a>] -         [pack] fail fast if alpha cluster down
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-238'>SCB-238</a>] -         Remove third-party dependencies which violates apache licensing policy
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-239'>SCB-239</a>] -         [pack] omega recovery
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-243'>SCB-243</a>] -         [pack] support to intercept java chassis
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-270'>SCB-270</a>] -         [pack] in order compensation
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-305'>SCB-305</a>] -         [pack] postIntercept should throw the exception when the timeout happens
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-330'>SCB-330</a>] -         [pack] update documents of saga pack
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-395'>SCB-395</a>] -         Add How to build into README file
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-400'>SCB-400</a>] -         Add guides to run demo without docker compose 
</li>
</ul>
            
<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-104'>SCB-104</a>] -         simplify transport rest template implementation
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-122'>SCB-122</a>] -         Add incubating note to website
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-123'>SCB-123</a>] -         Add DISLAIMER to the ServiceComb git repo
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-154'>SCB-154</a>] -         Update the package  org.apache.servicecomb
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-157'>SCB-157</a>] -         Update the release setting of pom
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-193'>SCB-193</a>] -         Generated the Licenses,Notice and DISCLAIMER files when building the artifact
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-231'>SCB-231</a>] -         Only publish the snapshot in master branch
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-249'>SCB-249</a>] -         [pack] replace hibernate with other ORM tech to avoid license issue
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-260'>SCB-260</a>] -         Prepare LICENSE/NOTICE files for releasing
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-344'>SCB-344</a>] -         [pack] use mysql as alpha&#39;s backend database
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-346'>SCB-346</a>] -         Create the distribution kit for Saga
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-363'>SCB-363</a>] -         Remove legacy code from Saga
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-378'>SCB-378</a>] -         Add readme for samples so that users can run the samples code by just reading the readme doc
</li>
<li>[<a href='https://issues.apache.org/jira/browse/SCB-380'>SCB-380</a>] -         Add incubating to file name the release kit
</li>
</ul>
