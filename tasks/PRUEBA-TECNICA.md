## **PRUEBA TÉCNICA - DESARROLLADOR FINANZ** 

## **Objetivo** 

Desarrollar una aplicación web sencilla para la gestión de clientes y tickets de soporte, aplicando buenas prácticas de desarrollo, principios de arquitectura de software y conocimientos en frontend, backend, bases de datos, contenedorización y automatización. 

El objetivo de esta prueba es evaluar la capacidad del candidato para diseñar e implementar una solución funcional, organizada, mantenible y escalable. 

## **Tiempo estimado:** 4 horas. 

## **Requerimientos funcionales** 

## **Backend (Python - FastAPI)** 

Desarrollar una API REST que permita: 

## **Gestión de clientes** 

- Crear un cliente. 

- Listar todos los clientes. 

- Consultar un cliente por su identificador. 

## **Campos requeridos:** 

- ID. 

- Nombre. 

- Correo electrónico. 

- Empresa. 

- Fecha de creación. 

## **Gestión de tickets** 

- Crear un ticket asociado a un cliente. 

- Listar todos los tickets. 

- Actualizar el estado de un ticket. 

## **Campos requeridos:** 

- ID. 

- Cliente asociado. 

- Título. 

- Descripción. 

- Estado. 

- Fecha de creación. 

## **Estados permitidos:** 

- Pendiente. 

- En progreso. 

- Finalizado. 

## **Frontend (React)** 

Desarrollar una interfaz sencilla que permita: 

- Visualizar la lista de clientes. 

- Registrar nuevos clientes. 

- Visualizar la lista de tickets. 

- Crear nuevos tickets. 

- Actualizar el estado de un ticket. 

**Nota:** No se evaluará el diseño visual. El enfoque estará en la organización del código, la estructura de los componentes y la correcta integración con la API. 

## **Base de datos** 

Utilizar una base de datos relacional, preferiblemente PostgreSQL. 

Como valor agregado, implementar una base de datos no relacional (MongoDB) para registrar eventos de auditoría. 

## **Ejemplo de auditoría** 

- Usuario. 

- Acción realizada. 

- Identificador del ticket. 

- Fecha y hora del evento. 

## **Docker** 

La solución debe estar contenerizada. 

Se debe proporcionar un archivo docker-compose.yml que permita levantar todos los servicios necesarios. 

Servicios mínimos: 

- Frontend React. 

- Backend FastAPI. 

- Base de datos PostgreSQL. 

Servicios opcionales: 

- MongoDB. 

La aplicación debe ejecutarse mediante el siguiente comando: 

```sh 
docker compose up 
```

## **Arquitectura y buenas prácticas** 

La solución debe aplicar principios SOLID y una separación adecuada de responsabilidades. 

Se recomienda una estructura similar a la siguiente: 

```None 
controllers/ 
services/ 
repositories/ 
models/ 
schemas/ 
```

Se evaluará especialmente: 

- Principio de responsabilidad única (SRP). 

- Principio de inversión de dependencias (DIP). 

- Organización y mantenibilidad del código. 

- Legibilidad y reutilización. 

**Pruebas automatizadas** 

Implementar como mínimo: 

- Dos pruebas unitarias. 

- Una prueba de integración. 

Herramienta sugerida: 

- Pytest. 

## **Git y control de versiones** 

El repositorio debe evidenciar el proceso de desarrollo mediante múltiples commits descriptivos. 

Ejemplos: 

```None 
feat: create customer endpoints 

feat: implement ticket management 

feat: create React views 

test: add backend tests 

chore: dockerize application 
```

No se aceptarán entregas realizadas en un único commit. 

## **CI/CD** 

Implementar un pipeline básico utilizando GitHub Actions. 

El pipeline debe ejecutar como mínimo: 

- Instalación de dependencias. 

- Ejecución de un linter. 

- Ejecución de pruebas automatizadas. 

No es necesario realizar despliegues. 

## **Ejercicio adicional (Plus Salesforce)** 

Crear un documento llamado salesforce.md (máximo una página) explicando cómo integraría Salesforce con la solución desarrollada. 

El documento debe incluir: 

- Objetos de Salesforce que utilizaría. 

- Información que sincronizaría. 

- Un ejemplo de Apex Trigger. 

- Un ejemplo de componente LWC. 

- Cómo expondría la información mediante Experience Cloud. 

No es necesario desarrollar código; únicamente se evaluará la propuesta técnica. 

## **Entregables** 

El candidato deberá entregar un repositorio Git que incluya: 

- Código fuente del backend. 

- Código fuente del frontend. 

- Archivo README.md con instrucciones de ejecución. 

- Archivo docker-compose.yml. 

- Configuración del pipeline CI/CD. 

- Pruebas automatizadas. 

- Documento salesforce.md (opcional).
