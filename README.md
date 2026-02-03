# 🦷 DentaHours - Dental Office Hours Calculator

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-yellow.svg" alt="JavaScript">
  <img src="https://img.shields.io/badge/GitHub%20Pages-Ready-green.svg" alt="GitHub Pages">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
</p>

<p align="center">
  A beautiful web application for dental offices to calculate and summarize assistant-doctor working hours from Excel spreadsheets.
</p>

<p align="center">
  <strong>🔒 100% Client-Side - Your data never leaves your device!</strong>
</p>

---

## ✨ Features

- 📊 **Excel Processing** - Supports both `.xls` and `.xlsx` formats
- 🎨 **Beautiful UI** - Modern, dental-themed interface with smooth animations
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🌙 **Dark Mode** - Automatic dark mode support
- ⚡ **Instant Processing** - All calculations happen in your browser
- 🔒 **Privacy First** - No server, no uploads, your data stays local
- 🌐 **RTL Support** - Built for Hebrew language documents

## 🚀 Live Demo

**[Try it now on GitHub Pages →](https://yourusername.github.io/dentist-hours-calculator/)**

## 📋 How to Use

1. Open the website
2. Drag & drop your Excel file (or click to browse)
3. Click "Calculate Hours"
4. Download your summary!

## 📁 Excel File Format

The application expects Excel files with the following structure:

### Table Markers
- **Start marker**: Row containing "כניסה" (Entry)
- **End marker**: Row containing "חתימה" (Signature)

### Table Structure
| Column 0 | Column 1 | Column 2 |
|----------|----------|----------|
| כניסה    | שרה לוי   | ...      |
| ד"ר כהן  | 4.5      | ...      |
| ד"ר לוי  | 3.0      | ...      |
| חתימה    | ...      | ...      |

- **Row 0, Column 1**: Assistant name
- **Column 0** (from row 1): Doctor names
- **Column 1** (from row 1): Hours (decimal or HH:MM format)

### Output

The app generates a summary Excel file with:
- Assistant name
- Doctor name  
- Total hours (summed and rounded to 2 decimal places)

## 🛠️ Deploy Your Own

### Option 1: GitHub Pages (Recommended)

1. **Fork this repository**

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Set Source to "main" branch
   - Set folder to "/ (root)"
   - Save

3. **Access your site**
   ```
   https://yourusername.github.io/dentist-hours-calculator/
   ```

### Option 2: Any Static Host

Just upload `index.html` to any static hosting service:
- Netlify
- Vercel
- Cloudflare Pages
- Amazon S3
- Any web server

## 📁 Project Structure

```
dentist-hours-calculator/
├── index.html      # Everything in one file!
├── README.md       # Documentation
└── LICENSE         # MIT License
```

Yes, it's just **one file**! The HTML includes:
- All CSS styles
- All JavaScript logic
- SheetJS library (CDN)

## 🔧 Technology

- **SheetJS (xlsx)** - Excel file reading/writing
- **Pure JavaScript** - No framework dependencies
- **CSS3** - Modern animations and dark mode
- **Google Fonts** - Outfit & Space Mono

## 🔒 Privacy & Security

- ✅ All processing happens in your browser
- ✅ No data is sent to any server
- ✅ No cookies or tracking
- ✅ No account required
- ✅ Works offline after first load

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for dental professionals
- Powered by [SheetJS](https://sheetjs.com/)
- Tooth emoji courtesy of Unicode 🦷

---

<p align="center">
  Made with 💙 for dental offices everywhere
</p>
