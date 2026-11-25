# Lost and Found Information System (LFIS)

A modern, responsive, client-side web application and administration portal for reporting, tracking, verifying, and recovering lost and found items. Built with pure JavaScript, HTML5, Bootstrap 5, and IndexedDB for high performance, local data persistence, and offline capabilities.

---

## 🌟 Key Features

### 1. Complete Found Item Reporting System
- **Comprehensive Item Details:** Report found items with item title, category selection, incident date, and specific discovery location (e.g. *Central Library, 2nd Floor*).
- **Multiple Photograph Uploads:** Support for up to 5 simultaneous item photographs with interactive client-side preview thumbnails and one-click removal.
- **Moderation Workflow:** Reports are submitted in `Pending` moderation status (status `0`) and require administrative review before public publication.
- **Founder Dashboard ("My Reports & Claims"):** Real-time monitoring of all reported found items and ownership claims.

### 2. Multi-Stage Claim Verification & Recovery System
- **Compulsory Unique Identifying Secret Proof:** Claimants must supply a confidential, unique identifying detail (e.g., hidden marks, engravings, pouch contents, scratches) not disclosed in public listings.
- **Strict Privacy Protection:** Verification answers and private claimant addresses are strictly shielded from public listings and other users; only authorized administrators and the claim owner can view them.
- **Founder Conflict Prevention:** Founders cannot claim items they reported finding.
- **Admin Claim Operations:** Dedicated **Item Claims** management view in the Admin Portal supporting:
  - Review of claimant details and confidential verification secret answers.
  - Approve claim, reject claim with mandatory explanation, or request additional information.
  - Competing claims handling for items with multiple claimants.
- **Private Handover Address Submission:** Upon claim approval, claimants privately submit identity proof types and contact/delivery addresses.
- **Admin-Controlled Official Collection Location:** Administrators designate the official pickup desk, physical room, operational hours, and instructions.
- **Final Handover Confirmation:** Items are only marked as `Returned` (`status: 2`) when the administrator confirms physical collection, automatically resolving competing claims.

### 3. Integrated Notification System
- Dynamic notification bell in navigation with unread count badges.
- Real-time alerts for claim submission, admin approval, collection desk scheduling, information requests, and recovery completion.

### 4. Professional Frontend Cleanup
- Replaced all legacy PHP-LFIS references, Latin filler strings, and test placeholders with authentic, professional Lost & Found copy.
- Mobile-responsive navigation, modern card layouts, and status indicator badges.

### 5. Administrative Dashboard Metrics
- Accurate, live database-driven metrics:
  - Total Found Items
  - Published Listings
  - Pending Moderation Items
  - Successfully Returned Items
  - Total Claims Filed
  - Pending Verification Claims
  - Approved Claims
  - Awaiting Collection Claims
  - Rejected Claims
  - Active / Inactive Categories
  - Unread Messages & Inquiries

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, Bootstrap Icons.
- **Database:** Browser-based IndexedDB (`lfis_indexeddb` version 4) with 16 stores:
  - `item_list`, `category_list`, `claims`, `notifications`, `users`, `inquiry_list`, `system_info`, `delivery_schedules`, and more.
- **Backend / Static Server:** Node.js HTTP server (`server.js`).
- **Testing:** Automated browser test suite (`test.html`) with headless Chrome runner (`run-tests.js`).

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended).
- Modern web browser (Chrome, Edge, Firefox, or Safari).

### Running Locally
1. Start the local static file server:
   ```bash
   node server.js
   ```
2. Open your web browser:
   - **Public Website:** [http://localhost:8080/](http://localhost:8080/)
   - **User Dashboard ("My Reports & Claims"):** [http://localhost:8080/?page=my-reports](http://localhost:8080/?page=my-reports)
   - **Admin Portal:** [http://localhost:8080/admin/](http://localhost:8080/admin/)
   - **Item Claims Manager:** [http://localhost:8080/admin/?page=claims](http://localhost:8080/admin/?page=claims)

### Default Authentication Credentials

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | Full Admin Portal & Claims Verification |
| **Staff Member** | `carl` | `admin123` | Operational Staff |
| **Public User** | *Register via website* | *User defined* | Report Items & File Claims |

---

## 🧪 Automated Testing & Verification

The project includes an end-to-end automated test suite verifying 19 test cases including:
1. IndexedDB schema initialization and realistic seeding.
2. User authentication, password verification, and registration.
3. Category CRUD and active/inactive filtering.
4. Item queries, category filtering, and keyword search.
5. Found item reporting with multiple photos, date, and location persistence.
6. Compulsory unique secret proof validation (minimum 5 characters).
7. Prevention of founder claiming own reported item.
8. Privacy filtering (hiding secret proofs from unauthorized users).
9. Admin claim approval and automated notification dispatch.
10. Claimant private contact and address submission.
11. Admin official collection location assignment.
12. Final handover confirmation and status transition to `Returned` (`status: 2`).
13. Prevention of new claims on returned items.
14. Claim rejection workflow, reason logging, and item preservation.

### Running the Test Suite in Headless Chrome:
```bash
node run-tests.js
```
Expected output:
```
Server listening on 8080, report on 5500
Launching headless Chrome...
[PASS] Step 1 ... [PASS] Step 19
FINAL REPORT: SUCCESS_ALL_19_TESTS_PASSED
>>> ALL TEST CASES PASSED SUCCESSFULLY! <<<
```

Or open `http://localhost:8080/test.html` directly in any web browser to view the interactive test runner table.
