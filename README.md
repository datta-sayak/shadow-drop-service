# shadow-drop-service

A minimalist backend service for securely sharing one‐time secrets and files with **password protection**, **AES-256 encryption**, and **automatic expiration** using MongoDB TTL indexes.


## 🚀 Prerequisites

- Node.js v16 or higher
- npm or yarn
- MongoDB instance (local or remote)


## ⚙️ Installation

```bash  
git clone https://github.com/datta-sayak/shadow-drop-service.git
cd shadow-drop-service
npm install		#or: yarn install
```


## 🧪 Configuration

Create a `.env` file in the root, sample given in `.env.sample`

| Variable           | Description                                |  
|--------------------|--------------------------------------------|  
| `MASTER_KEY`       | Hex-encoded 32-byte key for AES-256        |  
| `CIPHER_ALGORITHM` | Cipher (e.g., aes-256-cbc)                 |  
| `MONGODB_URI`      | MongoDB connection string                  |  
| `PORT`             | Port on which the server listens           |    


## 🔧 Running the Server

### Development (with hot reload):

```bash  
npm run dev
  ```
The API will be available at: `http://localhost:<PORT>`

## 📡 API Endpoints

### 1. 📤 Upload Text

```http  
POST api/v1/upload/text
Content-Type: application/json  
```  

#### Request Body:
```json
{
    "expireTime": "<TIME_IN_MIN>",
    "password": "<ENTER_PASSWORD>",
    "text": "<TEXT_MESSAGE>",
}
```

#### Response:
```json  
{
    "statusCode": 201,
    "data": "http://localhost:8000/api/v1/download/FFF5p6h9Rd",
    "message": "Text uploaded successfully",
    "status": "success",
}
```  
  
---  

### 2. 📤 Upload File

```http  
POST api/v1/upload/file  
Content-Type: multipart/form-data  
```  

#### Request Fields:
- `expireTime`: Time after which both the file and its access link will be automatically deleted.
- `password`: This password must be entered to unlock the link and initiate the file download.
- `secretFile`: Upload the file you want to share

#### Response:
```json  
{
    "statusCode": 201,
    "data": "http://localhost:8000/api/v1/download/1iGaV3fuTm",
    "message": "File uploaded successfully",
    "status": "success",
}
```  
  
---  

### 3. 📥 Download Data

```http  
GET api/v1/download/:shortUrl
Content-Type: application/json  
```  

#### Request Body:
```json  
{  
 "password": "<ENTER_PASSWORD>"},
}  
```  

#### Response:
- If **text**:
```json  
{
    "statusCode": 200,
    "data": "<TEXT_MESSAGE>",
    "message": "Text fetched successfully",
    "status": "success",
}  
```
- If **file**:
  Triggers a file download with `Content-Disposition: <secretFile>`
---  
