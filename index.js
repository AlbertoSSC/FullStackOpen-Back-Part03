const express = require('express');
const morgan = require('morgan');

morgan.token('body', req => JSON.stringify(req.body));

const app = express();

app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/info', (request, response) => {
  const phonebookEntries = `<p>Phonebook has info for ${persons.length} people`;

  const date = new Date();
  const currentTime = `<p>${date}</p>`;

  response.send(phonebookEntries.concat(currentTime));
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(person => person.id.toString() === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter(note => note.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map(n => Number(n.id))) : 0;

  return maxId + 1;
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing',
    });
  }

  const duplicateName = persons.find(
    person => person.name.toLowerCase() === body.name.toLowerCase()
  );

  if (duplicateName) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }

  persons = persons.concat(person);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
