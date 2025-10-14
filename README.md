# Pro Image Converter

Created by **Wageh Zaiter**

A sleek and professional web application to convert images to different formats like WEBP, JPEG, and PNG while maintaining high quality. This tool is built with privacy in mind—all processing is done locally in your browser, ensuring your images are never uploaded to a server.

---

## ✨ Features

- **Multiple Format Support**: Convert your images to modern formats like WEBP, JPEG, and PNG.
- **Adjustable Quality**: Fine-tune the compression level to perfectly balance file size and visual quality.
- **Batch Processing**: Upload and convert multiple images at once.
- **Instant Previews**: See a live, side-by-side comparison of your original and converted images, complete with file size reduction stats.
- **Download All**: Conveniently download all your converted images in a single ZIP file.
- **Privacy First**: All conversions happen directly in your browser. Your images are never sent to a server.
- **Drag & Drop**: A modern, easy-to-use interface with drag-and-drop support for file uploads.
- **Fully Responsive**: A beautiful and functional design that works on all devices, from desktops to mobile phones.

## 🚀 Live Demo

(Link to your live demo here!)

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **Utilities**: JSZip for creating zip archives locally.

## ⚙️ How It Works

The image conversion process is handled entirely on the client-side using the HTML5 Canvas API.

1.  When an image is uploaded, it's loaded into an in-memory canvas element.
2.  The canvas content is then exported to a data blob with the selected format (`image/webp`, `image/jpeg`, etc.) and quality level.
3.  This blob is used to create an object URL, which is then displayed as a preview and used for downloads.
4.  This approach ensures that your private images are never sent over the network, providing maximum privacy and security.

## 📦 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/pro-image-converter.git
    cd pro-image-converter
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173` (or the port specified in your console).

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
