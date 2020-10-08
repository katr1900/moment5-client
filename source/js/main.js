// Länk till webbtjänsten
const serviceUrl = "http://localhost:8080/moment5/index.php";

// Hämtar alla kurser
function loadData() {
  fetch(serviceUrl, { 
  mode: "cors", // Använd CORS
  method: "GET",
  credentials: "omit" })
  .then(response => response.json())
  .then(data => {
    const table = document.getElementById("courses");

    // För varje kurs skapa en ny rad i tabellen och fyll den med info om kursen
    data.forEach(course => {
      const tr = document.createElement("tr");

      const code = document.createElement("td");
      code.textContent = course.code;
      tr.appendChild(code);

      const name = document.createElement("td");
      name.textContent = course.name;
      tr.appendChild(name);

      const progression = document.createElement("td");
      progression.textContent = course.progression;
      tr.appendChild(progression);

      const coursesyllabus = document.createElement("td");
      const courseLink = document.createElement("a");
      courseLink.textContent = "Kursplan";
      courseLink.setAttribute("href", course.courseSyllabus);
      courseLink.setAttribute("target", "_blank");
      coursesyllabus.appendChild(courseLink);
      tr.appendChild(coursesyllabus);

      table.appendChild(tr);

      
    });
  })
  .catch((err) => {
      console.log('fetch Error :-S', err)
  });
}
loadData();

// Lyssnare för submit av formuläret
document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault(); // Hindra formuläret från att skickas automatiskt

  const data = {
    code: document.getElementsByName("code")[0].value,
    name: document.getElementsByName("name")[0].value,
    progression: document.getElementsByName("progression")[0].value,
    coursesyllabus: document.getElementsByName("coursesyllabus")[0].value,
  };

  // Skicka data med fetch i JSON-format
  fetch(serviceUrl, {
    method: "POST",
    mode: "cors",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
  })
  .then(() => {
    location.reload(); // Ladda om sidan när lyckat svar (200) kommer från webbtjänsten
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});


  