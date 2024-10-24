// GET DOM ELEMENTS
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

// Fetch reviews from API
async function getReviews() {
  const response = await fetch("https://filmopia.onrender.com/reviews");
  return await response.json();
}

// Add reviews to DOM
async function displayAllReviews() {
  const buttonPressed = event.target.id;
  // Display a notice to user that page is loading
  toggleStatus(buttonPressed);

  // If review container already populated, clear before repopulating
  if (reviewContainer.innerHTML != "") {
    reviewContainer.innerHTML = "";
  }

  const reviews = await getReviews();

  // Adjust UI to display reviews and hide other elements
  hideElements(buttonPressed);

  reviews.forEach((review) => {
    const filmDiv = document.createElement("div");
    const titleP = document.createElement("p");
    const ratingP = document.createElement("p");
    const reviewP = document.createElement("p");
    const factP = document.createElement("p");
    const likesP = document.createElement("p");

    titleP.innerHTML = `<span aria-label="film title">Film:</span> ${review.title}`;
    ratingP.innerHTML = `<span aria-label="score out of 10">Score:</span> ${review.rating}`;
    reviewP.innerHTML = `<span aria-label="review">Review:</span> ${review.review}`;
    factP.innerHTML = `<span aria-label="cool fact">Cool Fact:</span> ${review.fact}`;
    likesP.innerHTML = `<span aria-label="number of likes">Likes:</span> ${review.likes}`;

    reviewContainer.appendChild(filmDiv);
    filmDiv.appendChild(titleP);
    titleP.after(ratingP);
    ratingP.after(reviewP);
    reviewP.after(factP);
    factP.after(likesP);
  });

  // Remove loading status after elements have been added to DOM
  toggleStatus(buttonPressed);
}

// Display the form to post a review
function displayReviewForm() {
  const buttonPressed = event.target.id;
  hideElements(buttonPressed);
}

// Handles the submission of the review form
async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(reviewForm);
  const body = Object.fromEntries(formData);

  const response = await fetch("https://filmopia.onrender.com/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json",  },
    body: JSON.stringify(body),
  });
  console.log(response);
}
// Access-Control-Allow-Origin: http://www.example.com

// Notifies the user that the requested action is in progress and clears when completed
function toggleStatus(buttonId) {
  if (buttonId == "header-view-reviews-btn") {
    headerLoadingStatus.classList.toggle("hidden");
  } else if (buttonId == "choose-view-btn") {
    mainLoadingStatus.classList.toggle("hidden");
  }
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

// Shows the user a realtime visual of the value of range input on the new review form
formRatingRange.oninput = function () {
  formRatingValue.innerHTML = this.value;
};
