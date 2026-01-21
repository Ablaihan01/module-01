# Project_template

Это шаблон для решения проектной работы. Структура этого файла повторяет структуру заданий. Заполняйте его по мере работы над решением.

# Задание 1. Анализ и планирование

<aside>

Чтобы составить документ с описанием текущей архитектуры приложения, можно часть информации взять из описания компании и условия задания. Это нормально.

</aside

### 1. Описание функциональности монолитного приложения

**Управление отоплением:**

- Пользователи могуть удаленно вкл/выкл отопление в домах; 
- Система поддреживает: удалённое включение и выключение отопления в доме;
	- отображение текущего состояния отопления (вкл/выкл);
	- отправку команд на устройство управления отоплением и фиксацию статуса выполнения (принято/выполнено/ошибка/таймаут).

**Мониторинг температуры:**

- Пользователи могут проверять температуру в своих домах удаленно
- Система поддреживает: приём измерений температуры с датчиков, установленных в домах;
	- хранение истории измерений и расчёт “текущей температуры” как последнего актуального значения;
	- отображение температуры в веб-интерфейсе с указанием времени измерения.

### 2. Анализ архитектуры монолитного приложения

Перечислите здесь основные особенности текущего приложения: 
Язык программирования: GO; 
База данных: PostgreSQL; 
Взаимодействие между компонентами: Синхронное, запросы обрабатываются последовательно;
Архитектура: Монолитная, все компоненты системы (обработка запросов, бизнес-логика, работа с данными) находятся в рамках одного приложения;
Развертывание: деплой единого артефакта, риск простоя затрагивает все функции.


### 3. Определение доменов и границы контекстов

Domain 1 : Управление устройствами
	Описание: реестр устройств, привязка устройства к дому/пользователю, хранение параметров подключения (endpoint, ключи, протокол), контроль доступности, управление протоколами и отправка команд до физического устройства.
		Контекст: Регистрация устройства и идентификация.
				Привязка/отвязка устройства к дому и владельцу.
				Хранение и обновление параметров подключения.
				Определение протокола.
				Отправка команд устройству, получение статусов доставки/выполнения.
				Мониторинг доступности.

Domain 2: Измеритель температуры
	Описание: приём телеметрии от устройств (измерения температуры), нормализация и валидация данных, хранение истории измерений, вычисление “текущих” значений.
		Контекст: Приём измерений (температура) по временным меткам.
				Валидация/фильтрация (дубликаты, выбросы, пропуски).
				Хранение истории и агрегации (среднее/мин/макс).
				Расчёт “текущего значения” (последнее актуальное).

Domain 3: Управление температурой
	Описание: правила и режимы (вкл/выкл, расписания, целевая температура, сценарии), формирование команд на отопление и управление состоянием “что мы хотели сделать” и “что получилось”.
		Контекст: Команды пользователя: включить/выключить/установить режим/цель.
				Правила и сценарии: расписания, формирование команд.
				Контроль статусов исполнения (принято/выполнено/ошибка/таймаут).
				Хранение состояния отопления.
		
### **4. Проблемы монолитного решения**

- Нет модели самообслуживания SaaS (регистрация, самостоятельное подключение устройств).
- Масштабирование ограничено, синхронными интеграциями с устройствами.
- Релизы и изменения требуют деплоя всего приложения, высокий риск регрессий и простой всех функций.
- Сложно добавлять новые типы устройств/датчиков без изменения кода целиком.

### 5. Визуализация контекста системы — диаграмма С4

```markdown
@startuml
title Warhhouse Context Diagram

!includeurl https://raw.githubusercontent.com/RicardoNiepel/C4-PlantUML/master/C4_Component.puml

Person(user, "User", "Удалённо управляет отоплением и просматривает температуру")
System(WarmhouseSystem, "Warmhouse System", "Система измеряет температуру в доме и дает возможность упралять ей")

System_Ext(device, "Датчик температуры + реле отопления", "IoT-устройство", "Измеряет температуру и принимает команды включения/выключения отопления.")

Rel(user, WarmhouseSystem, "Использует веб-интерфейс", "HTTPS (Web)")
Rel(WarmhouseSystem, device, "Отправляет команды управления отоплением", "Синхронный запрос (HTTP/протокол устройства)")
Rel(WarmhouseSystem, device, "Запрашивает текущую температуру (polling)", "Синхронный запрос (HTTP/протокол устройства)")
Rel(device, WarmhouseSystem, "Возвращает показания температуры/статусы", "Синхронный ответ")
@enduml
```

Замените `Текст ссылки` текстом, который хотите использовать для ссылки. Вместо `URL` вставьте адрес, на который должна вести ссылка. Например:

```markdown
//www.plantuml.com/plantuml/png/5Ckn2i8m40RWlKyH7y1cSN8IwgWYWZZAcHvDu98Bbp_euzkk7tod1ZBqB0CIXDsBB4RjZTsa1Vo3EoTQZF8mx589qcVk9Yu2jHszD_gEIqBidxLOs4h163JxHmfaizuILnO_7VPteOBdzU8pDR2jz9uqLotRgFzQocMtQIW8mtkUuYWhHr3o2coGO5VH89O8Y8KYvO808TWr2L2gL8r0IB02AbxWrCJ4kSHvXPatuf-_FYHAdOeDgbhxJC_yyyrbR0JNzkFdBxgToAHkkCfzF2fuoayPYvUvVfGbVdAd0rdf8Km9Z2D9jUyarxxaifAvfBYJuU_2IUPuCTUUBCHh7-yPd3nTu81BS4bXjdyEz507bMgWUDHeDpiM_enttiCL499fp-Ajo67li08AiZD9YViTfp5ESptLeo8O33c92YUZaYdT4oZ9p86HqeHA2Kv-uYMIGMf93LdWiMJStvA2z-0DwjcEqBasEtTn1ibVYximaUvi8um7a4mi7b8VNL4L9mbJ89fXZKDUeAT23XZmCRUJTOVG7neWEWLgmVhmzkkNKID-rNmI6z9d1Ze2owmy_j1TTpYcrjrBhTQHvNMtMzyhAorp_lgFIMP5sJb1Yv3YpF9cbySWaIIqDeIlIQB3RMC9vaqhmBsuLSntkzlfjh0w1DIUJHGaJcIYWr3QLCxtZ4RxX7yB0nApbExKw_i7BdeGFwv25Q9XN3TLV-3-BxQRamy5AjU0umkZvq9ipoYUvvBpFcoym9soo9OYUp5nbz5guk6nO0LdEYZGraphdd-3u-OIbrHwSyrtbjKQ6UOQDE_O_INUXZ9rQBiFNm0NMSrgF5A3qUPb--YhLu1_AIIzVjZ-c21ZFSRlwQu1YvvrMwrcvsdrln47piqn-CGLJKXo77gzefndF5Psn-RL6857l0rtW-S4WJP8RiMT1ZxeVm00
```

# Задание 2. Проектирование микросервисной архитектуры

В этом задании вам нужно предоставить только диаграммы в модели C4. Мы не просим вас отдельно описывать получившиеся микросервисы и то, как вы определили взаимодействия между компонентами To-Be системы. Если вы правильно подготовите диаграммы C4, они и так это покажут.

**Диаграмма контейнеров (Containers)**
```markdown
@startuml
title Warmhouse Container Diagram

top to bottom direction

!includeurl https://raw.githubusercontent.com/RicardoNiepel/C4-PlantUML/master/C4_Container.puml

Person(user, "User", "Удалённо управляет отоплением и просматривает температуру")
System(WarmhouseSystem, "Warmhouse System", "Система измеряет температуру в доме и дает возможность упралять ей")

Container_Boundary(WarmhouseSystem, "Warmhouse System") {
  Container(WebApp, "Web Application", "GO", "Handles user interactions")
  Container(DeviceMgmt, "Управление устройством", "GO", "Доставлять команды на физическое устройство управления отоплением")
  Container(TempSensor, "Измеритель температуры", "GO", "Принимает и отдает показания по температуре")
  Container(HeatingControl, "Управление температуры", "GO", "Дает пользователю управлять отоплением дома")
  Container(Database, "Database", "PostgreSQL", "")
  Container(DeviceConnector, "Device Connector", "Точка общения с устройствами")
}

System_Ext(device, "Датчик температуры + реле отопления", "IoT-устройство", "Измеряет температуру, установка определенной темературы и принимает команды включения/выключения отопления.")

Rel(user, WebApp, "Uses the system")
Rel(WebApp,Database,"Reads/Writes user data")
Rel(WebApp,DeviceMgmt,"Доставлять команды на физическое устройство управления отоплением")
Rel(DeviceConnector,DeviceMgmt,"Доставлять команды на физическое устройство управления отоплением")
Rel(WebApp,TempSensor,"Отдает показания по температуре")
Rel(DeviceConnector,TempSensor,"Отдает показания по температуре")
Rel(WebApp,HeatingControl,"дает пользователю управлять отоплением дома")
Rel(DeviceConnector,HeatingControl,"дает пользователю управлять отоплением дома")
Rel(DeviceConnector, device, "Единая точка общения с датчиками")
@enduml
```
**Диаграмма компонентов (Components)**

```markdown 
@startuml
title Warmhouse Web Application - Component Diagram

top to bottom direction
!includeurl https://raw.githubusercontent.com/RicardoNiepel/C4-PlantUML/master/C4_Component.puml

Container_Boundary(WarmhouseSystem, "Warmhouse System") {

  Container(WebApp, "Web Application", "Go", "Handles user interactions")
  ContainerDb(Database, "Database", "PostgreSQL", "Stores data")

  Container(WebApp, "Web Application", "Go", "Handles user interactions") {
    Component(AuthController, "AuthController", "HTTP Controller", "Authentication and authorization")
    Component(UserController, "UserController", "HTTP Controller", "User profile operations")
    Component(ServiceLayer, "Service Layer", "Go", "Business logic")
    Component(RepositoryLayer, "Repository Layer", "Go", "Data access")
  }

  Rel(AuthController, ServiceLayer, "Calls")
  Rel(UserController, ServiceLayer, "Calls")
  Rel(ServiceLayer, RepositoryLayer, "Uses")
  Rel(RepositoryLayer, Database, "Reads/Writes", "SQL")
}
@enduml
```

```markdown 
@startuml
title Warmhouse Управление устройствами (Device Management) - Component Diagram (A)

top to bottom direction
!includeurl https://raw.githubusercontent.com/RicardoNiepel/C4-PlantUML/master/C4_Component.puml

Container_Boundary(warmhouse, "Warmhouse System") {
  Container(DeviceMgmt, "Управление устройствами", "Go", "Реестр устройств, привязка к дому, статусы, маршрутизация команд")
  Container_Ext(connector, "Device Connector", "Go", "Единая точка общения с устройствами")
}

Container_Boundary(DeviceMgmt, "Управление устройствами", "Go", "Реестр устройств, привязка к дому, статусы, маршрутизация команд") {
  Container(api, "API", "HTTP", "Эндпоинты для регистрации/привязки устройств, запроса состояния, отправки команд")
  Container(cmdHandler, "Обработчик команд", "Go", "Принимает команду, валидирует, создаёт correlationId, ставит в обработку и инициирует доставку")
  Container(stateMgr, "Менеджер состояния устройств", "Go", "Хранит и обновляет состояние устройств (online/offline, lastSeen, текущие статусы), статусы исполнения команд")
}

Rel(api, cmdHandler, "Передаёт команды/операции")
Rel(api, stateMgr, "Запрашивает состояние/реестр")
Rel(cmdHandler, stateMgr, "Обновляет статусы команд и устройства")
Rel(cmdHandler, connector, "Отправляет команду на доставку")
@enduml
```
```markdown 
@startuml
title Warmhouse TempSensor - Component Diagram

top to bottom direction
!includeurl https://raw.githubusercontent.com/RicardoNiepel/C4-PlantUML/master/C4_Component.puml

Container_Boundary(WarmhouseSystem, "Warmhouse System") {

  Container(TempSensor, "Измеритель температуры", "GO", "Принимает и отдает показания по температуре")
  ContainerDb(Database, "Database", "PostgreSQL", "Stores telemetry data")
  Container_Ext(DeviceConnector, "Device Connector", "GO", "Точка общения с устройствами")
  Container_Ext(WebApp, "Web Application", "GO", "UI/запросы температуры")

  Container(TempSensor, "Измеритель температуры", "GO", "Принимает и отдает показания по температуре") {
    Component(API, "API", "HTTP", "Приём измерений и выдача текущей/исторической температуры")
    Component(UserController, "обработчик телеметрии", "Go", "Обрабатывает входящие измерения (валидация/нормализация)")
    Component(ServiceLayer, "менеджер истории температур", "Go", "Хранение истории и расчёт текущей температуры")
    Component(RepositoryLayer, "Repository Layer", "Go", "Data access logic")
  }

  Rel(DeviceConnector, API, "Отдает показания по температуре", "HTTP")
  Rel(WebApp, API, "Запрашивает температуру/историю", "HTTP")

  Rel(API, UserController, "Передаёт входящие измерения")
  Rel(API, ServiceLayer, "Запрос текущей/исторической")
  Rel(UserController, ServiceLayer, "Передаёт нормализованные данные")
  Rel(ServiceLayer, RepositoryLayer, "Reads/Writes data")
  Rel(RepositoryLayer, Database, "Reads/Writes", "PostgreSQL")
}
@enduml
```
```markdown
@startuml
title Warmhouse HeatingControl - Component Diagram

top to bottom direction
!includeurl https://raw.githubusercontent.com/RicardoNiepel/C4-PlantUML/master/C4_Component.puml

Container_Boundary(WarmhouseSystem, "Warmhouse System") {

  Container(HeatingControl, "Управление температуры", "GO", "Дает пользователю управлять отоплением дома")
  Container_Ext(WebApp, "Web Application", "GO", "UI/команды пользователя")
  Container_Ext(DeviceMgmt, "Управление устройством", "GO", "Доставлять команды на физическое устройство")
  Container_Ext(TempSensor, "Измеритель температуры", "GO", "Текущая температура/история")

  Container(HeatingControl, "Управление температуры", "GO", "Дает пользователю управлять отоплением дома") {
    Component(API, "API", "HTTP", "Вкл/выкл, состояние, сценарии/режимы")
    Component(UserController, "обработчик команд отопления", "Go", "Обрабатывает команды пользователя и формирует действия")
    Component(ServiceLayer, "менеджер логики отопления", "Go", "Бизнес-логика: правила/режимы")
    Component(RepositoryLayer, "Repository Layer", "Go", "Data access logic")
  }

  Rel(WebApp, API, "дает пользователю управлять отоплением дома")

  Rel(API, UserController, "Передаёт команды")
  Rel(UserController, ServiceLayer, "Calls business logic")

  Rel(ServiceLayer, TempSensor, "Читает температуру (для логики)")
  Rel(ServiceLayer, DeviceMgmt, "Отправляет команду на устройство")

  Rel(ServiceLayer, RepositoryLayer, "Reads/Writes data")
}
@enduml
```

```markdown
@startuml
title Warmhouse DeviceConnector - Component Diagram

top to bottom direction
!includeurl https://raw.githubusercontent.com/RicardoNiepel/C4-PlantUML/master/C4_Component.puml

Container_Boundary(WarmhouseSystem, "Warmhouse System") {

  Container(DeviceConnector, "Device Connector", "GO", "Точка общения с устройствами")
  Container_Ext(DeviceMgmt, "Управление устройством", "GO", "Команды на устройства")
  Container_Ext(TempSensor, "Измеритель температуры", "GO", "Показания температуры")
  System_Ext(device, "Датчик температуры + реле отопления", "IoT-устройство", "Измеряет температуру и принимает команды")

  Container(DeviceConnector, "Device Connector", "GO", "Точка общения с устройствами") {
    Component(API, "API", "Принимает команды от DeviceMgmt и управляет устройствами")
    Component(UserController, "маршрутизатор протоколов", "Go", "Выбирает способ связи/адаптер по типу устройства")
    Component(ServiceLayer, "адаптеры устройств", "Go", "Драйверы/адаптеры протоколов")
    Component(RepositoryLayer, "обработчик телеметрии", "Go", "Принимает телеметрию и отправляет в TempSensor")
  }

  Rel(DeviceMgmt, API, "Доставлять команды на физическое устройство")
  Rel(API, UserController, "Передаёт команду")
  Rel(UserController, ServiceLayer, "Вызывает адаптер")
  Rel(ServiceLayer, device, "Управляет/читает")

  Rel(device, RepositoryLayer, "Отдает показания/статусы")
  Rel(RepositoryLayer, TempSensor, "Отдает показания по температуре")
}
@enduml
```

**Диаграмма кода (Code)**

```markdown
@startuml
title Warmhouse - Code Diagram (Simple Adapter Routing)

interface Adapter {
  +sendCommand(commandType: string, payload: string): string
}

class HttpAdapter
class MqttAdapter

class DeviceConnector {
  -adapters: Map<string, Adapter>
  +register(protocol: string, adapter: Adapter)
  +send(protocol: string, commandType: string, payload: string): string
}

Adapter <|.. HttpAdapter
Adapter <|.. MqttAdapter

DeviceConnector --> Adapter : uses
DeviceConnector o-- HttpAdapter : has
DeviceConnector o-- MqttAdapter : has
@enduml
```

# Задание 3. Разработка ER-диаграммы
```markdown 
@startuml
title Warmhouse  ER-Diagram

hide circle
skinparam linetype ortho

entity "User" as user {
  * id : uuid <<PK>>
  --
  email : varchar
  password_hash : varchar
  created_at : timestamp
}

entity "House" as house {
  * id : uuid <<PK>>
  --
  user_id : uuid <<FK>>
  name : varchar
  address : varchar
  created_at : timestamp
}

entity "DeviceType" as dev_type {
  * id : uuid <<PK>>
  --
  name : varchar          
  vendor : varchar
  model : varchar
  protocol : varchar     
  created_at : timestamp
}

entity "Device" as device {
  * id : uuid <<PK>>
  --
  type_id : uuid <<FK>>
  house_id : uuid <<FK>>
  serial_number : varchar
  endpoint : varchar
  auth_key : varchar
  status : varchar        
  last_seen_at : timestamp
  created_at : timestamp
}

entity "TelemetryData" as telemetry {
  * id : uuid <<PK>>
  --
  device_id : uuid <<FK>>
  metric : varchar        
  value : numeric
  measured_at : timestamp
  received_at : timestamp
}

entity "HeatingState" as heating_state {
  * id : uuid <<PK>>
  --
  house_id : uuid <<FK>>
  desired_state : varchar   
  actual_state : varchar    
  updated_at : timestamp
}

entity "Command" as cmd {
  * id : uuid <<PK>>
  --
  device_id : uuid <<FK>>
  created_by_user_id : uuid <<FK>>
  command_type : varchar     
  correlation_id : varchar
  status : varchar           
  error_message : text
  created_at : timestamp
  sent_at : timestamp
  completed_at : timestamp
}

user  ||--o{ house : owns
house ||--o{ device : contains
dev_type ||--o{ device : classifies

device ||--o{ telemetry : generates
device ||--o{ cmd : receives
user  ||--o{ cmd : issues

house ||--|| heating_state : has

@enduml
```

# Задание 4. Создание и документирование API

### 1. Тип API

1) POST DeviceMgmt - REST
Почему REST:
Это операция самообслуживания: пользователь/веб-приложение должен сразу понять, получилось ли зарегистрировать устройство и привязать к дому.
Нужны немедленные ошибки: 400 - это неудобно делать через события.

2) GET DeviceMgmt - REST
Почему REST:
Это чистое чтение (request/response). Нужен мгновенный ответ “нашёл/не нашёл”.
UI и сервисы не должны ждать на событие ради одного запроса, пример: дай карточку устройства.

3) POST DeviceMgmt - REST с 200 успех
Почему REST:
Отправитель (HeatingControl или WebApp) должен немедленно получить потверждение, что команда принята.
Сразу отдаем ошибки 404 - удобно только синхронно.

4) POST TempSensor - Async
Почему:
Телеметрия - это поток данных, возможны пики, и сеть у устройств может быть нестабильной.
Очередь/брокер даёт буферизацию: устройство/коннектор публикует событие, TempSensor потребляет когда готов.

5) GET TempSensor - REST
Почему REST:
UI и HeatingControl должны получать ответ сразу.
Для UI критично быстро показать результат.

6) POST HeatingControl - REST
Почему:
Это командная операция от пользователя: нужно сразу вернуть “принято/ошибка”.
HeatingControl обязан сразу давать ответ на  вход и вернуть 200 (принято, инициировали команду в DeviceMgmt) либо 404.

### 2. Документация API

OpenAPI REST: [openapi](openapi)
AsyncAPI: [asyncapi](asyncapi)


# Задание 5. Работа с docker и docker-compose

Перейдите в apps.

Там находится приложение-монолит для работы с датчиками температуры. В README.md описано как запустить решение.

Вам нужно:

1) сделать простое приложение temperature-api на любом удобном для вас языке программирования, которое при запросе /temperature?location= будет отдавать рандомное значение температуры.

Locations - название комнаты, sensorId - идентификатор названия комнаты

```
	// If no location is provided, use a default based on sensor ID
	if location == "" {
		switch sensorID {
		case "1":
			location = "Living Room"
		case "2":
			location = "Bedroom"
		case "3":
			location = "Kitchen"
		default:
			location = "Unknown"
		}
	}

	// If no sensor ID is provided, generate one based on location
	if sensorID == "" {
		switch location {
		case "Living Room":
			sensorID = "1"
		case "Bedroom":
			sensorID = "2"
		case "Kitchen":
			sensorID = "3"
		default:
			sensorID = "0"
		}
	}
```

2) Приложение следует упаковать в Docker и добавить в docker-compose. Порт по умолчанию должен быть 8081

3) Кроме того для smart_home приложения требуется база данных - добавьте в docker-compose файл настройки для запуска postgres с указанием скрипта инициализации ./smart_home/init.sql

Для проверки можно использовать Postman коллекцию smarthome-api.postman_collection.json и вызвать:

- Create Sensor
- Get All Sensors

Должно при каждом вызове отображаться разное значение температуры

Ревьюер будет проверять точно так же.


