# Notification System Documentation

## Overview

This project uses Ant Design's notification component to display notifications in the top right corner of the screen when API calls are made.

## Location

- **Utility File**: `src/utils/notification.js`

## Available Functions

### 1. Success Notification

```javascript
import { showSuccessNotification } from "../utils/notification";

showSuccessNotification("Title", "Description text");
```

- **Duration**: 3 seconds
- **Color**: Green
- **Use for**: Successful API calls, completed actions

### 2. Error Notification

```javascript
import { showErrorNotification } from "../utils/notification";

showErrorNotification("Title", "Description text");
```

- **Duration**: 4 seconds
- **Color**: Red
- **Use for**: Failed API calls, errors

### 3. Warning Notification

```javascript
import { showWarningNotification } from "../utils/notification";

showWarningNotification("Title", "Description text");
```

- **Duration**: 3 seconds
- **Color**: Orange
- **Use for**: Validation warnings, missing data

### 4. Info Notification

```javascript
import { showInfoNotification } from "../utils/notification";

showInfoNotification("Title", "Description text");
```

- **Duration**: 3 seconds
- **Color**: Blue
- **Use for**: General information

## Implementation Examples

### Login Component

```javascript
import {
  showSuccessNotification,
  showErrorNotification,
} from "../../utils/notification";

// Success case
authService
  .login(values)
  .then((response) => {
    showSuccessNotification("Login Successful", "Welcome back!");
    navigate("/");
  })
  .catch((error) => {
    showErrorNotification("Login Failed", "Invalid credentials");
  });
```

### Register Component

```javascript
import {
  showSuccessNotification,
  showErrorNotification,
} from "../../utils/notification";

// Success case
const response = await authService.register(data);
showSuccessNotification(
  "Registration Successful",
  "Your account has been created!"
);

// Error case
showErrorNotification("Registration Failed", error.response?.data?.message);
```

### RegisterInfo Component

```javascript
import {
  showSuccessNotification,
  showErrorNotification,
  showWarningNotification,
} from "../../utils/notification";

// Validation warning
if (imageList.length === 0) {
  showWarningNotification("Photo Required", "Please upload at least 1 photo!");
  return;
}

// Success
showSuccessNotification(
  "Profile Created!",
  "Your profile has been created successfully"
);

// Error
showErrorNotification("Profile Creation Failed", error.message);
```

## Features

- ✅ Appears in the **top right** corner of the screen
- ✅ Auto-dismisses after set duration
- ✅ Supports custom titles and descriptions
- ✅ Consistent styling across the app
- ✅ Easy to import and use anywhere

## Customization

To change placement or duration, edit `src/utils/notification.js`:

```javascript
notification.success({
  message: message,
  description: description,
  placement: "topRight", // Change to: topLeft, bottomRight, bottomLeft
  duration: 3, // Change duration in seconds
});
```
