// GET DOM ELEMENTS
const siteTitle = document.querySelector("h1");
const userAction = document.getElementById("user-action");
const chooseViewBtn = document.getElementById("choose-view-btn");
const chooseSubmitBtn = document.getElementById("choose-submit-btn");
const headerViewReviewsBtn = document.getElementById("header-view-reviews-btn");
const headerSubmitReviewBtn = document.getElementById(
  "header-submit-review-btn"
);
const formContainer = document.getElementById("form-container");
const formRatingRange = document.getElementById("form-rating-range");
const formRatingValue = document.getElementById("form-rating-value");
const reviewForm = document.getElementById("review-form");
const reviewContainer = document.getElementById("review-container");
const headerLoadingStatus = document.getElementById("header-reviews-loading");
const mainLoadingStatus = document.getElementById("reviews-loading");

// Array of inserted divs for each review so an event handler can listen for mouseover
let reviewDivs = [];

// HTTP REQUESTS //
// GET REQUEST - Fetch reviews from API
async function getReviews() {
  const response = await fetch("https://filmopia.onrender.com/reviews");
  return await response.json();
}

// POST REQUEST - Handles the submission of the review form
async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(reviewForm);
  const body = Object.fromEntries(formData);

  const response = await fetch("https://filmopia.onrender.com/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  // Reset form on completion
  reviewForm.reset();
  formRatingValue.textContent = 5;
  // Display temporary notice that review was posted
  onPost();
}

// PUT REQUEST - Update database entry to increase the likes value of chosen review by 1, then update DOM
function likeReview(review) {
  const reviewId = review.children[0].id;
  const likes = review.children[6].textContent.split(" ", [2]);
  const reviewLikes = parseInt(likes[1]) + 1;
  const data = [reviewId, reviewLikes];

  const response = fetch(`https://filmopia.onrender.com/reviews`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  // Update likes value for review on DOM
  const newStr = `<span aria-label="number of likes">Likes:</span> ${reviewLikes}`;
  review.children[6].innerHTML = newStr;
}

// DELETE REQUEST - Deletes a review from the database and updates the DOM
function deleteReview(review) {
  const reviewId = review.children[0].id;
  console.log(reviewId);
  const response = fetch(`https://filmopia.onrender.com/reviews/${reviewId}`, {
    method: "DELETE",
  });
  // Removes the review from the DOM
  review.remove();
}

// LOAD CORRECT DOM ELEMENTS //
// Add reviews to DOM
async function displayAllReviews() {
  const buttonPressed = event.target.id;
  // Display a notice to user that page is loading
  toggleStatus(buttonPressed);

  // If review container already populated, clear before repopulating
  if (reviewContainer.innerHTML != "") {
    reviewContainer.innerHTML = "";
  }

  // Retrieve reviews from API
  const reviews = await getReviews();
  // Adjust UI to display reviews and hide other elements
  hideElements(buttonPressed);

  // Loop through review array and add each review to DOM
  reviews.forEach((review) => {
    const filmDiv = document.createElement("div");
    const titleP = document.createElement("p");
    const ratingP = document.createElement("p");
    const reviewP = document.createElement("p");
    const factP = document.createElement("p");
    const likesP = document.createElement("p");
    const deleteReviewBtn = document.createElement("button");
    const likeReviewBtn = document.createElement("button");
    deleteReviewBtn.id = review.id;
    likeReviewBtn.id = review.id;
    deleteReviewBtn.classList.add("delete-btn", "hidden");
    likeReviewBtn.classList.add("like-btn", "hidden");
    reviewDivs.push(filmDiv);

    titleP.innerHTML = `<span aria-label="film title">Film:</span> ${review.title}`;
    ratingP.innerHTML = `<span aria-label="score out of 10">Score:</span> ${review.rating}`;
    reviewP.innerHTML = `<span aria-label="review">Review:</span> ${review.review}`;
    factP.innerHTML = `<span aria-label="cool fact">Cool Fact:</span> ${review.fact}`;
    likesP.innerHTML = `<span aria-label="number of likes">Likes:</span> ${review.likes}`;
    deleteReviewBtn.textContent = "Delete Review";
    likeReviewBtn.textContent = "Like Review";

    reviewContainer.appendChild(filmDiv);
    filmDiv.appendChild(deleteReviewBtn);
    filmDiv.appendChild(likeReviewBtn);
    filmDiv.appendChild(titleP);
    titleP.after(ratingP);
    ratingP.after(reviewP);
    reviewP.after(factP);
    factP.after(likesP);
  });

  // Remove loading status after elements have been added to DOM
  toggleStatus(buttonPressed);

  // Display/hide like and delete buttons for each review as user mouses over them
  reviewDivs.forEach(function (elem) {
    elem.addEventListener("mouseover", function () {
      const deleteBtn = elem.children[0];
      const likeBtn = elem.children[1];
      deleteBtn.classList.remove("hidden");
      likeBtn.classList.remove("hidden");
    });
    elem.addEventListener("mouseout", function () {
      const deleteBtn = elem.children[0];
      const likeBtn = elem.children[1];
      deleteBtn.classList.add("hidden");
      likeBtn.classList.add("hidden");
    });

    // Listeners for user clicking to delete or like a review
    elem.children[0].addEventListener("click", function () {
      deleteReview(elem);
    });
    elem.children[1].addEventListener("click", function () {
      likeReview(elem);
    });
  });
}

// Display the form to post a review
function displayReviewForm() {
  const buttonPressed = event.target.id;
  hideElements(buttonPressed);
}

// Display site splashpage
function displaySplash() {
  userAction.classList.remove("hidden");
  formContainer.classList.add("hidden");
  reviewContainer.classList.add("hidden");
  headerSubmitReviewBtn.classList.add("hidden");
  headerViewReviewsBtn.classList.add("hidden");
}

// Hides or unhides UI elements as relevant to user actions
function hideElements(buttonId) {
  if (buttonId == "header-view-reviews-btn" || buttonId == "choose-view-btn") {
    userAction.classList.add("hidden");
    formContainer.classList.add("hidden");
    reviewContainer.classList.remove("hidden");
    headerSubmitReviewBtn.classList.remove("hidden");
    headerViewReviewsBtn.classList.add("hidden");
  } else if (
    buttonId == "header-submit-review-btn" ||
    buttonId == "choose-submit-btn"
  ) {
    userAction.classList.add("hidden");
    formContainer.classList.remove("hidden");
    reviewContainer.classList.add("hidden");
    headerViewReviewsBtn.classList.remove("hidden");
    headerSubmitReviewBtn.classList.add("hidden");
  }
}

// TEMPORARY ACTION STATUS MESSAGES //
// Notifies the user that the requested action is in progress and clears when completed
function toggleStatus(buttonId) {
  if (buttonId == "header-view-reviews-btn") {
    headerLoadingStatus.classList.toggle("hidden");
  } else if (buttonId == "choose-view-btn") {
    mainLoadingStatus.classList.toggle("hidden");
  }
}

// Displays a temporary message to let the user know that the form was submitted and successfully received
function onPost() {
  const postSuccess = document.createElement("p");
  postSuccess.textContent = "Review successfully posted!";
  reviewForm.append(postSuccess);
  // Remove message after 3 seconds
  setTimeout(() => {
    postSuccess.remove();
  }, 3000);
}

// EVENT LISTENERS
// Display reviews when user clicks view all reviews button in main page section
chooseViewBtn.addEventListener("click", displayAllReviews);

// Display the form to submit a review when  user submit review button in main page section
chooseSubmitBtn.addEventListener("click", displayReviewForm);

// Display reviews when user clicks view reviews button in header
headerViewReviewsBtn.addEventListener("click", displayAllReviews);

// Display reviews when user clicks add new review button in header
headerSubmitReviewBtn.addEventListener("click", displayReviewForm);

// Listens for user submitting the new review form
reviewForm.addEventListener("submit", handleSubmit);

// Reloads the splash page when user clicks on site title (header h1)
siteTitle.addEventListener("click", displaySplash);

// Shows the user a realtime visual of the value of range input on the new review form
formRatingRange.oninput = function () {
  formRatingValue.innerHTML = this.value;
};
