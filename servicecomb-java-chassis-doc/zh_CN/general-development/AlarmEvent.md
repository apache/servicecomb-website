# 获取熔断与实例隔离告警事件

## 场景描述
* 在微服务运行期间熔断或实例隔离状态发生变化时，需要监听到相关事件，获取相关信息并进行处理

## 使用参考

* 监听熔断事件
```
Object receiveEvent = new Object() {
  @Subscribe
  public void onEvent(CircutBreakerEvent circutBreakerEvent) {
    //Get information from circutBreakerEvent
    }
  };
circutBreakerEventNotifier.eventBus.register(receiveEvent);
```
* 监听实例隔离事件
```
Object receiveEvent = new Object() {
  @Subscribe
  public void onEvent(IsolationServerEvent isolationServerEvent) {
    //Get information from isolationServerEvent
    }
  };
circutBreakerEventNotifier.eventBus.register(receiveEvent);
```
* 两个事件均监听
```
Object receiveEvent = new Object() {
  @Subscribe
  public void onEvent(AlarmEvent alarmEvent) {
    //Get information from alarmEvent
    }
  };
circutBreakerEventNotifier.eventBus.register(receiveEvent);
```
