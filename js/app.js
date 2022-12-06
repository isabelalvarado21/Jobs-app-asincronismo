const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

// reusable functions

const hideElement = (selector) => selector.classList.add("hidden")
const showElement = (selector) => selector.classList.remove("hidden")

const capitalize = (word) => {return word[0].toUpperCase() + word.slice(1);}

// let

let isSubmit = false;
let arrCategories = [];
let arrLocations = [];
let arrSeniorities = []

//methods

//GET
const getJobs = () => {
    fetch("https://6384c7c63fa7acb14f00609e.mockapi.io/jobs")
        .then(res => res.json())
        .then(data => {
            showJobs(data)
            arraysToFilters(data)
            showFilterCategories()
            showFilterLocations()
            showFilterSeniorities()
        })
}
getJobs()

const getJob = (jobId) => {
    fetch(`https://6384c7c63fa7acb14f00609e.mockapi.io/jobs/${jobId}`)
        .then(res => res.json())
        .then(data => showJobDetail(data))
}

const getJobToEdit = (jobId) => {
    fetch(`https://6384c7c63fa7acb14f00609e.mockapi.io/jobs/${jobId}`)
        .then(res => res.json())
        .then(data => populateForm(data))

}

const getJobFilter = (filter, select) => {
    fetch(`https://6384c7c63fa7acb14f00609e.mockapi.io/jobs/?${filter}=${select}`)
        .then(res => res.json())
        .then(data => { 
            $("#container-careers").innerHTML="";
            showJobs(data)})
}

//POST
const registerJob = () => {
    fetch("https://6384c7c63fa7acb14f00609e.mockapi.io/jobs",{
        method: "POST", 
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(saveNewJob())
    }).finally(() => window.location.href = "index.html")
}

//PUT
const editJob = (jobId) => {
    fetch(`https://6384c7c63fa7acb14f00609e.mockapi.io/jobs/${jobId}`,{
        method: "PUT", 
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(saveNewJob())
    }).finally(() => window.location.href = "index.html")
}

//DELETE
const deleteJob = (jobId) => {
    fetch(`https://6384c7c63fa7acb14f00609e.mockapi.io/jobs/${jobId}`,{
        method: "DELETE"
    }).finally(() => window.location.href = "index.html")
}

// manipulation of dom

const showJobs = (jobs) => {
    setTimeout(() => {
        $("#spiner").innerHTML =""
        for (const {name, brand, location, id} of jobs) {
            $("#container-careers").innerHTML += `
            <div class="w-1/5 p-8 border-2 border-[#773344] m-4">
                <div class="space-y-4">
                    <h2 class="text-2xl text-[#0B0014] font-bold text-center">${name}</h2>
                    <h4 class="text-xl font-medium text-[#773344] text-center">${brand.toUpperCase()}</h4>
                    <p class=""><i class="fa-solid fa-location-dot text-red-700"></i> ${location}</p>
                    <button class="btn-details px-4 py-1 rounded-md border-2 border-[#1A3A3A]" onclick="getJob(${id})">Ver detalles</button>
                </div>
            </div>`  
        }
        for (const btn of $$(".btn-details")) {
            btn.addEventListener("click", () => {
                hideElement($("#section-careers"))
                showElement($("#card-details"))
               
            })
        }

    }, 2000)
     
}

const showJobDetail = (job) =>{
   
        const {name, description, location, category, seniority, image, brand, id} = job
    $("#card-details").innerHTML = `
    <div class=" w-[800px]">
                <div class="flex p-8 border-2 border-[#773344] m-4">
                    <div class="w-[500px] mt-20">
                        <img src="${image}" alt="" class="w-[200px] h-[100px]">
                    </div>
                    <div class="space-y-4">
                        <h1 class="text-2xl text-[#0B0014] font-bold">${name.toUpperCase()}</h1>
                        <h4 class="text-xl font-medium text-[#773344]">${brand.toUpperCase()}</h4>
                        <p class="">Ubicación:  <i class="fa-solid fa-location-dot text-red-700"></i> <span class="font-semibold">${location}</span></p>
                        <p>Categoría del puesto: <span class="font-semibold">${category}</span></p>
                        <p>${description}</p>
                        <p>Experiencia: <span class="font-semibold">${seniority}</span></p>
                        <div>
                        <button class="btn-edit text-white px-4 py-1 rounded-md  bg-green-700" data-id="${id}">Editar</button>
                        <button class="btn-delete text-white px-4 py-1 rounded-md bg-red-700" data-id="${id}">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
     `
     for (const btn of $$(".btn-edit")) {
        btn.addEventListener("click", () => {
            isSubmit = false
            hideElement($("#submit"))
            const jobId = btn.getAttribute("data-id")
            $("#submit-edit").setAttribute("data-id", jobId)
            getJobToEdit(jobId)

        })
    }
    for (const btn of $$(".btn-delete")) {
        btn.addEventListener("click", () => {
            hideElement($("#card-details"))
            showElement($("#alert-delete"))
            const jobId = btn.getAttribute("data-id")
            $("#submit-delete").setAttribute("data-id", jobId)
        })
    }
        
    ;
    
}

const populateForm = (job) => {
    hideElement($("#card-details"))
    showElement($("#form"))
        $("#title").value = job.name
        $("#description").value = job.description
        $("#location").value = job.location,
        $("#category").value = job.category,
        $("#seniority").value = job.seniority,
        $("#img").value = job.image
        $("#brand").value = job.brand
}

const showFilterCategories = () => {
    for (const category of arrCategories) {
        $("#select-category").innerHTML += `
        <option value="${category}">${category}</option>
        `  
    }
}
const showFilterLocations = () => {
    for (const location of arrLocations) {
        $("#select-location").innerHTML += `
        <option value="${location}">${location}</option>
        `
    } 
}
const showFilterSeniorities = () => {
    for (const seniority of arrSeniorities) {
        $("#select-seniority").innerHTML += `
        <option value="${seniority}">${seniority}</option>
        `  
    }
}

// functions

const saveNewJob = () => {
    return {
        name: capitalize($("#title").value),
        description: capitalize($("#description").value),
        location: capitalize($("#location").value),
        category: capitalize($("#category").value),
        seniority: capitalize($("#seniority").value),
        image: $("#img").value,
        brand: $("#brand").value,
    }
}

const arraysToFilters = (jobs) => {
    for (const job of jobs) {
        
        if (!arrCategories.includes(job.category)) {
            arrCategories.push(job.category)
        }
        if (!arrLocations.includes(job.location)) {
            arrLocations.push(job.location)  
        }
        if (!arrSeniorities.includes(job.seniority)) {
            arrSeniorities.push(job.seniority)  
        }
    }
}

// events
$("#btn-refresh").addEventListener("click", () => {
    window.location.href = "index.html"
})
$("#show-careers").addEventListener("click", () => {
    showElement($("#section-careers"))
    hideElement($("#alert-delete"))
    hideElement($("#card-details"))
    hideElement($("#submit-edit"))
    hideElement($("#form"))
})

$("#btn-cancel").addEventListener("click", () => {
    hideElement($("#alert-delete"))
    showElement($("#section-careers"))
})

$("#addJob").addEventListener("click", () => {
    hideElement($("#section-careers"))
    showElement($("#form"))
    hideElement($("#card-details"))
    hideElement($("#submit-edit"))
    hideElement($("#alert-delete"))
    showElement($("#submit"))
    $("#form-").reset()
    isSubmit = true
})

$("#form").addEventListener("submit", (e) => {
    e.preventDefault()
    if (isSubmit) {
        registerJob()
    } else {
        const jobId = $("#submit-edit").getAttribute("data-id")
        editJob(jobId)
    }  
})

$("#submit-delete").addEventListener("click", () => {
    const jobId = $("#submit-delete").getAttribute("data-id")
    deleteJob(jobId)
})

$("#select-location").addEventListener("change", (e) => {
    let locationSelect = e.target.value;
    getJobFilter("location", locationSelect)
    
})

$("#select-category").addEventListener("change", (e) => {
    let categorySelect = e.target.value;
    getJobFilter("category", categorySelect)
})

$("#select-seniority").addEventListener("change", (e) => {
    let senioritySelect = e.target.value;
    getJobFilter("seniority", senioritySelect)
    
})





 




