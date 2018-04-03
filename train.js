// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyADbVvIg-x8x-aOIG57U7SF8TbkkrlSqd0",
  authDomain: "test-29d15.firebaseapp.com",
  databaseURL: "https://test-29d15.firebaseio.com",
  projectId: "test-29d15",
  storageBucket: "test-29d15.appspot.com",
  messagingSenderId: "888567703954"
};

firebase.initializeApp(config);

var database = firebase.database();

// Initial Values
var trainName = "";
var trainDestination = "";
var firstTime = "";
var trainFrequency = "";

// 2. Button for adding Train
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  trainName = $("#train-name-input").val().trim();
  trainDestination = $("#destination-input").val().trim();
  firstTime = moment($("#firstTime-input").val().trim(), "HH:mm");
  trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var trainData = {
    train: trainName,
    destination: trainDestination,
    first: firstTime,
    frequency: trainFrequency
  };

  // Uploads employee data to the database
  database.ref().push(trainData);

  // Logs everything to console
  console.log(trainData.train);
  console.log(trainData.destination);
  console.log(trainData.first);
  console.log(trainData.frequency);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#firstTime-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().train;
  var trainDestination = childSnapshot.val().destination;
  var firstTime = childSnapshot.val().first;
  var trainFrequency = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(firstTime);
  console.log(trainFrequency);


  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % trainFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = trainFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
    trainFrequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});