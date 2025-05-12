

---

Kora - 3D Printing eCommerce Platform

Kora is a full-stack eCommerce website built for a 3D Printing business. This project enables customers to browse, customize, and purchase 3D printed products online, with a seamless user experience and secure payment integration.

---

Features

* Product Listing & Filtering
  Browse and search through various 3D printed products with optimized UI/UX.

* User Authentication
  JWT-based signup, login, and secure route protection.

* Order Management
  Create, view, and track orders through an intuitive dashboard.

* Payment Integration
  Razorpay Payment Gateway for smooth checkout and transaction flow.

* Image Handling with Cloudinary
  Upload and manage product images with optimized CDN delivery.

* Pincode Delivery Checker
  Dynamic delivery area validation using pincode API.

---

Tech Stack

| Frontend     | Backend    | Database      | Cloud & Payments       |
| ------------ | ---------- | ------------- | ---------------------- |
| React.js     | Node.js    | MongoDB Atlas | Cloudinary (Media CDN) |
| Tailwind CSS | Express.js | Mongoose ORM  | Razorpay (Payments)    |
| JWT          |            |               |                        |

---

Installation Guide

1. Clone the Repository

```bash
git clone https://github.com/AMG-source/Kora.git
cd Kora
```

2. Install Dependencies

For Server (Backend):

```bash
cd server
npm install
```

For Client (Frontend):

```bash
cd ../client
npm install
```

3. Environment Variables

Create a `.env` file inside the `server` directory with the following keys:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

4. Run the Application

Start Backend Server:

```bash
cd server
npm run dev
```

Start Frontend Client:

```bash
cd ../client
npm run dev
```

Visit the application on: `http://localhost:5173`

---

Folder Structure

```
/client         # React Frontend
/server         # Node.js + Express Backend
    /models     # Mongoose Models
    /routes     # API Routes
    /middlewares# JWT Auth Middleware
    /utils      # Helper Functions
.env            # Environment Variables (not pushed)
package.json    # Project Metadata
```

---

License

This project is open-source and available under the MIT License.

---


