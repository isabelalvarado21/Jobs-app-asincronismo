const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

// reusable functions

const hideElement = (selector) => selector.classList.add("hidden")
const showElement = (selector) => selector.classList.remove("hidden")

const capitalize = (word) => {return word[0].toUpperCase() + word.slice(1);}

// var

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
    for (const {name, brand, location, id} of jobs) {
        $("#container-careers").innerHTML += `
        <div class="w-1/5 p-8 border-2 border-[#ECC8AE] m-4">
            <div>
                <h2 class="text-2xl text-[#1A3A3A] font-bold">${name}</h2>
                <h4 class="text-xl font-medium text-[#ECC8AE]">${brand}</h4>
                <p><i class="fa-solid fa-location-dot"></i>${location}</p>
                <button class="btn-details" onclick="getJob(${id})">Ver detalles</button>
            </div>
        </div>`  
    }
    for (const btn of $$(".btn-details")) {
        btn.addEventListener("click", () => {
            hideElement($("#section-careers"))
            showElement($("#card-details"))
           
        })
    }
}

const showJobDetail = (job) =>{
    const {name, description, location, category, seniority, image, brand, id} = job
    $("#card-details").innerHTML = `
    <div class=" w-[800px]">
                <div class="flex p-8 border-2 border-[#ECC8AE] m-4">
                    <div>
                        <img src="${image}" alt="">
                    </div>
                    <div>
                        <h1 class="text-2xl text-[#1A3A3A] font-bold">${name}</h1>
                        <p>${brand}</p>
                        <p><i class="fa-solid fa-location-dot"></i>${location}</p>
                        <p>${category}</p>
                        <p>${description}</p>
                        <p>${seniority}</p>
                        <div>
                        <button class="btn-edit" data-id="${id}">Editar</button>
                        <button class="btn-delete" data-id="${id}">Eliminar</button>
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
$("#show-careers").addEventListener("click", () => {
    window.location.href = "index.html"
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





 




