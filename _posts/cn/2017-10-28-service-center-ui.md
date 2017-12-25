---
title: "Service-Center Management UI Console"
lang: cn
ref: service-center-ui
permalink: /docs/service-center-ui/
excerpt: "An introduction Service-Center Management Console"
last_modified_at: 2017-10-30T09:18:43+08:00
author: Asif Siddiqui
tags: [service center]
redirect_from:
  - /theme-setup/
---

Service-Center Management UI Console enables user to view the list of MicroServices registered in SC.
Users can view the detailed information of their MicroServices, Instances and Schemas.
Service-Center UI also offers a unique feature of testing the Schemas of their MicroServices from UI, Users 
can also download the html client for their Schemas.

### Preview of Management Console
![Preview]({{ site.url }}{{ site.baseurl }}/assets/images/Service-Center-UI-Preview.gif){: .align-center}

### Features
Service-Center Management console offers very useful features which makes users easy to use and manage service-center.

### Dashboard
This is the place where you can get the overall information about the services which are registered in your service-center like total number of services, providers, consumers and total instances. You can also get a list of Services which based on their current status.  
![Dashboard]({{ site.url }}{{ site.baseurl }}/assets/images/Dashboard.PNG){: .align-center}  



### Micro-Service List
This is the place where you can see the basic details of all the services which are registered in Service-Center. You can see the details like MicroService Name, Application Name, Status, Version, Creation time and Instance count. You can also un-register the microservice from Operations Tab if there is no running instances for the microservice.  
![ServiceList]({{ site.url }}{{ site.baseurl }}/assets/images/ServiceList.PNG){: .align-center}  


### Instance Details
This is the place where you can see all the current running instances for the MicroService, you can get the list of endpoints and their protocols.  
![InstanceList]({{ site.url }}{{ site.baseurl }}/assets/images/InstanceList.PNG){: .align-center}  


### Provider List
This is the place where you can get the list of all the providers for the MicroService.  
![Provider List]({{ site.url }}{{ site.baseurl }}/assets/images/ProviderList.PNG){: .align-center}  


### Consumer List
This is the place where you can get the list of all the consumers for the MicroService  
![Consumer List]({{ site.url }}{{ site.baseurl }}/assets/images/ConsumerList.PNG){: .align-center}  


### Schema List
This is the place where we can get the list of all the Schema\'s for your MicroService, here you get options of viewing the Schema in Swagger form or Test the Schema on some particular instance. Here you also get an option to Download the Schema file in Html Client form.  
![Schema List]({{ site.url }}{{ site.baseurl }}/assets/images/SchemaList.PNG){: .align-center}  

For Viewing the Schema in Swagger form you can click on Test Schema button and you can view the complete details of Schema in Swagger form.  

![View Swagger]({{ site.url }}{{ site.baseurl }}/assets/images/SchemaView.PNG){: .align-center}

If you wish to test the Schema on some particular Instance then you can click on Test Schema and select the instance on which you want to test the Schema and then select the endpoints for that instance.  
![Select Instance]({{ site.url }}{{ site.baseurl }}/assets/images/SelectInstance.PNG){: .align-center}


Once you selected the instance then you are ready for testing the Schema, you can input the required parameters for the Schema and hit on 'Try it Out' Button.  
![Schema Test]({{ site.url }}{{ site.baseurl }}/assets/images/Schematest.PNG){: .align-center}  


##### You can have a look at the [Quick Start Guide](https://github.com/apache/incubator-servicecomb-service-center/tree/master/frontend#quickstart-guide) to know about how to bring up the Management Console.
