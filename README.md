# Guía de instalación y ejecución del proyecto

Este documento proporciona las instrucciones necesarias para clonar, instalar dependencias y ejecutar el proyecto de manera local.

## Requisitos previos

Antes de empezar, asegurate de tener los siguientes programas instalados en tu máquina:

* [npm](https://www.npmjs.com/): Gestor de dependencias de node.js que recomendamos para facilitar la instalación de este mismo
* [Node 20+](https://nodejs.org/en/): Versión recomendada de Node.js para ejecutar el proyecto en un entorno local
* [Git](https://git-scm.com/downloads): Necesario para clonar el repositorio

## Pasos para ejecutar el proyecto

1. **Clonar el repositorio**
   Clona el repositorio en tu máquina local utilizando Git:

   ```git
   git clone https://github.com/ITheBroncoI/CPM-Project-Frontend.git
   cd CPM-Project-Frontend
   ```
2. Asegurate de utilizar la versión recomendada de node.js para la ejecución del proyecto. La cual se sugiere que sea la 20.14.0:

   ```
   nvm use 20.14.0
   ```

   Si no tienes dicha versión de node instalada, instalalo de la siguiente manera:

   ```
   nvm install 20.14.0
   ```
3. **Instalar las dependencias**

   Instala todas las dependencias necesarias para el proyecto haciendo uso del `package.json`:

   ```
   npm install
   ```
4. E**jecutar la aplicación web**

   Una vez descargada las dependencias, ejecutar el servidor local:

   ```
   ng s
   ```

   Accede a la app web en [http://localhost:4200/](http://localhost:4200/)
