# MagicMirror² Remote Control API Documentation

Version: **2.3.0+**  
Specification: **OAS 3.0**  
License: **MIT**  
Source: [MMM-Remote-Control GitHub](https://github.com/Jopyth/MMM-Remote-Control)

The **MMM-Remote-Control** Module for MagicMirror² provides a REST-like API to control MagicMirror², manage modules, and send notifications.  
This document outlines the available endpoints grouped by functionality.

---

## 🔑 Authorization
No authentication is required by default, but you may restrict access in your module configuration.

---

## 🪞 Mirror Control

### Test API
- **GET** `/api/test`  
  Test the API to make sure it's working.

### Commands
- **GET** `/api/command/{:value}`  
  Execute command saved in config.

### Configuration
- **GET** `/api/config`  
  Return the current MagicMirror² configuration.  
- **POST** `/api/config/edit`  
  Modify the current MagicMirror² configuration.  
- **GET** `/api/saves`  
  Return backups of the config file.  
- **GET** `/api/save`  
  Saves the MMM-Remote-Control defaults to a file.

### Monitor Control
- **GET** `/api/monitor/{:action}`  
  Control the connected display (on/off).  
- **POST** `/api/monitor/`  
  Control the connected display (on/off).

### System Actions
- **GET** `/api/shutdown` → Shutdown the system.  
- **GET** `/api/reboot` → Reboot the system.  
- **GET** `/api/restart` → Restart MagicMirror² instance (if using PM2).  
- **GET** `/api/minimize` → Minimize the Electron browser window.  
- **GET** `/api/togglefullscreen` → Toggle fullscreen (Electron).  
- **GET** `/api/devtools` → Toggle developer tools (Electron).  
- **GET** `/api/refresh` → Refresh the MagicMirror² screen.

### Brightness
- **GET** `/api/brightness/{:setting}`  
  Get or set brightness (1–100).

### Translations
- **GET** `/api/translations`  
  Returns the current translations file.

---

## 📦 Module Control

### Classes
- **GET** `/api/classes/{:value}`  
  Show or use a class.

### User Presence
- **GET** `/api/userpresence/{:value}`  
  Get or set user presence status.

### Module Management
- **GET** `/api/module/{:moduleName}`  
  Show available actions for a module.  
- **GET** `/api/module/{:moduleName*}/{:action}`  
  Execute an action on a module.  
- **GET** `/api/module/installed`  
  List installed modules.  
- **GET** `/api/module/available`  
  List modules available for installation.  
- **GET** `/api/update/{:moduleName}`  
  Update a module.  
- **POST** `/api/install`  
  Install a module.

---

## 🔔 Notifications

- **GET** `/api/notification/{:notification*}/{:p}`  
  Send generic notifications to the API.

---

## ⚠️ Legacy API
The **Legacy API** is deprecated and should not be used. It will be removed in future versions.

---

## ✅ Summary

- **Mirror Control**: Manage display, brightness, refresh, fullscreen, system actions.  
- **Configuration**: Get, edit, backup, and restore MagicMirror² configuration.  
- **Modules**: List, update, install, and control installed modules.  
- **Notifications**: Send notifications to modules.  

---

© MagicMirror² MMM-Remote-Control | MIT License
