## Description



## Setup Instructions
Clone this repository
cd into the project folder and run the following docker commands:

1. docker build -t mira .

2. docker run -p 3000:3000 mira


```bash
$ npm install
```

## API Documentation
https://www.postman.com/lively-firefly-154125/mira/collection/j6fks1g/mira?action=share&creator=12936851


## Assumption/Design Decision made
This process follows the sliding window method to solve the problem efficiently, where the data is processed from a range of loops.

## Local development requirements
NodeJS
Docker
TypeScript

## Environment Variables

# Database Connection String
DATABASE_URL=postgresql://mira_aur8_user:gcimNhXvAt9icFsfBAPrcMIQc4f7apOd@dpg-csubi1qj1k6c738h22bg-a.oregon-postgres.render.com/mira_aur8

# PORT
PORT=3000

