# How to Check Database Schema Changes

## ✅ Database Schema Updated Successfully!

The disability information fields have been removed from the User schema. Only accessibility features remain.

---

## 🔍 Methods to Verify Database Changes

### Method 1: Run the Schema Check Script (Recommended)

```bash
cd visora-app/backend
node checkSchema.js
```

**What it shows:**
- ✅ All schema fields and their types
- ✅ Preferences structure
- ✅ Default values
- ✅ Total users in database
- ✅ Sample user preferences

---

### Method 2: MongoDB Compass (GUI Tool)

1. **Download MongoDB Compass**: https://www.mongodb.com/products/compass
2. **Connect** using your connection string from `.env`:
   ```
   mongodb+srv://santosh:RKMDhR1KN8EnVsMd@cluster0.fake.mongodb.net/visora
   ```
3. **Navigate**: 
   - Database: `visora`
   - Collection: `users`
4. **View Documents**: Click on any user to see their preferences structure

---

### Method 3: MongoDB Shell (mongosh)

```bash
# Connect to your database
mongosh "mongodb+srv://santosh:RKMDhR1KN8EnVsMd@cluster0.fake.mongodb.net/visora"

# Show collections
show collections

# View a user document
db.users.findOne()

# View only preferences
db.users.findOne({}, { preferences: 1, name: 1, email: 1 })

# Count users
db.users.countDocuments()

# Exit
exit
```

---

### Method 4: Test via API (Postman/Thunder Client)

**Get User Preferences:**
```
GET http://localhost:5001/api/users/preferences/{userId}
```

**Update Preferences:**
```
PUT http://localhost:5001/api/users/preferences/{userId}
Content-Type: application/json

{
  "preferences": {
    "voiceControl": true,
    "fontSize": 150,
    "highContrast": true,
    "textToSpeech": {
      "rate": 1.5,
      "pitch": 1.0,
      "volume": 0.8,
      "voice": 5
    }
  }
}
```

---

## 📊 What Changed in the Schema

### ❌ REMOVED (Disability Information):
- visualImpairment
- visualCustom
- hearingImpairment
- hearingCustom
- motorImpairment
- motorCustom
- cognitiveImpairment
- cognitiveCustom
- screenReaderUsage
- screenReaderCustom
- assistiveTechnology
- assistiveCustom

### ✅ KEPT (Accessibility Features):
- voiceControl (Boolean)
- hideImages (Boolean)
- highContrast (Boolean)
- dyslexiaFont (Boolean)
- highlightLinks (Boolean)
- disableAnimations (Boolean)
- focusLine (Boolean)
- letterSpacing (Number: 0-0.5)
- dimmerOverlay (Boolean)
- cursorSize (Number: 0-2)
- fontSize (Number: 100-200)
- lineHeight (Number: 1.0-3.0)
- contentWidth (Number: 600-1400)
- blockPopups (Boolean)
- readingMode (Boolean)
- disableStickyElements (Boolean)
- disableHoverEffects (Boolean)
- textToSpeech (Object):
  - rate (Number: 0.1-10.0)
  - pitch (Number: 0.0-2.0)
  - volume (Number: 0.0-1.0)
  - voice (Number: 0-21)

---

## 🔄 Important Notes

### Existing Users:
- **Old data is preserved**: Existing users with disability information will keep that data
- **New schema applies**: New users will only have accessibility features
- **No data loss**: MongoDB doesn't delete fields automatically

### To Clean Old Data (Optional):
If you want to remove old disability fields from existing users:

```javascript
// Run in MongoDB shell or create a migration script
db.users.updateMany(
  {},
  {
    $unset: {
      "preferences.visualImpairment": "",
      "preferences.visualCustom": "",
      "preferences.hearingImpairment": "",
      "preferences.hearingCustom": "",
      "preferences.motorImpairment": "",
      "preferences.motorCustom": "",
      "preferences.cognitiveImpairment": "",
      "preferences.cognitiveCustom": "",
      "preferences.screenReaderUsage": "",
      "preferences.screenReaderCustom": "",
      "preferences.assistiveTechnology": "",
      "preferences.assistiveCustom": ""
    }
  }
)
```

---

## ✅ Verification Checklist

- [ ] Backend server running on port 5001
- [ ] MongoDB connected successfully
- [ ] Run `node checkSchema.js` to see schema structure
- [ ] Test creating a new user via signup
- [ ] Test updating preferences via dashboard
- [ ] Verify preferences are saved correctly
- [ ] Check MongoDB Compass/Shell to see actual data

---

## 🆘 Troubleshooting

**Issue**: Can't connect to MongoDB
- Check your `.env` file has correct `MONGO_URI`
- Verify MongoDB Atlas cluster is running
- Check network/firewall settings

**Issue**: Old fields still showing
- This is normal for existing users
- New users won't have these fields
- Run cleanup script if needed

**Issue**: Schema check script fails
- Make sure you're in `visora-app/backend` directory
- Run `npm install` to ensure dependencies are installed
- Check MongoDB connection string

---

## 📝 Quick Test

1. **Start backend**: `npm start` (in backend folder)
2. **Check schema**: `node checkSchema.js`
3. **Create new user**: Sign up via frontend
4. **Set preferences**: Edit preferences in dashboard
5. **Verify**: Run schema check again to see the data

---

**Status**: ✅ Schema updated and backend restarted successfully!
