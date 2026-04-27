# Customer Management System

   Technologies

* Java 17 (Spring Boot)
* React JS
* MariaDB
* Maven
* Axios
* JUnit

  Project Structure

* backend → Spring Boot APIs
* frontend → React UI
* database → DDL & DML scripts
* excel → Sample bulk upload file

  Setup Instructions

1. Backend

```bash
cd backend
mvn spring-boot:run
```
2. Frontend

```bash
cd frontend
npm install
npm start
```

3. Database

* Import schema.sql
* Import data.sql

   Features

* Create / Update / View Customer
* Multiple mobile numbers
* Multiple addresses
* Family member relationships
* Bulk upload via Excel (optimized for large files)

    Notes

* Large Excel uploads handled using streaming (no memory overflow)
* Unique NIC validation implemented
