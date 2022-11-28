const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

//Method GET//

const getJobs = () => {
    fetch("https://6384c7c63fa7acb14f00609e.mockapi.io/jobs")
    .then(res => res.json())
    .then(data => showJobs(data))
}
getJobs()

const showJobs = (jobs) => {
    for (const job of jobs) {
        $("#container-careers").innerHTML += `
        <div class="w-1/5 p-8 border-2 border-[#ECC8AE] m-4">
            <div>
                <h2 class="text-2xl text-[#1A3A3A] font-bold">${job.name}</h2>
                <h4 class="text-xl font-medium text-[#ECC8AE]">${job.brand}</h4>
                <p><i class="fa-solid fa-location-dot"></i>${job.location}</p>
                <button>Ver detalles</button>
            </div>
        </div>`
        
    }
}
    