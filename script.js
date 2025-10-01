let pyodide;

// Initialize Pyodide safely
async function initPyodideAndPackages() {
  const status = document.getElementById("status");
  const processBtn = document.getElementById("process-btn");

  status.innerText = "";
  processBtn.disabled = true;

  try {
    pyodide = await loadPyodide();
    await pyodide.loadPackage(["pandas", "openpyxl", "micropip"]);

    status.innerText = "✅ Ready to process files.";
    processBtn.disabled = false;
  } catch (e) {
    status.innerText = "⚠️ Failed to load Python runtime.";
    console.error(e);
  }
}

initPyodideAndPackages();

document.getElementById("process-btn").addEventListener("click", async () => {
  if (!pyodide) {
    alert("Please wait until the Python runtime finishes loading.");
    return;
  }

  const fileInput = document.getElementById("file-upload");
  if (!fileInput.files.length) {
    alert("Please upload a file first!");
    return;
  }

  const file = fileInput.files[0];
  const arrayBuffer = await file.arrayBuffer();

  // Show the spinning tooth
  document.getElementById("loader").style.display = "block";
  document.getElementById("status").innerText = "";

  try {
    // Write the file into Pyodide's virtual filesystem
    pyodide.FS.writeFile(file.name, new Uint8Array(arrayBuffer));

    // Run your Python script
    const pythonCode = await (await fetch("app.py")).text();
    await pyodide.runPythonAsync(pythonCode + `\nprocess_excel("${file.name}")`);

    // Get the processed Excel file
    const data = pyodide.FS.readFile("summary_hours.xlsx", { encoding: "binary" });

    // Download the result
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary_hours.xlsx";
    a.click();

    // Hide spinner + show success
    document.getElementById("loader").style.display = "none";
    document.getElementById("status").innerText = "✅ Done! File downloaded.";
  } catch (err) {
    document.getElementById("loader").style.display = "none";
    document.getElementById("status").innerText = "❌ Error: " + err;
    console.error(err);
  }
});