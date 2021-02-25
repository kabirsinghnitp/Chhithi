const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const container2 = document.getElementById('container2');
const container3 = document.getElementById('container3');
const registerText = document.getElementById('register-text');
const loginText = document.getElementById('login-text');
const forgetPassword = document.querySelector(".forget-password");
const wrong = document.getElementById("wrong");

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

var a = 1;
function signinform()
{
  if(a == 1)
  {
    container2.style.display = "none";
    container3.style.display = "block";
    loginText.style.display = "none";
    registerText.style.display = "block";
    return a = 0;
  }
  else{
    container2.style.display = "block";
    container3.style.display = "none";
    loginText.style.display = "block";
    registerText.style.display = "none";
    return a = 1;
  }
}

function forgotPassword() {
  container.style.display = "none"
  registerText.style.display = "none";
  container2.style.display = "none";
  container3.style.display = "none";
  forgetPassword.style.display = "flex";
  wrong.style.display = "none";
}