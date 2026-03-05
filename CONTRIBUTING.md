Gracias por contribuir a este proyecto.
Este documento explica cómo trabajar en el repositorio para mantener un flujo de trabajo claro y consistente entre todos los miembros del equipo.

Flujo de trabajo
Utilizamos GitHub Flow basado en Pull Requests.
1. Crear una rama
Cada cambio debe realizarse en una rama nueva a partir de master.

Ejemplo:
git checkout master
git pull origin master
git checkout -b feature/nombre-de-la-feature

Convenciones sugeridas:
feature/... → nuevas funcionalidades
fix/... → corrección de bugs
refactor/... → mejoras internas de código
docs/... → cambios en documentación

2. Commits claros
Intentar que los commits sean pequeños y descriptivos.

Ejemplo:
feat: add landing page hero section
fix: correct email validation
refactor: simplify auth middleware

3. Crear Pull Request
Una vez terminado el trabajo:

git push origin nombre-de-la-rama
Luego abrir un Pull Request hacia master.

Antes de hacer merge se espera:
al menos 1 review
que los checks de CI pasen
que la build sea exitosa

Entornos del proyecto
El proyecto utiliza Vercel para manejar los distintos entornos:

Development → desarrollo local
Preview → deploy automático por Pull Request
Production → rama master
Cada Pull Request genera automáticamente un deploy preview para poder probar cambios antes de hacer merge.

Base de datos
Actualmente el proyecto utiliza una única base de datos en Turso compartida entre los distintos entornos (development, preview y production).
Esta decisión se tomó para simplificar la infraestructura en la etapa inicial del proyecto y permitir que el equipo avance más rápido sin agregar complejidad operativa innecesaria.

Sin embargo, este enfoque no cumple completamente con el principio de Environment Isolation, donde idealmente cada entorno debería tener su propia base de datos independiente.

Separar las bases por entorno permite:
evitar que datos de pruebas impacten producción
reducir riesgos durante migraciones
aplicar accesos más restrictivos siguiendo el Principle of Least Privilege

A futuro se recomienda migrar hacia un esquema con bases de datos separadas por entorno y tokens de acceso específicos, mejorando seguridad, estabilidad y control de la infraestructura.

Instalación local
Clonar el repositorio
git clone <repo-url>
cd proyecto

Instalar dependencias
pnpm install

Ejecutar el entorno de desarrollo
pnpm dev

La aplicación estará disponible en:
http://localhost:3000

Deploy
Los deploys se manejan automáticamente con Vercel.

Push a master → deploy a producción
Pull Request → preview deployment

Esto permite validar cambios antes de integrarlos al entorno productivo.

Notas para el equipo
Mantener los Pull Requests lo más pequeños posible
Evitar merges directos a master
Verificar que la build funcione antes de abrir el PR.