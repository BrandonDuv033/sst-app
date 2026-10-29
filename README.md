# Sistema de Gestión de Mantenimiento de Equipos

Sistema web diseñado para automatizar la solicitud, asignación y seguimiento de mantenimiento técnico para equipos de formación. Permite a los aprendices reportar fallos, a los coordinadores asignar casos y al equipo de soporte gestionar la reparación en tiempo real.

## 👥 Equipo de Desarrollo
* **Brandon Guevara** - *Análisis, Diseño y Desarrollo*
* **Mariana Martínez** - *Análisis, Diseño y Desarrollo*

## 🚀 Estado del Proyecto
**Fase actual:** Análisis de requisitos y diseño de base de datos relacional (MySQL).
El proyecto se encuentra en la etapa de documentación previa a la inicialización del código fuente.

## 🛠️ Tecnologías y Arquitectura
* **Frontend:** React + Vite (Arquitectura Multicapas)
* **Backend:** Por definir...
* **Base de Datos:** MySQL
* **Control de Versiones:** Git + GitHub

## 📂 Arquitectura Frontend (Multicapas)
El cliente web está diseñado separando las responsabilidades:
1. **Capa de Presentación:** Ubicada en `/components` y `/pages`. Maneja exclusivamente la interfaz de usuario.
2. **Capa de Lógica de Negocio:** Ubicada en `/hooks` y `/context`. Procesa los datos antes de enviarlos a la vista.
3. **Capa de Acceso a Datos:** Ubicada en `/services`. Centraliza todas las peticiones HTTP hacia la API.

## 📝 Estándar de Commits (Conventional Commits)
Este repositorio sigue estrictamente los lineamientos de commits semánticos (`feat`, `fix`, `style`, `docs`, `refactor`, `chore`). 

Cada commit debe estructurarse en **dos bloques** separados:
1. Un título semántico en minúscula imperativa (máximo 50 caracteres).
2. Un párrafo continuo sin viñetas que describa detalladamente los cambios realizados.

Ejemplo:
feat: añadir tabla transaccional para bitácora

se añade la tabla bitacora_tickets a la base de datos para registrar el historial de movimientos de cada caso asignado a soporte garantizando la trazabilidad de los traslados al taller y los comentarios del equipo técnico.