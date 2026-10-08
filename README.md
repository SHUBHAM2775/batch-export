# Batch Export Console

A mini-application for managing batch image exports. It allows users to configure global settings via a dynamic schema, upload a set of images, and monitor their processing status in real-time.

## Features
- **Schema-driven settings**: UI is generated from a backend JSON schema, allowing fields to be added or modified without frontend changes.
- **Row repeater**: Dynamic item list with support for adding, removing, and reordering images (limited to 2–6 items).
- **Async processing**: Backend simulates independent row progress with varying speeds and a random failure rate.
- **Live polling**: Client-side polling every 3 seconds with per-row progress and status updates.
- **Per-row retry**: Ability to restart only failed items without resetting the entire batch.
- **Client-side resizing**: Images are resized to a maximum edge of 2048px using the Canvas API before submission.
- **Theming & Responsive UI**: Support for light/dark themes and a mobile-friendly layout.

## Running Locally

### Backend
```bash
cd server
npm install
npm run dev
```
Starts on `http://localhost:4000`.

### Frontend
```bash
cd client
npm install
npm run dev
```
Starts on the port provided by Vite.

## Key Decisions

### 1. Client-side Image Resizing
I used the Canvas API to resize images to a max edge of 2048px immediately upon upload.

**Why:** Uploading raw high-res photos is slow and wastes bandwidth. Resizing on the client reduces the payload size and ensures the "server" receives images in a predictable range.

**Trade-off:** It adds a small amount of processing time on the main thread during the upload phase, which could cause slight lag with very large files.

### 2. Schema-Driven UI Rendering
I built a `FieldRenderer` that maps schema types (text, select, toggle, etc.) to specific inputs rather than hardcoding the form.

**Why:** Export requirements often change. By driving the UI from a JSON config, we can add new settings or change validation rules on the backend without needing a new frontend deployment.

**Trade-off:** It introduces a layer of abstraction. If a field ever needs highly specialized, non-standard behavior, the generic renderer becomes harder to maintain.

### 3. URL-Based Batch Persistence
I store the `batchId` in the URL query string (`?batch=...`) when a batch is started.

**Why:** Without this, refreshing the page would lose the current batch state and return the user to the home screen. Using the URL allows the app to resume polling the specific batch automatically.

**Trade-off:** It exposes the internal batch ID in the URL, which is fine for this project but would need proper authorization in a production app.

## If I Had More Time

I would move the image resizing logic into a **Web Worker**. Currently, the Canvas processing happens on the main thread. For batches with several large images, this could cause the UI to freeze momentarily. A worker would keep the interface responsive while the images are being processed in the background.

## Time Taken

Approximately 15 hours, including implementation, debugging and testing.
