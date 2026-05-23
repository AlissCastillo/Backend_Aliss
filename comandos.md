# Guía Rápida de Comandos Git 🚀

> [!TIP]
> **Consejo:** Presiona `Ctrl + Shift + V` en Visual Studio Code para previsualizar este archivo en formato de lectura con formato enriquecido.

Esta guía explica los comandos esenciales de Git para inicializar un proyecto localmente y vincularlo a tu repositorio en GitHub.

---

## 📋 Secuencia de Comandos Iniciales

```bash
git init
git add .
git commit -m "Configuración inicial del proyecto base"
git branch -M main
git remote add origin https://github.com/AlissCastillo/Backend_Aliss.git
git push -u origin main
```

---

## Explicación Detallada de cada Comando

### 1. `git init`
* **¿Para qué sirve?** Inicializa un repositorio de Git local en la carpeta de tu proyecto.
* **Detalles:** Crea una carpeta oculta `.git` donde se guardará todo el historial de cambios. Este comando se ejecuta **una sola vez** por proyecto. Sin él, ningún otro comando de Git funcionará.

### 2. `git add .`
* **¿Para qué sirve?** Prepara todos los archivos nuevos, modificados o eliminados para el próximo registro (los añade al *staging area*).
* **Detalles:** El punto `.` indica que deseas incluir **todos** los cambios del directorio actual. Es el paso previo antes de guardar oficialmente los cambios.

### 3. `git commit -m "Mensaje descriptivo"`
* **¿Para qué sirve?** Guarda una "captura" o foto del estado actual de tu proyecto con un mensaje que describe los cambios realizados.
* **Detalles:** Es fundamental usar mensajes claros (ej. `"Configuración inicial del proyecto base"`). Si tu proyecto deja de funcionar tras realizar modificaciones, podrás regresar de forma segura a cualquier commit estable del historial. ¡Es tu red de seguridad! 🛟

### 4. `git branch -M main`
* **¿Para qué sirve?** Cambia el nombre de la rama por defecto a `main` (rama principal).
* **Detalles:** Por convención en Git y GitHub, la rama principal se denomina `main`. Las ramas permiten trabajar en nuevas funcionalidades o experimentos sin alterar el código de la rama principal hasta que todo esté listo y probado.

### 5. `git remote add origin <URL_DEL_REPOSITORIO>`
* **¿Para qué sirve?** Vincula tu repositorio local con el repositorio en la nube de GitHub.
* **Detalles:** En este proyecto, la dirección configurada es:
  `https://github.com/AlissCastillo/Backend_Aliss.git`
  Esto le indica a Git hacia dónde debe subir los archivos al sincronizarse con la nube.

### 6. `git push -u origin main`
* **¿Para qué sirve?** Sube tus commits locales a la rama principal (`main`) en GitHub por primera vez.
* **Detalles:** El parámetro `-u` establece la relación de seguimiento entre tu rama local y la rama en GitHub, lo que permite que en adelante solo necesites escribir `git push` para actualizar tus cambios en la nube.
