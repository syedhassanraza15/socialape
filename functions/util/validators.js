//Helper function to check email is not empty
const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

//Helper function to check if the email is valid
const isEmailValid = (email) => {
  const regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.match(regEx)) return true;
  else return false;
};

exports.validateSignupData = (data) => {
  let = {};
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmailValid(data.email)) {
    errors.email = "Must be a valid email address";
  }

  //Validation for password and confirmPassword
  if (isEmpty(data.password)) errors.password = "Must not be empty";

  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords must match";

  if (isEmpty(data.handle)) errors.handle = "Must not be empty";

  //Now checking the errors Object if its empty means no validation error if it has any key in it
  //means there is an validation error so lets check

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = "Must not be empty";

  if (isEmpty(data.password)) errors.password = "Must not be empty";


  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

exports.reduceUserDetails = (data) => {
  let userDetails = {};

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    // http://website.com
    if (data.website.trim().substring(0, 4) !== 'http') {
      userDetails.website = `http://${data.website.trim()}`;
    } else {
      userDetails.website = data.website;
    }

  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
}