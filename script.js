let pyodide;

// Initialize Python runtime
async function initPyodideAndPackages() {
  const status = document.getElementById("status");
  const processBtn = document.getElementById("process-btn");

  status.innerText = "⏳ Preparing Python environment...";
  processBtn.disabled = true;

  try {
    // Load Pyodide
    pyodide = await loadPyodide();

    // Install pandas and openpyxl via micropip
    await pyodide.runPythonAsync(`
import micropip
await micropip.install(["pandas", "openpyxl"])
`);

    status.innerText = "✅ Ready to process files.";
    processBtn.disabled = false;
  } catch (e) {
    status.innerText = "❌ Failed to initialize Python.";
    console.error("Pyodide init error:", e);
  }
}

initPyodideAndPackages();

// Handle processing
document.getElementById("process-btn").addEventListener("click", async () => {
  if (!pyodide) {
    alert("Please wait until the Python environment is ready.");
    return;
  }

  const fileInput = document.getElementById("file-upload");
  if (!fileInput.files.length) {
    alert("Please upload a file first!");
    return;
  }

  const file = fileInput.files[0];
  const arrayBuffer = await file.arrayBuffer();

  // Show 🦷 spinner
  document.getElementById("loader").style.display = "block";
  document.getElementById("status").innerText = "";

  try {
    // Write Excel file to virtual FS
    pyodide.FS.writeFile(file.name, new Uint8Array(arrayBuffer));

    // Run your Python logic
    const pythonCode = await (await fetch("app.py")).text();
    await pyodide.runPythonAsync(pythonCode + `\nprocess_excel("${file.name}")`);

    // Read result
    const data = pyodide.FS.readFile("summary_hours.xlsx", { encoding: "binary" });

    // Create downloadable file
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary_hours.xlsx";
    a.click();

    // Hide loader, show success
    document.getElementById("loader").style.display = "none";
    document.getElementById("status").innerText = "✅ Done! File downloaded.";
  } catch (err) {
    document.getElementById("loader").style.display = "none";
    document.getElementById("status").innerText = "❌ Error: " + err;
    console.error("Processing error:", err);
  }
});