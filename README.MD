# RouseMe: Despierta con el transporte público

## Introducción

RouseMe es una aplicación web diseñada para ayudarte a despertarte suavemente utilizando el transporte público. Te permite elegir tu destino y modo de transporte, luego vibra y reproduce sonidos a medida que te acercas a tu parada, asegurando que no te duermas.

## Funciones

* Selecciona tu destino y tipo de transporte (tren, metro, autobús).
* Recibe alertas de vibración y audio a medida que te acercas a tu parada.
* Interfaz simple e intuitiva.
* Ligera y eficiente para dispositivos móviles.

## Cómo usar la aplicación

### 1. Replit

1. Forkea este proyecto en Replit: https://replit.com/@JavierP2/siu-laborat1
2. Haz clic en "Ejecutar".
3. Abre el enlace proporcionado en una nueva pestaña en tu dispositivo de despertador.
4. ¡Disfruta de despertarte suavemente!

### 2. Autohost

1. Clona este repositorio.
2. Configura un servidor web (por ejemplo, Node.js con Express).
3. Implementa la aplicación en tu servidor.
4. Accede a la URL de la aplicación en tu dispositivo de despertador.

## Dependencias

RouseMe utiliza las siguientes bibliotecas de terceros:

* Leaflet: https://leaflet.js/
* SweetAlert2: https://sweetalert2.github.io/
* SimpleBar: https://simplebar.io/

## Configuración adicional

Para garantizar el correcto funcionamiento de la aplicación, ten en cuenta lo siguiente:

### Permiso de Ubicación

La aplicación utiliza la ubicación para ofrecerte alertas precisas y personalizadas. Asegúrate de permitir el acceso a la ubicación en tu dispositivo.

### API Wake Lock

Para evitar que la pantalla de tu dispositivo se apague mientras usas la aplicación, RouseMe utiliza la API Wake Lock. Esto asegura que puedas ver las alertas incluso si la pantalla está apagada. Asegúrate de que la aplicación tenga los permisos necesarios para utilizar esta API.

### Notificaciones Push

Para garantizar que te despiertes a tiempo, la aplicación utiliza notificaciones push. Asegúrate de habilitar las notificaciones y desactivar el modo No Molestar en tu dispositivo.

## Guía de uso

1. Selecciona tu destino o elige la opción de seleccionar en el mapa y haz clic cuando se muestre.
2. Elige tu medio de transporte (tren, metro, autobús).
3. Pulsa en 'Ok' en el popup que informa sobre la necesidad de desilenciar el móvil y desactivar el modo No Molestar.
4. Decide si quieres mantener la pantalla del móvil encendida.
5. ¡Disfruta de un despertar suave y puntual con RouseMe! 