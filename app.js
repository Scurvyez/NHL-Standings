// Get the table headers
const headers = document.querySelectorAll("#teams-table th");
headers.forEach((header, index) => header.dataset.sortKey = index)


// Add a click event listener to each header
headers.forEach(header => {
    header.addEventListener("click", () => {
        // Get the table body
        const tableBody = document.querySelector("#teams-table tbody");
        // Get the rows
        const rows = [...tableBody.rows];

        // Determine the sort key and order based on the header clicked
        const sortKey = header.dataset.sortKey;
        let order = header.dataset.order === "asc" ? 1 : -1;

        // Sort the rows
        rows.sort((a, b) => {
            // Get the values to compare
            const aValue = a.cells[sortKey].textContent;
            const bValue = b.cells[sortKey].textContent;

            // Compare the values
            if (aValue < bValue) {
                return -1 * order;
            } else if (aValue > bValue) {
                return 1 * order;
            } else {
                return 0;
            }
        });

        // Clear the table body
        tableBody.innerHTML = "";

        // Add the sorted rows to the table body
        rows.forEach(row => {
            tableBody.appendChild(row);
        });

        // Update the order of the header clicked
        header.dataset.order = header.dataset.order === "asc" ? "desc" : "asc";
    });
});


// Get the filter input and the table body
const filterInput = document.querySelector("#filter-input");
const tableBody = document.querySelector("#teams-table tbody");

// Add an input event listener to the filter input
filterInput.addEventListener("input", event => {
    // Get the filter value
    const filterValue = event.target.value.toLowerCase();

    // Get the rows
    const rows = [...tableBody.rows];

    // Loop through the rows
    rows.forEach(row => {
        // Get the team cell
        const teamCell = row.cells[0];

        // Get the team value
        const teamValue = teamCell.textContent.toLowerCase();

        // Compare the filter value with the team value
        if (teamValue.includes(filterValue)) {
            // Show the row
            row.style.display = "table-row";
        } else {
            // Hide the row
            row.style.display = "none";
        }
    });
});

// Team filter input clearing button
const clearFilterBtn = document.getElementById("clear-filter-btn");
clearFilterBtn.addEventListener("click", () => {
    filterInput.value = "";
    // loop through the rows and show them
    [...tableBody.rows].forEach(row => row.style.display = "table-row")
});


// API Shenanigans
// Get the API
let league = 57; // NHL
let season = 2022; // 2022 - 2023 season
fetch(`https://v1.hockey.api-sports.io/games?league=${league}&season=${season}`, {
    "method": "GET",
    "headers": {
        "x-rapidapi-host": "https://api-hockey.p.rapidapi.com/standings",
        "x-rapidapi-key": "f8899b472271abd3b7abca3cdededa39"
    }
})
    // get the data coming from the API
    .then(response => {
        if (response.status === 200)
            return response.json()
        throw new Error('Something went wrong')
    })
    .then(data => console.log(data))

    .then(data => {
        // Get the table body
        const tableBody = document.querySelector("#teams-table tbody");
        // Clear the table body
        tableBody.innerHTML = "";

        for (var i = 0; i < data.response.length; i++) {
            // Create a new row
            var game = data.response[i]["games"];
            const row = document.createElement("tr");

            // Create a new cell for the team name
            const teamCell = document.createElement("td");
            teamCell.textContent = game["teams"]["home"]["name"];
            // Append the team cell to the row
            row.appendChild(teamCell);

            // Create a new cell for the date
            const dateCell = document.createElement("td");
            dateCell.textContent = game["date"];
            // Append the date cell to the row
            row.appendChild(dateCell);

            // Create a new cell for the opposing team name
            const opposingTeamCell = document.createElement("td");
            opposingTeamCell.textContent = game["teams"]["away"]["name"];
            // Append the opposing team cell to the row
            row.appendChild(opposingTeamCell);

            // Create a new cell for the outcome
            const outcomeCell = document.createElement("td");
            outcomeCell.textContent = game["scores"]["home"] > game["scores"]["away"] ? "W" : "L";
            // Append the outcome cell to the row
            row.appendChild(outcomeCell);

            // Append the row to the table body
            tableBody.appendChild(row);
        };
    })

    .catch(err => {
        console.log(err);
    });