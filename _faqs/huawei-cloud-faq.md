---
title: "Huawei Cloud FAQ"
lang: en
ref: huawei-cloud-faq
permalink: /faqs/faqs-huawei-cloud/
excerpt: "Huawei Cloud FAQ"
last_modified_at: 2017-10-29T10:01:43-04:00
redirect_from:
  - /theme-setup/
---

1. **Q: When we push images to Huawei Public Cloud, what needs to be careful about the image tag?**

   A:  It needs to be different with all uploaded images. As Docker does not pull image from remote every time it starts up a container. Hence, the Docker does not know whether the image updated or not. There are two solutions for this:

   (1) Use different image tag every time you upload a image.

   (2) Delete the image in the backend manually.

   P.S. If you use the Huawei Cloud's orchestration, you can avoid this by setting *imagePullPolicy* to *Always*.

2. **Q: We encountered this error when using Huawei Public Cloud: *WARN com.huaewi.paas.monitor.DataFactory: Upload monitor data error.* The configuration we use is as follows:**

   ```yaml
   servicecomb:
     monitor:
       handler:
         chain:
           Provider:
             default: bizkeeper-provider
   ```

   A: There are mistakes in your configuration files. `handler` should be the child of `servicecomb` instead of `monitor`. The right configuration should be as follows:

   ```yaml
   servicecomb:
     handler:
       chain:
         Provider:
           default: bizkeeper-provider
   ```
