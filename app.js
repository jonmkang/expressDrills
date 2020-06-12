const express = require('express');
const morgan = require('morgan');

const app = express();

// This is middleware that requests pass through
// on their way to the final handler
app.use(morgan('dev'));


app.get('/', (req, res) => {
    console.log('The root path was called');
    res.send('Hello Express!');
  });

app.get('/burgers', (req, res) => {
    res.send('We have juicy cheese burgers!');
})

app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request:
      Base URL: ${req.baseUrl}
      Host: ${req.hostname}
      Path: ${req.path}
    `;
    res.send(responseText);
});

app.get('/sum', (req, res) => {
    res.send(`The sum of ${req.query.a} and ${req.query.b} is ${parseInt(req.query.a) + parseInt(req.query.b)}`)
})

app.get('/cipher', (req, res) => {
    const shift = req.query.shift;
    let cipherText = []
    for(let i = 0; i < req.query.text.length; i++){
        const newCharCode = req.query.text.charCodeAt(i) + parseInt(shift);
        console.log(newCharCode)
        if((newCharCode > 90 && newCharCode < 97) || (newCharCode > 122)){
            cipherText.push(String.fromCharCode(newCharCode-26))
        } else{
            cipherText.push(String.fromCharCode(newCharCode))
        }
    }

    
    res.send(cipherText.join(''))
})

app.get('/lotto', (req, res) => {
  const randomLotto = [];
  let response = "";

  const numbersGuessed = req.query.arr.map(number => parseInt(number))

  if(numbersGuessed.length != 6){
    return res.status(400).send('Please choose 6 numbers')
  }

  for(let i = 0; i < 6; i++){
    if(numbersGuessed.filter(number => number === numbersGuessed[i]).length != 1){
      return res.status(400).send('Please choose 6 distinct numbers')
    }
  }



  //Generates and adds a random number to Lotto
  for( let i = 0; i < 6; i++){
    randomLotto[i] = Math.floor(Math.random()*(19) + 1)
  }
  
  //Filters out non-matching numbers
  const numbersMatching = randomLotto.filter(number => numbersGuessed.find(value => value === number))
  console.log(numbersGuessed, randomLotto, numbersMatching)
  
  switch(numbersMatching.length){
    case 4:
      res.send("Congratulations, you win a free ticket")
      break;
    case 5:
      res.send("Congratulations! You win $100!")
      break;
    case 6: 
      res.send("Wow! Unbelievable! You could have won the mega millions!")
      break;
    default:
      res.send("Sorry, you lose")
      break;
  }
  
})

app.get('/queryViewer', (req, res) => {
    console.log(req.query);
    res.end(); //do not send any data back to the client
});

app.get('/greetings', (req, res) => {
    //1. get values from the request
    const name = req.query.name;
    const race = req.query.race;
  
    //2. validate the values
    if(!name) {
      //3. name was not provided
      return res.status(400).send('Please provide a name');
    }
  
    if(!race) {
      //3. race was not provided
      return res.status(400).send('Please provide a race');
    }
  
    //4. and 5. both name and race are valid so do the processing.
    const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;
  
    //6. send the response 
    res.send(greeting);
  });

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
})