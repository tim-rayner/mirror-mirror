# Troubleshooting Guide

## CORS Issues

If you encounter CORS errors like "Response to preflight request doesn't pass", follow these steps:

### 1. Development Mode

The app makes direct API calls to your Magic Mirror:

- **No proxy needed** - requests go directly to `http://192.168.1.80:8080/api/*`
- **CORS configured** - uses `credentials: "omit"` to work with wildcard origins
- Check the browser console for API logs

### 2. Production Mode

For production deployment, configure MMM-Remote-Control with proper CORS settings:

```javascript
// In your Magic Mirror config.js
{
  module: 'MMM-Remote-Control',
  config: {
    port: 8080,
    allowCommands: true,
    allowModules: true,
    allowSystem: true,
    cors: {
      origin: ["*"],
      credentials: false
    }
  }
}
```

### 3. Testing API Connectivity

1. Visit `/test` in the web interface
2. Click "Run API Test"
3. Check the results for each endpoint
4. Review browser console for detailed logs

### 4. Common Issues & Solutions

#### Issue: "Network error" or "Failed to fetch"

**Solution**:

- Ensure MMM-Remote-Control is running on port 8080
- Check if Magic Mirror is running
- Verify the module is properly installed

#### Issue: "CORS error" in production

**Solution**:

- Add your domain to the `origin` array in MMM-Remote-Control config
- Restart Magic Mirror after configuration changes
- Ensure `credentials: false` is set

#### Issue: API endpoints return 404

**Solution**:

- Verify MMM-Remote-Control module is loaded
- Check Magic Mirror logs for module errors
- Ensure all permissions are enabled (`allowModules`, `allowScenes`, etc.)

#### Issue: Switches don't work

**Solution**:

- Check browser console for API errors
- Verify module identifiers match your Magic Mirror setup
- Test individual endpoints in the `/test` page

### 5. Environment Variables

For production, set the correct API URL:

```bash
# .env file
VITE_MIRROR_API_URL=http://your-mirror-ip:8080
```

### 6. Debug Mode

Enable detailed logging by checking:

- Browser Developer Tools → Console
- Magic Mirror logs (`pm2 logs` or `npm start`)
- Network tab in DevTools for request/response details

### 7. Alternative Solutions

If CORS continues to be an issue:

1. **Use a reverse proxy** (nginx, Apache) to serve both the web app and API
2. **Deploy the web app on the same server** as Magic Mirror
3. **Use a browser extension** to disable CORS (development only)

## Getting Help

1. Check the [MMM-Remote-Control documentation](https://github.com/Jopyth/MMM-Remote-Control)
2. Review Magic Mirror logs for module errors
3. Test API endpoints directly with curl or Postman
4. Verify network connectivity between devices
