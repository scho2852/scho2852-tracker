// Setting up variables for our HTML elements using DOM selection
const form = document.getElementById("workoutForm");
const list = document.querySelector("aside ul");

// pre-fill the form with default values
// grab the date the user uses the website
const currentDate = new Date().toISOString().split('T')[0];
const defaultExercise = {
    date: currentDate,
    weight: "10",
    reps: "15",
    sets: "3",
  };
  
  // Set the default values to the form elements
  document.getElementById("date").value = defaultExercise.date;
  document.getElementById("weight").value = defaultExercise.weight;
  document.getElementById("reps").value = defaultExercise.reps;
  document.getElementById("sets").value = defaultExercise.sets;

  ///////// 

form.addEventListener("submit", function (event) {
    console.log("submit button is clicked")
    event.preventDefault();
    addExercise(
        form.elements.date.value,
        form.elements.name.value,
        form.elements.bodyPart.value,
        form.elements.weight.value,
        form.elements.reps.value,
        form.elements.sets.value,
        form.elements.rating.value,
    )
})

// Create an array called 'workoutList'
var workoutList = [];

// Create a function called 'addexercise'
// Give the function input parameters for: name, type, rate, time, client
// Paste your object definition from above in the function
// Replace the property values with the input paramaters
// Add the object to the workoutList array

function addExercise(date, name, bodyPart, weight, reps, sets, rating) {

    // Creating the object, directly passing in the input parameters
    let exercise = {
        date,
        name,
        bodyPart,
        weight,
        reps,
        sets,
        rating ,
        id: Date.now()
    }
    let workoutList = JSON.parse(localStorage.getItem('workoutList'))
    if (workoutList == null){
        workoutList = [exercise]
        console.log(workoutList)
    } else {
        workoutList.push(exercise)    
    }


    localStorage.setItem("workoutList", JSON.stringify(workoutList))
    updateworkoutList();
}

updateworkoutList();
console.log(workoutList)

// Call the function with test values for the input paramaters
//addexercise("Initial Sketches", "Concept Ideation", 50, 5, "Google");


function updateworkoutList() {
    let list = document.querySelector("aside ul");
    list.innerHTML = "";
    let emptyMessage = document.querySelector(".empty-message");
  
    // Retrieve the workoutList from local storage
    let workoutList = JSON.parse(localStorage.getItem("workoutList"));


  
    // Check if workoutList is not empty
    if (workoutList.length > 0) {
        emptyMessage.style.display = "none"; //hide the emptyMessage
        workoutList.forEach((exercise) => {
            let card = document.createElement("div");
            card.classList.add("card"); //give a class card
            card.classList.add(`rating${exercise.rating}`);

            //get appropriate emoji from the rating 
            function getRatingEmoji(rating) {
                switch(exercise.rating){
                    case "1":
                        return "&#x1F622;"; // Emoji representation for rating 1
                    case "2":
                        return "&#x1F641;"; // Emoji representation for rating 2
                    case "3":
                        return "&#x1F610;"; // Emoji representation for rating 3
                    case "4":
                        return "&#x1F642;"; // Emoji representation for rating 4
                    case "5":
                        return "&#x1F60D;"; // Emoji representation for rating 5
                }
            }

            // match exercise.bodyPart with one image from Image folder
            function getImage(bodyPart){
                return `Images/${bodyPart}.png`;
            }
    
            card.setAttribute('id', exercise.id);
    
            list.prepend(card);
            card.innerHTML = `
            <div class="initialInfo">
                <div class="bodyPart">${exercise.bodyPart}</div>
                <div class="date">${exercise.date}</div>
                <button class="deleteButton"></button>
            </div>
            <div class="image"><img src = "${getImage(exercise.bodyPart)}" / ></div>
            <div class="workoutName">${exercise.name}</div>
            <div class="ratingEmoji">${getRatingEmoji(exercise.rating)}</div>
            <div class="info">
                <div class="weight">${exercise.weight} kg</div>
                <div class="reps">${exercise.reps} reps</div>
                <div class="sets">${exercise.sets} sets</div>
            </div>`

            let delButton = document.createElement("button");
            let delButtonText = document.createTextNode("×");
            delButton.appendChild(delButtonText);
            delButton.classList.add("deleteButton");
            card.appendChild(delButton);
    
            // when the delete button is clicked, blur the card, and display a pop up message
            delButton.addEventListener("click", function () {
                console.log("delete button is clicked")
                // Apply blur effect to the card
                card.classList.add("blur");

                // Create the pop-up message elements
                const popup = document.createElement("div");
                popup.classList.add("popup");

                const message = document.createElement("div");
                message.innerText = "Delete workout? You can't undo this.";

                const cancelButton = document.createElement("button");
                cancelButton.innerText = "Cancel";
                cancelButton.classList.add("cancelButton");

                const secDeleteButton = document.createElement("button");
                secDeleteButton.innerText = "Delete";
                secDeleteButton.classList.add("secDeleteButton");

                // Append the pop-up elements to the card
                popup.appendChild(message);
                popup.appendChild(cancelButton);
                popup.appendChild(secDeleteButton);
                card.appendChild(popup);
                // Event listener for the cancel button
                cancelButton.addEventListener("click", function () {
                    card.classList.remove("blur"); // Remove the blur effect
                    card.removeChild(popup); // Remove the pop-up message
                });

                // Event listener for the delete button inside the pop-up message
                secDeleteButton.addEventListener("click", function () {
                    // Remove the card from the DOM
                    card.remove();

                    // Use the filter method to create a new array without the exercise to be deleted
                    workoutList = workoutList.filter((item) => item.id !== exercise.id);

                    // Update the workoutList in the local storage
                    localStorage.setItem("workoutList", JSON.stringify(workoutList));

                    console.log("Deleted exercise:", exercise);
                    // Update the displayed list after deleting
                    updateworkoutList();
                });

            }); //end of delete button event listener
    
        }); //ending of for eahc
    } 
    // Display message when no entry has been made
    else {
        emptyMessage.style.display = "flex"; //hide the emptyMessage

     return;
    }
    console.log(workoutList)
  }