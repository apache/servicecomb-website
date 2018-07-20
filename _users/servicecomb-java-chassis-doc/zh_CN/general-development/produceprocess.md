# 返回值序列化扩展
## 概念阐述

当前REST通道返回值支持application/json和text/plain两种格式，支持开发人员扩展和重写，服务提供者通过produces声明可提供序列化能力，服务消费者通过请求的Accept头指明返回值序列化方式，默认返回application/json格式的数据。

## 开发说明

* ### 扩展

  开发人员可以根据业务需要，通过编程的方式来扩展返回值序列化方式。实施步骤如下，以扩展支持application/xml格式为例：

  1.实现接口`ProduceProcessor`

  > getName\(\)返回当前扩展的数据类型名
  >
  > getOrder\(\)返回当前数据类型优先级，有多个同名实现类时生效，只加载优先级最高的，数字越小优先级越高
  >
  > doEncodeResponse\(OutputStream output, Object result\)把result对象编码成output，此处逻辑需要自行实现
  >
  > doDecodeResponse\(InputStream input, JavaType type\)把input解析成相应对象，此处逻辑需要自行实现

  ```java
  public class ProduceAppXmlProcessor implements ProduceProcessor {

    @Override
    public String getName() {
      return MediaType.APPLICATION_XML;
    }

    @Override
    public int getOrder() {
      return 0;
    }

    @Override
    public void doEncodeResponse(OutputStream output, Object result) throws Exception {
      output.write(JAXBUtils.convertToXml(result).getBytes());
    }

    @Override
    public Object doDecodeResponse(InputStream input, JavaType type) throws Exception {
      return JAXBUtils.convertToJavaBean(input, type);
    }
  }
  ```

  2.添加配置文件

  在resources下META-INF/services/文件夹新建文件xxx.ProduceProcessor（xxx为接口的包名），内容填写xxx.ProduceAppXmlProcessor（xxx为实现类的包名）。

* ### 重写

  开发人员可以对现有的application/json和text/plain两种格式实现逻辑进行重写，也可以对自行扩展的格式进行重写，以重写xml序列化方式为例：

  1.创建一个同名类`ProduceAppXmlProcessor`，实现接口`ProduceProcessor`

  2.重写`doEncodeResponse`和`doDecodeResponse`方法里的编解码逻辑

  3.更改getOrder方法里的返回值，要比原方法的返回值小，例如返回-1，application/json和text/plain的原方法返回值默认都为0

  4.在resources下META-INF/services/文件夹新建文件xxx.ProduceProcessor（xxx为接口的包名），内容填写xxx.ProduceAppXmlProcessor（xxx为实现类的包名）。

* ### 验证

  服务提供者通过produces声明可提供xml序列化能力

  ```java
    @RequestMapping(path = "/appXml", method = RequestMethod.POST, produces = MediaType.APPLICATION_XML_VALUE)
    public JAXBPerson appXml(@RequestBody JAXBPerson person) {
      return person;
    }
  ```

  服务消费者通过请求的Accept头指明返回值xml序列化方式

  ```java
    private void testCodeFirstAppXml(RestTemplate template, String cseUrlPrefix) {
      JAXBPerson person = new JAXBPerson("jake", 22, "it", "60kg");
      person.setJob(new JAXBJob("developer", "coding"));
      HttpHeaders headers = new HttpHeaders();
      headers.add("Accept", MediaType.APPLICATION_XML_VALUE);
      HttpEntity<JAXBPerson> requestEntity = new HttpEntity<>(person, headers);
      ResponseEntity<JAXBPerson> resEntity = template.exchange(cseUrlPrefix + "appXml",
          HttpMethod.POST,
          requestEntity,
          JAXBPerson.class);
      TestMgr.check(person, resEntity.getBody());
    }
  ```
