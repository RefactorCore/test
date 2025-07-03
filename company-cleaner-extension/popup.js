document.getElementById("clean").addEventListener("click", () => {
  const input = document.getElementById("input").value;
  const lines = input.split("\n").filter(line => line.trim() !== "");

  import("./cleaner.js").then(module => {
    const cleanedNames = lines.map(line => module.cleanCompanyName(line));
    document.getElementById("result").innerHTML = cleanedNames.join("<br>");
  }).catch(err => {
    document.getElementById("result").innerText = "Error processing input.";
  });
});
