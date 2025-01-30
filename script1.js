function allowDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.add("drag-over");
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.outerHTML);
    setTimeout(() => event.target.style.display = "none", 0);
}

function drop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove("drag-over");
    let data = event.dataTransfer.getData("text");
    event.currentTarget.innerHTML + data;

    let draggedElement = document.createElement("div");
    draggedElement.innerHTML = data;
    let newElement = draggedElement.firstElementChild;
    newElement.style.display = "block";
    newElement.setAttribute("draggable", "true");
    newElement.setAttribute("ondragstart", "drag(event)");
    event.currentTarget.appendChild(newElement);
}
  

async function askQuestion() {
  const question = document.getElementById("question").value;
  const responseDiv = document.getElementById("response");
  responseDiv.innerHTML = "Processing your question...";

  try {
    const response = await fetch("http://localhost:3001/ask-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();
    responseDiv.innerHTML = `<strong>Response:</strong> ${data.response}`;
  } catch (error) {
    console.error("Error:", error);
    responseDiv.innerHTML = "Error processing your question.";
  }
}

