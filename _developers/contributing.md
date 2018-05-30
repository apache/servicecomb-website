---
title: "Contributing to Apache ServiceComb"
lang: en
ref: ServiceComb-contributing
permalink: /developers/contributing
excerpt: "Contributing to Apache ServiceComb"
last_modified_at: 2018-05-20T19:18:43+08:00
---
{% include toc %}
## Contributing to Apache ServiceComb
There are many ways that you can help make ServiceComb a better piece of solution for the Microservice - please dive in and help!
* Try surf the documentations - if somethings confusing or not clear, let us know.
* Download the code & try it out and see what you think.
* Browse the source code. Ask question in the Gitter if you want to know more detail about the code.
* Want to do some hacking? take a look at our  [issue tracker](https://issues.apache.org/jira/browse/SCB) for open issues or features that need to implemented, take ownership of an issue and try fix it.
* If you are a new to ServiceComb and would like to help us,  you can also find [some easy to resolve issues](https://issues.apache.org/jira/browse/SCB-333?jql=project%20%3D%20SCB%20AND%20status%20%3D%20Open%20AND%20fixVersion%20in%20(EMPTY%2C%20java-chassis-1.0.0-m2)%20AND%20labels%20%3D%20newbie).
* Leave a comment on the issue to let us know you are working on it and add yourself as a watcher to get informed about all modifications.

## Getting in touch

There are various ways of communicating with the ServiceComb community.
- Join us on the [mailing list](http://servicecomb.incubator.apache.org/cn/developers/subscribe-mail-list) and take part in any conversations
- Pop by on [Gitter](https://gitter.im/ServiceCombUsers/Lobby) and say hi

## Improving the documentation

Documentation is massively important to help users make the most of Apache ServiceComb and its probably the area that needs the most help!
So if you are interested in helping the documentation effort; whether its just to fix a page here or there, correct a link or even write a tutorial or improve what documentation is already there please do dive in and help!
Most of the documentation is stored as the markdown text, you can edit this page in the website from the below edit it link if you logined in the github, then you can send a PR for it.  

## If you find a bug or problem

Please raise a new issue in our [issue tracker](https://issues.apache.org/jira/browse/SCB)
If you can create a JUnit test case then your issue is more likely to be resolved quicker.
e.g. take a look at some of the existing [unit tests cases](https://github.com/apache/incubator-servicecomb-saga/tree/master/alpha/alpha-core/src/test/java/org/apache/servicecomb/saga/alpha/core)
Then we can add your issue to git and then we'll know when its really fixed and we can ensure that the problem stays fixed in future releases.

## Working on the code

We recommend to work on the code from  [Github](https://github.com/apache?q=incubator-servicecomb), it has the following sub-projects:

| Project Name | Project Introduction | Programming Language |
|-------------------------------------------------------------------------------|----------------------------|----------|
| [Java Chassis](https://github.com/apache/incubator-servicecomb-java-chassis)      | Java Microservice Framework（SDK） | Java     |
| [Service Center](https://github.com/apache/incubator-servicecomb-service-center)               | Service registration and discovery | Go       |
| [Saga](https://github.com/apache/incubator-servicecomb-saga)                                   | Data Eventually Consistency Solution for Microservice | Java     |
| [Website](https://github.com/apache/incubator-servicecomb-website) | ServiceComb Website | Markdown |

If you intend to work on the code and provide patches and other work you want to submit to the Apache ServiceComb projects, then you can fork the project on github and work on your own fork. The custom work you do should be done on branches you create, which can then be committed and pushed upstream, and then submitted to Apache ServiceComb as PRs (pull requests). You can find many resources online how to work on github projects and how to submit work to these projects.

