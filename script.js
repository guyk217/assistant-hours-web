let pyodide;

async function initPyodideAndPackages() {
  const status = document.getElementById("status");
  const processBtn = document.getElementById("process-btn");

  status.innerText = "⏳ Preparing Python environment...";
  processBtn.disabled = true;

  try {
    // Load Pyodide itself
    pyodide = await loadPyodide();

    // Load core built-in packages
    await pyodide.loadPackage(["pandas", "micropip"]);

    // Install openpyxl using micropip
    await pyodide.runPythonAsync(`
import micropip
await micropip.install("openpyxl")
`);

    status.innerText = "✅ Ready to process files.";
    processBtn.disabled = false;
  } catch (e) {
    status.innerText = "❌ Failed to load Python environment.";
    console.error(e);
  }
}

initPyodideAndPackages();

document.getElementById("process-btn").addEventListener("click", async () => {
  if (!pyodide) {
    alert("Please wait until the Python environment finishes loading.");
    return;
  }

  const fileInput = document.getElementById("file-upload");
  if (!fileInput.files.length) {
    alert("Please upload a file first!");
    return;
  }

  const file = fileInput.files[0];
  const arrayBuffer = await file.arrayBuffer();

  // Show spinning tooth 🦷
  document.getElementById("loader").style.display = "block";
  document.getElementById("status").innerText = "";

  try {
    // Write uploaded file into Pyodide virtual FS
    pyodide.FS.writeFile(file.name, new Uint8Array(arrayBuffer));

    // Load and run your Python logic
    const pythonCode = await (await fetch("app.py")).text();
    await pyodide.runPythonAsync(pythonCode + `\nprocess_excel("${file.name}")`);

    // Retrieve processed Excel
    const data = pyodide.FS.readFile("summary_hours.xlsx", { encoding: "binary" });

    // Create downloadable blob
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary_hours.xlsx";
    a.click();

    // Hide loader + show success
    document.getElementById("loader").style.display = "none";
    document.getElementById("status").innerText = "✅ Done! File downloaded.";
  } catch (err) {
    document.getElementById("loader").style.display = "none";
    document.getElementById("status").innerText = "❌ Error: " + err;
    console.error(err);
  }
});