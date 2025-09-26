let hintsEl = document.querySelector('#hints')
let guessSubmitBtn = document.querySelector('#guess_form [type=submit]')

let secret = 10 + Math.floor(Math.random() * 90)
console.log('secret', secret)

let restart = () => {
  secret = 10 + Math.floor(Math.random() * 90)
  guessSubmitBtn.disabled = false
}

let onSubmit = (event) => {
  event.preventDefault()
  let formData = new FormData(event.target)
  let digits = formData.getAll('digit')

  // let number = ''
  // for (let i = 0; i < digits.length; i++) {
  //   number = number + digits[i]
  // }
  let number = Number(digits.join(''))

  if (number === secret) {
    hintsEl.innerText = 'equal'
    guessSubmitBtn.disabled = true
    return
  }
  hintsEl.innerText = number > secret ? 'greater' : 'less'
}

document.querySelector('#guess_form').addEventListener('submit', onSubmit)
