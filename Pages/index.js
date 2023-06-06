let tbody = document.getElementById("tableBody");
const url = 'http://localhost:3000/elements';

/* Fetches all objects from the API */
async function fetchAllData() {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

/* Fetches a specific object from the API */
async function fetchObjectData(id) {
    let urlFiltered = `http://localhost:3000/elements?id=${id}`;
    const response = await fetch(urlFiltered);
    const data = await response.json();
    return data;
}

/* Puts a specific object (and logs the new object to the console) */
async function putObjectData(id, modifiedObject) {
    let urlSpecific = `http://localhost:3000/elements/${id}`;
    fetch(urlSpecific, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(modifiedObject)
    })
        .then(response => response.json())
        .then(data => console.log(data))
}

/* Builds the table using one row per object which is returned from the API call */
async function buildTable() {
    try {
        const response = await fetchAllData();
        response.map((data, index) => {
            let row = buildRow(data, index);
            tbody.append(row);
            handleResolveClick(row);
            handleBlockClick(row, data.id);
        });
    }
    catch (error) {
        console.log('Fetch Error', error);
    }
}

/* Uses a HTML template to construct a table row for the object */
function buildRow({ id, state, payload }, index) {
    let row = document.createElement('tr');
    row.setAttribute("id", index);
    row.innerHTML = `<tr><td>${id}</td>
    <td>${state}</td>
    <td>${payload.reportType}</td>
    <td>${payload.message}</td>
    <td><button id='blockButton'>Block</button></td>
    <td><button id='resolveButton'>Resolve</button></td></tr>`;
    return row;
}

/* When the resolve button is clicked, the state of the row in the table is change to 'RESOLVED' (only front end changes) */
function handleResolveClick(row) {
    let resolveButton = row.querySelectorAll('button')[1];
    resolveButton.addEventListener('click', () => {
        row.cells[1].textContent = "RESOLVED";
    });
}

/* When the block button is clicked, the state of the object is changed to "CLOSED" (only backend changes) */
async function handleBlockClick(row, id) {
    let blockButton = row.querySelector('button');
    blockButton.addEventListener('click', () => {
        fetchObjectData(id)
            .then(data => {
                const objectToUpdate = data[0];
                objectToUpdate.state = "CLOSED";
                return objectToUpdate;
            })
            .then(modifiedObject => {
                putObjectData(modifiedObject.id, modifiedObject);
            })
    })
};

buildTable()