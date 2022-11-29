const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

// reusable functions

const hideElement = (selector) => selector.classList.add("hidden")
const showElement = (selector) => selector.classList.remove("hidden")

// var

let isSubmit = false

//methods

//GET
const getJobs = () => {
    fetch("https://6384c7c63fa7acb14f00609e.mockapi.io/jobs")
    .then(res => res.json())
    .then(data => showJobs(data))
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
        .then(data => {
            hideElement($("#card-details"))
            showElement($("#form"))
        $("#title").value = data.name
        $("#description").value = data.description
        $("#location").value = data.location,
        $("#category").value = data.category,
        $("#seniority").value = data.seniority,
        $("#img").value = data.image
        $("#brand").value = data.brand
        })

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
    fetch(`https://6384c7c63fa7acb14f00609e.mockapi.io/jobs${jobId}`,{
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

// functions

const saveNewJob = () => {
    return {
        name: $("#title").value,
        description: $("#description").value,
        location: $("#location").value,
        category: $("#category").value,
        seniority: $("#seniority").value,
        image: $("#img").value,
        brand: $("#brand").value,
    }
}

// events
$("#addJob").addEventListener("click", () => {
    hideElement($("#section-careers"))
    showElement($("#form"))
    hideElement($("#submit-edit"))
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

