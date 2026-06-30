# Integración Salesforce

Propuesta técnica para sincronizar la solución con Salesforce Service Cloud.

## Objetos de Salesforce a usar

| Salesforce | Mapea a       | Notas                                                   |
|------------|---------------|---------------------------------------------------------|
| `Account`  | Customer (empresa) | Una Account por `customer.company`; upsert por `external_id__c = customers.id`. |
| `Contact`  | Customer (persona) | Contacto principal de la Account, upsert por `Email` o `External_Id__c`. |
| `Case`     | Ticket        | Estado nativo de Salesforce mapea a nuestro `status`.   |
| `Ticket_Event__e` (Platform Event) | payload intermedio | Recibe eventos `ticket.created` / `ticket.status_changed` desde el backend. |

La tabla `customers` local expone `id`, `name`, `email`, `company` —
todos mapean 1-a-1 contra los campos estándar de `Account` y `Contact`,
salvo el `id` que viaja en un campo custom `External_Id__c` (texto).

## Información que se sincroniza

1. **Customer → Account + Contact** — al crear/actualizar un customer
   en la API, un consumer (worker o Heroku/Functions) toma el evento,
   llama `POST /services/data/vXX.0/sobjects/Account/External_Id__c/{id}`
   con el upsert key, e idéntico para Contact.
2. **Ticket → Case** — al crear un ticket o cambiar su estado, el
   `AuditService` ya escribe en Mongo (`audit.events`); un segundo
   consumer re-emite los mismos eventos a `Ticket_Event__e` por la
   REST API de Platform Events o vía MuleSoft / Salesforce Connect.
3. **Case → Ticket (sentido inverso, opcional)** — un Apex Trigger en
   `Case` (after update) publica en un Platform Event inverso que el
   backend consume y refleja en Postgres (idempotente por
   `External_Ticket_Id__c`).

## Ejemplo de Apex Trigger

```apex
trigger TicketEventTrigger on Ticket_Event__e (after insert) {
    List<Case> cases = new List<Case>();
    for (Ticket_Event__e evt : Trigger.new) {
        cases.add(new Case(
            Subject          = evt.Title__c,
            Description      = evt.Description__c,
            Status           = mapStatus(evt.Status__c),
            Priority         = 'Normal',
            External_Ticket_Id__c = String.valueOf(evt.Ticket_Id__c),
            AccountId        = lookupAccount(evt.Customer_Id__c)
        ));
    }
    upsert cases Case.Fields.External_Ticket_Id__c;
}

private static String mapStatus(String s) {
    if (s == 'pendiente')   return 'New';
    if (s == 'en_progreso') return 'Working';
    if (s == 'finalizado')  return 'Closed';
    return 'New';
}

private static Id lookupAccount(Integer customerId) {
    List<Account> accs = [
        SELECT Id FROM Account
        WHERE External_Id__c = :String.valueOf(customerId)
        LIMIT 1
    ];
    return accs.isEmpty() ? null : accs[0].Id;
}
```

## Ejemplo de componente LWC

```javascript
// myTicketsLwc.js
import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners }
    from 'c/pubsub';
import getMyCases from '@salesforce/apex/TicketController.getMyCases';

export default class MyTicketsLwc extends LightningElement {
    pageRef;
    cases = [];
    error;

    @wire(CurrentPageReference) setPageRef(ref) { this.pageRef = ref; }

    @wire(getMyCases, { contactId: '$contactId' })
    wiredCases({ data, error }) {
        if (data)  { this.cases = data; this.error = undefined; }
        if (error) { this.error = error; this.cases = []; }
    }

    connectedCallback() {
        registerListener('ticketUpdated', this.handleTicketUpdate, this);
    }
    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    handleTicketUpdate(ticket) {
        this.cases = this.cases.map((c) =>
            c.External_Ticket_Id__c === ticket.id
                ? { ...c, Status: ticket.status }
                : c
        );
    }
}
```

```html
<!-- myTicketsLwc.html -->
<template>
    <lightning-card title="Mis tickets">
        <template lwc:if={cases.length}>
            <template for:each={cases} for:item="c">
                <div key={c.Id} class="slds-p-horizontal_small">
                    <p class="slds-text-heading_small">{c.Subject}</p>
                    <lightning-badge label={c.Status}></lightning-badge>
                </div>
            </template>
        </template>
        <template lwc:elseif={error}>
            <p class="slds-text-color_error">{error}</p>
        </template>
    </lightning-card>
</template>
```

```apex
// TicketController.cls
public with sharing class TicketController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getMyCases(Id contactId) {
        return [
            SELECT Id, Subject, Status, External_Ticket_Id__c,
                   CreatedDate, LastModifiedDate
            FROM Case
            WHERE ContactId = :contactId
            ORDER BY LastModifiedDate DESC
        ];
    }
}
```

## Exposición vía Experience Cloud

- Crear un Experience Cloud site ("Customer Service Portal") con
  template "Build Your Own" o "Customer Account Portal".
- Como portal login, habilitar "Customer Account Portal" para que los
  Contacts se autentiquen con email + OTP / SSO.
- Lightning Page en la home con un único componente: `<c-my-tickets-lwc>`.
  Pasa el `contactId` del usuario actual (disponible en Experience Cloud
  como `{!$User.ContactId}`).
- El LWC consume `getMyCases` filtrado por `ContactId`, suscribiéndose
  al Platform Event inverso (`ticketUpdated`) para refrescar el estado
  en tiempo casi-real cuando un agente de soporte cierra el Case en SF.

## Limitaciones y siguientes pasos

- **SSO** — mapear `Customer.email` a `User.Username` y enlazar con
  `Contact` por email para entrar al portal sin passwords.
- **Bidireccionalidad** — el consumer que trae cambios de SF → Postgres
  debe ser idempotente (usar `External_Ticket_Id__c` como dedup key).
- **Backpressure** — para volúmenes altos, mover el consumer a
  Heroku / AWS Lambda con cola (SQS / Pub/Sub) en lugar de un worker
  in-process.
- **Rate limits** — la API de Salesforce tiene topes por org; añadir
  retry-after handling en el consumer.
- **Seguridad** — el endpoint backend que re-emite a Platform Events
  debe autenticarse con OAuth 2.0 (JWT bearer flow), no con username +
  password.
