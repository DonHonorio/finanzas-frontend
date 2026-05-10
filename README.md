# Riconomy

Riconomy es una aplicación web full stack de finanzas personales diseñada para centralizar y gestionar ingresos, gastos, cuentas, categorías y métricas financieras desde una plataforma intuitiva.

El objetivo del proyecto es ofrecer una herramienta práctica para que el usuario pueda tener una visión clara de su situación financiera, organizar sus movimientos y analizar su evolución económica.

## Demo

https://riconomy.duckdns.org/

## Tecnologías utilizadas

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Sequelize ORM

### Base de datos
- PostgreSQL

### Herramientas y despliegue
- Git
- GitHub
- VPS
- Variables de entorno
- Deploy en producción

## Funcionalidades principales

- Gestión de ingresos y gastos.
- Gestión de categorías y subcategorías.
- Gestión de cuentas financieras.
- Visualización de métricas financieras.
- Dashboard con información relevante para el usuario.
- Autenticación de usuarios.
- Conexión frontend-backend mediante API REST.
- Persistencia de datos en PostgreSQL.
- Aplicación desplegada en entorno de producción.

## Arquitectura general

El proyecto está dividido en frontend y backend.

El frontend está desarrollado con Next.js y TypeScript, encargado de renderizar la interfaz, gestionar las vistas principales y consumir los datos procedentes de la API.

El backend está desarrollado con Node.js y Express.js, exponiendo una API REST encargada de gestionar la lógica de negocio, las validaciones y la comunicación con la base de datos PostgreSQL mediante Sequelize ORM.

## Principales retos técnicos

Durante el desarrollo de Riconomy trabajé en varios aspectos clave de una aplicación full stack real:

- Diseño de una base de datos relacional para representar usuarios, cuentas, categorías y movimientos financieros.
- Creación de endpoints REST para gestionar las entidades principales de la aplicación.
- Integración del frontend con el backend mediante peticiones HTTP.
- Implementación de autenticación y control de acceso.
- Organización del código para separar responsabilidades entre rutas, controladores, modelos y servicios.
- Despliegue del proyecto en un VPS y configuración del entorno de producción.

## Capturas de pantalla

Añadir aquí capturas del dashboard, formulario de movimientos, vista de categorías y cualquier pantalla relevante.

<img width="2552" height="1300" alt="image" src="https://github.com/user-attachments/assets/704b2931-d2cd-46b2-a7f3-0fc149efa1b5" />
<img width="2547" height="1302" alt="image" src="https://github.com/user-attachments/assets/8836aad0-3bd0-4479-963b-c44562bfe81e" />
<img width="1454" height="1128" alt="image" src="https://github.com/user-attachments/assets/4662b044-5e9d-4924-8e3a-a03f721e135e" />
<img width="2463" height="1264" alt="image" src="https://github.com/user-attachments/assets/76fba2a8-190b-4c68-9e8c-ab8b7b53c7f0" />
<img width="2353" height="1165" alt="image" src="https://github.com/user-attachments/assets/4046eb87-b87c-468f-a300-6ea7bf78227c" />
<img width="895" height="858" alt="image" src="https://github.com/user-attachments/assets/8c430ff2-97a6-40df-96ce-38d2d344d9f7" />
<img width="2540" height="1290" alt="image" src="https://github.com/user-attachments/assets/cd4cd258-ee59-46de-b6eb-b3fe57fdcff2" />

Instalación local
1. Clonar el repositorio
git clone https://github.com/DonHonorio/finanzas-frontend.git
cd riconomy
2. Instalar dependencias

Frontend:

cd frontend
npm install

Backend:

cd backend
npm install
3. Configurar variables de entorno

Crear un archivo .env en el backend con las variables necesarias:

PORT=3001
DATABASE_URL=postgresql://usuario:password@localhost:5432/riconomy
JWT_SECRET=your_secret_key

Crear también el archivo .env del frontend si es necesario:

NEXT_PUBLIC_API_URL=http://localhost:3001
4. Ejecutar el proyecto

Backend:

npm run dev

Frontend:

npm run dev
Estado del proyecto

Riconomy es un proyecto funcional, desplegado y en evolución. Actualmente permite gestionar las principales entidades financieras y sirve como demostración práctica de desarrollo full stack con Next.js, Express.js y PostgreSQL.

Próximas mejoras
Añadir gráficos financieros avanzados.
Mejorar filtros por fechas y categorías.
Añadir exportación de datos.
Implementar tests automatizados.
Mejorar la experiencia responsive.
Añadir notificaciones o alertas de presupuesto.
Autor

Honorio Conesa
Full Stack Developer
LinkedIn: https://www.linkedin.com/in/honorio-conesa-acosta-b9587a400/
Portfolio: https://portafolio-honorio.qtv68r.easypanel.host/
GitHub: https://github.com/DonHonorio

