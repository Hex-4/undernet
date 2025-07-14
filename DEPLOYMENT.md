# UNDERNET Memory Reconstructor

A secure memory fragment reconstruction system with cryptographic validation.

## Features

- **Multi-file Upload**: Users can upload exactly 5 memory fragments
- **Cryptographic Validation**: Files are hashed using HMAC-SHA256 with secret key
- **Group Validation**: Ensures all 5 fragments belong to the same memory type (VIRAL, BUILD, SAIL, etc.)
- **Duplicate Prevention**: Completed groups cannot be resubmitted
- **Real-time Updates**: Live progress tracking across multiple clients
- **Obfuscated Code**: Client-side code is heavily obfuscated to prevent tampering
- **Static Database**: Uses CSV files for persistence (Vercel-compatible)

## Deployment on Vercel

### Setup Steps

1. **Connect Repository**
   ```bash
   git add .
   git commit -m "Memory reconstructor ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your repository to Vercel
   - Set the root directory to `website/`
   - Vercel will automatically detect the Astro project

3. **Verify Deployment**
   - Check `/reconstructor` endpoint works
   - Test file upload functionality
   - Verify API endpoints at `/api/database`

## Security Features

1. **Obfuscated Secret Key**: `ORPHEUSFURRY` is base64 encoded and decoded at runtime
2. **Variable Name Obfuscation**: All function and variable names are scrambled
3. **Cryptographic Hashing**: HMAC-SHA256 validation of file contents
4. **Fragment Validation**: Cross-references with encrypted database
5. **Group Integrity**: Ensures all 5 fragments are from same memory type

## Testing Locally

```bash
cd website
npm install
npm run dev
# Visit http://localhost:4321/reconstructor
```

## Memory Types (8 groups, 5 fragments each)
- VIRAL, BUILD, SAIL, DREAM, LIVE, DESIGN, HIKE, ADVENTURE
