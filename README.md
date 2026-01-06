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
Развертывание: Требует остановки всего приложения.


### 3. Определение доменов и границы контекстов

Опишите здесь домены, которые вы выделили.
Domain 1 : Управление устройствами
	Описание: доставлять команды на физическое устройство управления отоплением.
		контекст: Привязка устройства к дому
Domain 2: Измеритель температуры
	Описание: принимает и отдает показания по температуре
		контекст: принятие данных по температуре
		контекст: ведение журнала температур
Domain 3: Управление температурой
	Описание: дает пользователю управлять отоплением дома
		контекст: Отправка команд на устройство для  вкл/выкл/состояние.
### **4. Проблемы монолитного решения**

- Нет самообсуживание
- Маштабируемость сиситемы упирается в синхронные запросы и приведет к не устойчивости системы
- выпуск релизов новых

### 5. Визуализация контекста системы — диаграмма С4

Добавьте сюда диаграмму контекста в модели C4.

Чтобы добавить ссылку в файл Readme.md, нужно использовать синтаксис Markdown. Это делают так:

```markdown
@startuml
title Warhhouse Context Diagram

!includeurl https://raw.githubusercontent.com/RicardoNiepel/C4-PlantUML/master/C4_Component.puml

Person(user, "User", "Удалённо управляет отоплением и просматривает температуру")
Person(admin, "Специалист по установке", "Подключает дом и устройство к системе при первичном монтаже")
System(WarmhouseSystem, "Warmhouse System", "Система измеряет температуру в доме и дает возможность упралять ей")

System_Ext(device, "Датчик температуры + реле отопления", "IoT-устройство", "Измеряет температуру и принимает команды включения/выключения отопления.")

Rel(user, monolith, "Использует веб-интерфейс", "HTTPS (Web)")
Rel(admin, monolith, "Регистрирует/настраивает дом и оборудование", "через интерфейс/админку")
Rel(monolith, device, "Отправляет команды управления отоплением", "Синхронный запрос (HTTP/протокол устройства)")
Rel(monolith, device, "Запрашивает текущую температуру (polling)", "Синхронный запрос (HTTP/протокол устройства)")
Rel(device, monolith, "Возвращает показания температуры/статусы", "Синхронный ответ")
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
}

System_Ext(device, "Датчик температуры + реле отопления", "IoT-устройство", "Измеряет температуру, установка определенной темературы и принимает команды включения/выключения отопления.")

Rel(user, WebApp, "Uses the system")
Rel(WebApp,Database,"Reads/Writes user data")
Rel(WebApp,DeviceMgmt,"Доставлять команды на физическое устройство управления отоплением")
Rel(DeviceMgmt,device,"Доставлять команды на физическое устройство управления отоплением")
Rel(WebApp,TempSensor,"Отдает показания по температуре")
Rel(device,TempSensor,"Отдает показания по температуре")
Rel(WebApp,HeatingControl,"дает пользователю управлять отоплением дома")
Rel(device,HeatingControl,"дает пользователю управлять отоплением дома")
@enduml
```
**Диаграмма компонентов (Components)**
```markdown 
@startuml
title Wormhouse Web Application Component Diagram

top to bottom direction

!includeurl https://raw.githubusercontent.com/RicardoNiepel/C4-PlantUML/master/C4_Component.puml

Container_Boundary(WarmhouseSystem, "Warmhouse System") {
  Container(WebApp, "Web Application", "Go", "Handles user interactions")
  Container(Database, "Database", "PostgreSQL", "Stores user data")
}

Container(WebApp, "Web Application", "GO") {
  Component(AuthController, "AuthController", "Handles authentication and authorization")
  Component(UserController, "UserController", "Manages user profiles")
  Component(ServiceLayer, "Service Layer", "Business logic")
  Component(RepositoryLayer, "Repository Layer", "Data access logic")
}

Rel(AuthController,ServiceLayer,"Calls business logic")
Rel(UserController,ServiceLayer,"Calls business logic")
Rel(ServiceLayer,RepositoryLayer,"Reads/Writes data")
Rel(RepositoryLayer,Database,"Reads/Writes user data")
@enduml
```
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


