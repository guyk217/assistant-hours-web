let _pyodidePromise;

function getPyodideReady() {
  if (!_pyodidePromise) {
    _pyodidePromise = (async () => {
      const status = document.getElementById("status");
      try {
        status.innerText = "⏳ Initializing Python environment...";
        console.log("Loading Pyodide...");
        const pyodide = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
        });

        console.log("Installing pandas + dependencies...");
        // Load compiled package and install pure-Python libs
        await pyodide.loadPackage("pandas");
        await pyodide.runPythonAsync(`
import micropip
await micropip.install(["openpyxl", "xlrd"])
        `);

        console.log("Pyodide ready ✅");
        status.innerText = "✅ Ready to process files.";
        return pyodide;
      } catch (err) {
        console.error("Initialization failed:", err);
        status.classList.add("error");
        status.innerText = "Failed to initialize Python.";
        throw err;
      }
    })();
  }
  return _pyodidePromise;
}

const uploadBox = document.getElementById("upload-box");
const fileInput = document.getElementById("file-upload");
const fileNameDisplay = document.getElementById("file-name");
const processBtn = document.getElementById("process-btn");
const loader = document.getElementById("loader");
const status = document.getElementById("status");

uploadBox.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadBox.classList.add("dragover");
});

uploadBox.addEventListener("dragleave", () => {
  uploadBox.classList.remove("dragover");
});

uploadBox.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadBox.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file) {
    fileInput.files = e.dataTransfer.files;
    showFileName(file);
  }
});

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) showFileName(file);
});

function showFileName(file) {
  fileNameDisplay.textContent = `📄 ${file.name}`;
  processBtn.disabled = false;
}

processBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file first.");
    return;
  }

  loader.style.display = "block";
  status.innerText = "";
  processBtn.disabled = true;

  try {
    const pyodide = await getPyodideReady();
    const arrayBuffer = await file.arrayBuffer();
    pyodide.FS.writeFile(file.name, new Uint8Array(arrayBuffer));

    const pythonCode = await (await fetch("app.py")).text();
    await pyodide.runPythonAsync(pythonCode + `\nprocess_excel("${file.name}")`);

    const data = pyodide.FS.readFile("summary_hours.xlsx", { encoding: "binary" });
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary_hours.xlsx";
    a.click();

    status.classList.remove("error");
    status.innerText = "✅ Done! File downloaded.";
  } catch (err) {
    console.error("Processing failed:", err);
    status.classList.add("error");
    status.innerText = "Processing failed.";
  } finally {
    loader.style.display = "none";
    processBtn.disabled = false;
  }
});