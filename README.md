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
title Wormhouse Device Menegment, Component Diagram

top to bottom direction

!includeurl https://raw.githubusercontent.com/RicardoNiepel/C4-PlantUML/master/C4_Component.puml

Container_Boundary(Warmhouse, "Теплый дом") {
  Container(DeviceMgmt, "Управление устройством", "Go", "Handles user interactions")
  Container(Device, "Датчик температуры + реле отопления", "IoT-устройство", "Измеряет температуру и принимает команды включения/выключения отопления.")

}

Container(DeviceMgmt, "Управление устройством", "GO") {
  Component(API, "API", "API")
  Component(UserController, "обработчик команд", "")
  Component(ServiceLayer, "менеджер состояния устройств", "")
  Component(RepositoryLayer, "Repository Layer", "Data access logic")
}

Rel(UserController,ServiceLayer,"Calls business logic")
Rel(ServiceLayer,RepositoryLayer,"Reads/Writes data")
Rel(RepositoryLayer,Device,"Reads/Writes user data")
@enduml
```


**Диаграмма кода (Code)**

Добавьте одну диаграмму или несколько.

# Задание 3. Разработка ER-диаграммы

Добавьте сюда ER-диаграмму. Она должна отражать ключевые сущности системы, их атрибуты и тип связей между ними.

# Задание 4. Создание и документирование API

### 1. Тип API

Укажите, какой тип API вы будете использовать для взаимодействия микросервисов. Объясните своё решение.

### 2. Документация API

Здесь приложите ссылки на документацию API для микросервисов, которые вы спроектировали в первой части проектной работы. Для документирования используйте Swagger/OpenAPI или AsyncAPI.

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


