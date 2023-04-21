// ! ------------- COMPONENTS
const mainComponent = () => `
<header>
	<nav>
		<ul>
      <li class="logo">Main</li>
	  	<li class="allStudents">▼ All students</li>
			<li class="searchStudent">▼ Search student</li>
			<li class="activeStudent">▼ Active students</li>
			<li class="graduatedStudent">&#x2714; Graduated students</li>
			<li class="addNewStudent">+ Add student</li>
		</ul>
	</nav>
</header>
<main>
</main>
`
const startingComponent = () => `
<h1>Hello World!<br>It's the main page!</h1>

`
const formComponent = () => `
<form id="searchId">
  <input type="text" placeholder="Type in student ID" name="studentId">
  <button>search</button>
</form>
<section class="result">
</section>
`
const addNewFormComponent = () => `
<form id="addNew">
  <input type="text" placeholder="Type in student name" name="studentName">
  <button>add student</button>
<p class ="feedback"></p>
</form>
`


// !--------------- ONLOADING 
// header betöltése
const rootElement = document.querySelector('#root')
rootElement.insertAdjacentHTML('beforeend', mainComponent())

// főoldal betöltése
const mainElement = document.querySelector('main')
mainElement.insertAdjacentHTML('beforeend', startingComponent())


//! --------------- DOM MANIPULATION ON MENU CLICK
// 00 Codecool menü - vissza a főoldalra
const mainMenu = document.querySelector('.logo')
mainMenu.addEventListener('click', () => {
  mainElement.innerHTML = startingComponent();
})


// 01 All students menü - minden adat betöltése
const allStudentsMenu = document.querySelector('.allStudents')
allStudentsMenu.addEventListener('click', () => {
  mainElement.innerHTML = "<h2>All students</h2>"
  readingStudents();
})

// 02 Search student by ID menü - adat lekérdezés ID alapján
const searchStudentMenu = document.querySelector('.searchStudent')
searchStudentMenu.addEventListener('click', () => {

  mainElement.innerHTML = "<h2>Search student</h2>"
  mainElement.insertAdjacentHTML('beforeend', formComponent())
  
  const searchIdEventListener = () => {
    const searchIdFormElement = document.querySelector('#searchId')
    searchIdFormElement.addEventListener('submit', (e)=> {
      e.preventDefault();

      const id = document.querySelector(`input[type='text']`).value
      searchStudentById(id);
    })
  }

  searchIdEventListener()
})


// 03 Active students menü - minden active student adatának betöltése
const activeStudentsMenu = document.querySelector('.activeStudent')
activeStudentsMenu.addEventListener('click', () => {
  mainElement.innerHTML = "<h2>Active students</h2>"
  searchStudentByStatus('active');
})

// 04 Graduated students menü - minden passzív student adatának betöltése
const graduatedStudentsMenu = document.querySelector('.graduatedStudent')
graduatedStudentsMenu.addEventListener('click', () => {
  mainElement.innerHTML = "<h2>Active students</h2>"
  searchStudentByStatus('finished');
})

// 05 Add new student menü - form kitöltése után adatbázis bővítése
const addNewStudentMenu = document.querySelector('.addNewStudent')
addNewStudentMenu.addEventListener('click', () => {

  mainElement.innerHTML = "<h2>Add new student</h2>"
  mainElement.insertAdjacentHTML('beforeend', addNewFormComponent())
  
  const addNewStudentEventListener = () => {
    const addNewFormElement = document.querySelector('#addNew')
    addNewFormElement.addEventListener('submit', (e) => {
      e.preventDefault();
      addNewStudent();
    })
  }
  addNewStudentEventListener()
})




//! --------------- FETCHING DATA
// Reading all student data - giving back only their //*NAME
const readingStudents = () => {
  fetch(`http://127.0.0.1:9000/api/students`) // fontos, hogy itt az endpoint url-t adjuk meg
  .then(response => {
    console.log("This is the fetch response: ", response)
    if (response.status === 201) {
      console.log('Fetch is successful')
    }
    return response.json()
  })
  .then(responseJson => {
    console.log("Data from the first then:", responseJson)
    const data = responseJson

    let html = ""
    data.forEach(element => {
      html = html+`
      <div>
        <p>${element.name}</p>
      </div>
      `
    });
    mainElement.insertAdjacentHTML('beforeend', html)
  })
}  

// Reading student data by ID - giving back only //*ONE STUDENT BY ID

const searchStudentById = (id) => {
  fetch(`http://127.0.0.1:9000/api/students/${id}`) // fontos, hogy itt az endpoint url-t adjuk meg
  .then(response => {
    console.log("This is the fetch response: ", response)
    if (response.status === 404) {
      const resultSection = document.querySelector('.result')
      resultSection.innerHTML =`
      <p class ="feedback">No student with this ID</p>
      `
    }
    if (response.status === 418) {
      const resultSection = document.querySelector('.result')
      resultSection.innerHTML =`
      <p class ="feedback">ID must be a number!</p>
      `
    }
    
    return response.json()
  })
  .then(responseJson => {
    console.log("Data from the first then:", responseJson)
    const data = responseJson

    let status = 'graduated';
    if(data.status){
      status = 'active'
    }
    const resultSection = document.querySelector('.result')
    resultSection.innerHTML =`
      <div class="searchResult">
        <p>id: ${data.id}</p>
        <p>name: ${data.name}</p>
        <p>status: ${status}</p>
      </div>
    `;
  })
  .catch( err => console.log(err)
  )
}

// Reading student data by Status on 2 endpoints: 'active' Student status = true  /  'finished' Student status = false
const searchStudentByStatus = (studentStatus) => {
  fetch(`http://127.0.0.1:9000/api/status/${studentStatus}`) // fontos, hogy itt az endpoint url-t adjuk meg
  .then(response => {
    console.log("This is the fetch response: ", response)
    if (response.status === 201) {
      console.log('Fetch is successful')
    }
    return response.json()
  })
  .then(responseJson => {
    console.log("Data from the first then:", responseJson)
    const data = responseJson

    let html = ""
    data.forEach(element => {
      html = html+`
      <div class="searchResult">
        <p>name: ${element.name}</p>
        <p>id: ${element.id}</p>
      </div>
      `
    });

      mainElement.insertAdjacentHTML('beforeend', html)
  })
  .catch( err => console.log(err)
  )
}

// Adding new active student into the database
const addNewStudent = () => {

  const student = {
    name: document.querySelector('input[name="studentName"]').value,
    status: true,
  }  
  fetch(`http://127.0.0.1:9000/api/students/new`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(student),
  })
  .then(response => {
    if(response.status === 200){
      document.querySelector('.feedback').innerHTML = "Student saved"
    } else {
      document.querySelector('.feedback').innerHTML = "Something went wrong. Try again!"
    }
    return response.json()
  })
  .catch(err => {
    document.querySelector('.feedback').innerHTML = "Problem occured. Try again later."
  })
}
