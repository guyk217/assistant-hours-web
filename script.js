let pyodide;

async function initPyodideAndPackages() {
  document.getElementById("status").innerText = "Loading Python runtime...";
  pyodide = await loadPyodide();
  await pyodide.loadPackage(["pandas", "openpyxl", "micropip"]);
  document.getElementById("status").innerText = "Ready.";
  document.getElementById("process-btn").disabled = false;
}

initPyodideAndPackages();

document.getElementById("process-btn").addEventListener("click", async () => {
  const fileInput = document.getElementById("file-upload");
  if (!fileInput.files.length) return alert("Please upload a file first!");

  const file = fileInput.files[0];
  const arrayBuffer = await file.arrayBuffer();

  // show spinning loader
  document.getElementById("loader").style.display = "block";
  document.getElementById("status").innerText = "";

  try {
    pyodide.FS.writeFile(file.name, new Uint8Array(arrayBuffer));
    const pythonCode = await (await fetch("app.py")).text();
    await pyodide.runPythonAsync(pythonCode + `\nprocess_excel("${file.name}")`);

    const data = pyodide.FS.readFile("summary_hours.xlsx", { encoding: "binary" });

    // download
    const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary_hours.xlsx";
    a.click();

    // hide loader, show status
    document.getElementById("loader").style.display = "none";
    document.getElementById("status").innerText = "✅ Done! File downloaded.";
  } catch (err) {
    document.getElementById("loader").style.display = "none";
    document.getElementById("status").innerText = "Error: " + err;
  }
});
