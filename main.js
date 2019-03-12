var quotes = [];
quotes[0] = "Any sufficiently advanced technology is indistinguishable from magic -Arthur C. Clarke"
quotes[1] = "Privacy - like eating and breathing - is one of life's basic requirements -Katherine Neville"
document.getElementById("quote").innerText = quotes[Math.floor(Math.random()*quotes.length)];