const form = document.getElementById("workoutForm");
const list = document.querySelector("aside ul");
const submitButton = document.getElementById("submit");
const ratingInputs = document.querySelectorAll("#workout-rating input[type='radio']");


// pre-fill the form with default values
const currentDate = new Date().toISOString().split('T')[0];
const defaultExercise = {
    date: currentDate,
    weight: "10",
    reps: "15",
    sets: "3",
};
  
// Set the default values on the form
document.getElementById("date").value = defaultExercise.date;
document.getElementById("weight").value = defaultExercise.weight;
document.getElementById("reps").value = defaultExercise.reps;
document.getElementById("sets").value = defaultExercise.sets;


//function occurs when the user rates their workout BEFORE clicking submit button
ratingInputs.forEach(function (input) {
    input.addEventListener("change", function () {
        const rating = form.elements.rating.value;
        const ratingLabels = document.querySelectorAll("#workout-rating label");
            // Reset all labels' bkgd color
            ratingLabels.forEach(function (label) {
                label.style.backgroundColor = ""; 
            });
          
      const selectedLabel = document.querySelector(`label[for=${this.id}]`);
      if (selectedLabel) {
        // Change submit button background color and selected rating 
        // background color based on the rating value
        // Reset the color of rating labels and submit button
            

        switch (rating) {
          case "1":
            submitButton.style.backgroundColor = "#C45858";
            submitButton.style.color = "white";
            selectedLabel.style.backgroundColor = "#C45858";
            break;
          case "2":
            submitButton.style.backgroundColor = "#8684D7";
            selectedLabel.style.backgroundColor = "#8684D7";
            submitButton.style.color = "white";
            break;
          case "3":
            submitButton.style.backgroundColor = "#8FB8DE";
            selectedLabel.style.backgroundColor = "#8FB8DE";
            submitButton.style.color = "white";
            break;
          case "4":
            submitButton.style.backgroundColor = "#E0B82B";
            selectedLabel.style.backgroundColor = "#E0B82B";
            submitButton.style.color = "white";
            break;
          case "5":
            submitButton.style.backgroundColor = "#5FB563";
            selectedLabel.style.backgroundColor = "#5FB563";
            submitButton.style.color = "white";
            break;
        }
      }
    });
  });
  
// Event listener for the form submission
form.addEventListener("submit", function (event) {
    //console.log("submit button is clicked")
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

    // Reset color of workout-rating label and submit button
    const ratingLabels = document.querySelectorAll("#workout-rating label");
    function resetColor() {
        ratingLabels.forEach((label) => {
            label.style.backgroundColor = "";
        });
        submitButton.style.backgroundColor = "";
        submitButton.style.color = "";
    }

    resetColor();
})

// Create an array called 'workoutList'
var workoutList = [];

// Function to add an exercise to the workoutList array
function addExercise(date, name, bodyPart, weight, reps, sets, rating) {

    // Creating the exercise object with input parameters
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
    // Retrieve the workoutList from local storage
    let workoutList = JSON.parse(localStorage.getItem('workoutList'))
    // If workoutList is empty, workoutList's content becomes the exercise
    if (workoutList == null){
        workoutList = [exercise]
    } else {
        // If workoutList is NOT empty, add the exercise to the existing array
        workoutList.push(exercise)    
    }
    // Update the workoutList in local storage
    localStorage.setItem("workoutList", JSON.stringify(workoutList))
    // Update the displayed workoutList in "Your Progress"
    updateworkoutList();
    // Reset the form fields to default values
    form.reset();
    document.getElementById("date").value = defaultExercise.date;
    document.getElementById("weight").value = defaultExercise.weight;
    document.getElementById("reps").value = defaultExercise.reps;
    document.getElementById("sets").value = defaultExercise.sets;
}
// Initially display the workoutList when user goes on the website
updateworkoutList();
// Function to update the displayed workoutList
function updateworkoutList() {
    let list = document.querySelector("aside ul");
    list.innerHTML = "";
    let emptyMessage = document.querySelector(".empty-message");
  
    // Retrieve the workoutList from local storage
    let workoutList = JSON.parse(localStorage.getItem("workoutList"));

    // Check if workoutList is not empty
    if (workoutList.length > 0) {
        // If workoutList is NOT empty, hide the emptyMessage
        emptyMessage.style.display = "none"; //hide the emptyMessage
        workoutList.forEach((exercise) => {
            let card = document.createElement("div");
            // Give a class "card" and "rating_"to the div element for styling
            card.classList.add("card");
            card.classList.add(`rating${exercise.rating}`);

            // Function to get the appropriate emoji based on the rating 
            function getRatingEmoji(rating) {
                switch(exercise.rating){
                    case "1":
                        return "&#x1F622;"; 
                    case "2":
                        return "&#x1F641;";
                    case "3":
                        return "&#x1F610;"; 
                    case "4":
                        return "&#x1F642;"; 
                    case "5":
                        return "&#x1F60D;"; 
                }
            }

            // Function to get the appropriate image based on the selected bodyPart
            function getImage(bodyPart){
                return `Images/${bodyPart}.png`;
            }
            card.setAttribute('id', exercise.id);
            list.prepend(card);
            // Create the card HTML structure with exercise values
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
            //Create a delete button
            let delButton = document.createElement("button");
            let delButtonText = document.createTextNode("×");
            delButton.appendChild(delButtonText);
            // Add a class to style the delete button
            delButton.classList.add("deleteButton");
            card.appendChild(delButton);
    
            // Event listener for the delete button on each card
            delButton.addEventListener("click", function () {
                // Apply blur effect to the card
                card.classList.add("blur");
                // Create the pop-up message element
                const popup = document.createElement("div");
                // Add a class to style the popup element
                popup.classList.add("popup");

                const message = document.createElement("div");
                message.innerText = "Delete workout?\n You can't undo this.";

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
                    card.classList.remove("blur"); // Remove the blur effect for desktop
                    card.removeChild(popup); // Remove the pop-up message
                });

                // Event listener for the delete button inside the pop-up message
                secDeleteButton.addEventListener("click", function () {
                    // Remove the card from the DOM
                    card.remove();

                    // Create a new array while filtering out the deleted exercise
                    workoutList = workoutList.filter((item) => item.id !== exercise.id);

                    // Update the workoutList in the local storage
                    localStorage.setItem("workoutList", JSON.stringify(workoutList));

                    // Update the displayed workoutList
                    updateworkoutList();
                });

            }); 
    
        }); 
    } 
    // Display emptyMessage when no exercise is added to workoutList
    else {
        emptyMessage.style.display = "flex";

     return;
    }
  }