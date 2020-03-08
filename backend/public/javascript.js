window.onload = function() {
  document
    .getElementById("donatedMoney")
    .addEventListener("click", donatedMoney, false);
  function donatedMoney() {
    var amount = document.getElementsByClassName("selected")[0].value;
    const email = localStorage.getItem("email");
  }
  document.getElementById("600").addEventListener("click", donate600, false);
  function donate600() {
    selectBotton("600");
  }
  document.getElementById("500").addEventListener("click", donate500, false);
  function donate500() {
    selectBotton("500");
  }
  document.getElementById("400").addEventListener("click", donate400, false);
  function donate400() {
    selectBotton("400");
  }
  document.getElementById("300").addEventListener("click", donate300, false);
  function donate300() {
    selectBotton("300");
  }
  document.getElementById("200").addEventListener("click", donate200, false);
  function donate200() {
    selectBotton("200");
  }
  document.getElementById("other").addEventListener("click", other, false);
  function other() {
    selectBotton("other");
  }
  function selectBotton(id) {
    buttons = document.getElementsByClassName("amtButton");
    for (var i = 0; i < buttons.length; i++)
      if (buttons[i].classList.contains("selected")) {
        buttons[i].classList.remove("selected");
        buttons[i].style.color = "white !important";
      }

    document.getElementById(id).classList.add("selected");
  }
  document
    .getElementById("donatedMoney")
    .addEventListener("click", donatedDuration, false);
  function donatedDuration() {
    var amount = document.getElementsByClassName("month")[0].value;
    console.log(amount);
    alert(amount);
  }
  document
    .getElementById("donateMonthly")
    .addEventListener("click", donateMonthly, false);
  function donateMonthly() {
    selectDuration("donateMonthly");
  }
  document
    .getElementById("donateOnce")
    .addEventListener("click", donateOnce, false);
  function donateOnce() {
    selectDuration("donateOnce");
  }

  function selectDuration(id) {
    buttons = document.getElementsByClassName("duration");
    for (var i = 0; i < buttons.length; i++)
      if (buttons[i].classList.contains("month")) {
        buttons[i].classList.remove("month");
        buttons[i].style.background = "white !important";
      }

    document.getElementById(id).classList.add("month");
  }
};
