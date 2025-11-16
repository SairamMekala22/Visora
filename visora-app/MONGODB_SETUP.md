# MongoDB Connection Setup

## Quick Setup Instructions

### 1. Get MongoDB Atlas (Free)

1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Create a FREE cluster (M0 Sandbox)

### 2. Create Database User

1. Go to "Database Access" in left sidebar
2. Click "ADD NEW DATABASE USER"
3. Choose "Password" authentication method
4. Username: `visorauser` (or your choice)
5. Password: Create a strong password
6. Database User Privileges: "Atlas admin" or "Read and write to any database"
7. Click "Add User"

### 3. Configure Network Access

1. Go to "Network Access" in left sidebar
2. Click "ADD IP ADDRESS"
3. Click "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0)
   - For production, use specific IPs only
4. Click "Confirm"

### 4. Get Connection String

1. Go to "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Driver: Node.js
5. Copy the connection string

It will look like:
```
mongodb+srv://visorauser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 5. Update .env File

Open `visora-app/backend/.env` and replace:

```env
PORT=5001
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/visora?retryWrites=true&w=majority
```

**Important**: 
- Replace `YOUR_USERNAME` with your database username
- Replace `YOUR_PASSWORD` with your database password
- Replace `YOUR_CLUSTER` with your cluster URL
- Keep `/visora` at the end (this is your database name)

### 6. Restart Backend

```bash
# Stop the current backend (Ctrl+C)
# Then restart:
cd visora-app/backend
node server.js
```

You should see:
```
Server running on port 5001
MongoDB connected...
```

## Example Connection String

If your username is `visorauser`, password is `myPass123`, and cluster is `cluster0.abc12.mongodb.net`:

```
MONGO_URI=mongodb+srv://visorauser:myPass123@cluster0.abc12.mongodb.net/visora?retryWrites=true&w=majority
```

## Troubleshooting

### Error: "querySrv ENOTFOUND"
- Check your connection string is correct
- Ensure you replaced the fake credentials

### Error: "Authentication failed"
- Verify username and password are correct
- Check if user has proper permissions

### Error: "IP not whitelisted"
- Go to Network Access and add 0.0.0.0/0

### Connection successful but no data?
- That's normal! The database is empty initially
- Try signing up a user to create data

## Need Help?

Share your connection string (WITHOUT the password) and I can help format it correctly!

Example: `mongodb+srv://visorauser:****@cluster0.abc12.mongodb.net/`
