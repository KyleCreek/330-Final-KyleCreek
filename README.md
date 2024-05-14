# 330-Final-KyleCreek

1. Description of the Scenario Project is Operating In.

- This project is intended to mimic a piece of an application I have long dreamt about but failed to ever develop. The concept of this application is essentially the "Tinder for Gambling". In this operating environment, users create bets that can be swiped on by other random users in the internet. It is intended to mimic the in person, peer to peer, low stakes gambling.

2. Description of what problem your project seeks to solve

- At minmium, this project will cover the ability to sign up, log in, and create a new bet that will be commited to the data base. At a strech goal, this will also cover the functionality for the application to allow a user to accept a bet and re-commit to the database. 

3. Description of what the technical components your project will be, including the routes, the data models, and any external sources you'll use

- Routes:
-   /login
-   /signup
-   bet/newBet
-   bet/viewBets (Stretch)
-   bet/acceptBet

- Data Models:
-   User:
-     First Name (String)
-     Last Name (String)
-     Email (String / Unique)
-     Password (Encrypted String)
-     Account Balance (Integer)
-   Bet:
-     _id (Mongoose Object)
-     BetInitiator (Mongoose User Object)
-     BetAcceptor (Mongood User Object)
-     Cost (Integer)

6. Clear and Direct Call outs of how you will meet various Project Requirements.

- Authentication and Authorization
-   Authentication and Authorization will be controlled via the "login" route with bcrypt and JWT

2  sets of CRUD routes (not counting authentication)
- See above routes. 

Indexes for performance and uniqueness when reasonable
  - Unqueness is controlled via User name and Bet IDs

At least one of text search, aggregations, and lookups

Routes should be fully tested (project test coverage > 80%)
  - Routes will be tested via JEST
    
You’ll demo your project to the class in week 10 (5 minutes)
  - Done In person
    
Demonstrate how to interact with your API

- Interactions will be completedvia POSTMAN Collection


8. Timeline for what project components you plan to comnplete, week by week, for the remainder of class
   - Week 7:
   -   Create Barebones Express Application and Routes
   -   Set up Basebones Mongoose Objects
   -   Start Writing Jest TEST w/ Expected responses
   - Week 8:
   -   Finish Jest Tests
   -   Further Develop Routes once JEST Tests are Complete
   - Week 9:
   -   Finish API Development
   -   Complete POSTMAN Routes for Class Presentation. 
   - Week 10:
   -   Present Project
