const express = require('express');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));



app.get('/api/quotes/random', (req, res , next) => {
    res.send({
        quote: getRandomElement(quotes)
    });
});

app.get('/api/quotes', (req, res, next) => {
    const person = req.query.person;
    if (person) {
        const filteredQuotes = quotes.filter(quote => quote.person === person);
        res.send({
            quotes: filteredQuotes
        });
    } else {
        res.send({
            quotes: quotes
        });
    };
});

app.post('/api/quotes', (req, res, next) => {
    const quote = req.query.quote;
    const person = req.query.person;
    if (person && quote) {
        const newQuote = {
            quote: quote,
            person: person
        };

        quotes.push(newQuote)
        res.status(201).send({
            quote: newQuote
        });
    } else {
        res.status(400).send();
    };
});



app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
  });