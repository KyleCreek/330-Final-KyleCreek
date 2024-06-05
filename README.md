# 330-Final-KyleCreek
Week 10 Final Project Thoughts:
-------------------------------
- Railway App Generated Domain: 330-final-kylecreek-production.up.railway.app
- 
- Self Evaluation:
- 
  - What I Learned:
      - Through this project the sheer amount of time / thought that must go into an API is massive - I gained an appreciation for the scope of developing and maintaing a production level API. Further I learned the value in test driven development. While writing the tests was more time consuming (in comparison to our assignments where they are provided) I get a much better idea in how the end points are going to be used. This additional foresight makes it easier to develop the end points themselves. 

  - What I would Improve Upon:
    
     - To improve this project I would do two things. The first would be to develop a CI Pipeline for the associated github page. Given this is a portfolio project, I think it would be a nice addition to have on display for potential employers. Additionally - I would create a Simple front end utilizing the lessons learned from previous quarters for sing up, log in, create bets and View bets. These are both simple additions that can be easily created given additional time. 

  - What Worked Well:
    - Test Driven Development. It was mentioned above but the additional foresight required in test driven development made this project a lot easier than trying to copy / paste code from old assignments or going directly into a coding practice. Version control via git was also very nice. I didn't always have access to the same machine to work on this project - so having the discipline to constantly upload my changes to git allowed me to constantly have access to this project while on the go. 
   
    
  - What Didn't Work Well:
    - My railway application seems to be on a little bit shaky ground. During the initial deployment and presentation in class the deployment has crashed atleast once. I also think I could add a few more controls to the databseses to maintain unique controls. Finally, additional business logic could have been extended to the "Bet" Object, but this would be difficult, for various reasons related to gambling.
    - 

Week 8 - Proof of Concept Update.

What has Been Completed:
-------------------------------
- All Model Schemas have been defined
- General Express FrameWork has been established (Server / Router / test-utils, etc).
- Local Mongo connection ha been established (Still needs to be Set up for Host Server)
- Data Acceess Object Files have Frame Work. Some are partially complete
- All CRUD Operations for /bet and /parlay have been defined (Not within their Routes, but the Testing has determined the required end points).
- Authorization Routes, DAOs, Associated Tests have been completed.
- /Bet end point routes, DAO, and testing end points have been partially completed
- /Parlay end point routes and testing end points have been partially defined.
- Partial Completion of POSTMAN End Point Testing

What Remains to Be Completed:
--------------------------------
- Complete /Bet End Points / DAOs / Test Script
- Complete /Parlay End Points / DAOs / Test Script
- Finish associated POSTMAN end point tests (For Demonstration).
- Upload Completed (and tested) Code to Railways
- Verify end points with POSTMAN Tests
- Complete associated Slides / Presentation for Final Project
- Update Final Project "Read Me".
- Turn in Assignment for completion. 



1. Description of the Scenario Project is Operating In.

- This project is intended to mimic a piece of an application I have long dreamt about but failed to ever develop. The concept of this application is essentially the "Tinder for Gambling". In this operating environment, users create bets that can be swiped on by other random users in the internet. It is intended to mimic the in person, peer to peer, low stakes gambling.

2. Description of what problem your project seeks to solve

- At minmium, this project will cover the ability to sign up, log in, and create a new bet that will be commited to the data base. At a strech goal, this will also cover the functionality for the application to allow a user to accept a bet and re-commit to the database. 

3. Description of what the technical components your project will be, including the routes, the data models, and any external sources you'll use

- Routes:
-----------------------------------------------------------------
-  /auth/signup: Route that Allows use to sign up for Application
    - POST
        - 400 Error Code for Empty or Missing Password
        - 200 for Positive Sign Up
        - 409 for Non-Unique Email Address.
-   auth/login: Route Signs users in to Application and Returns Token
    - POST
        - 400 Error for Empty or Missing Password
        - 401 When Password Doesn't Match
        - 200 & "res.body.token" with Token when Good Password is Provided.

- /bet/: User Specific CRUD Operations for Bets
  - POST: Allows users to Create a New Bet
      - 200 Code when Bet is created Successfully
      - 400 Code when a Required Field is Missing
      - 401 When Token is Missing, or Bad
  - GET: Allows Users to View ALL Their Own Bets
      - 200 Code and List of All Bets
      - 401 When Token is Missing or Bad

- /bet/:id: Perform CRUD Operations on all Bets, MUST be owner of the Bet, OR An ADMIN User
  - GET
      - 401 with bad or missing token
      - 200 with bet for admin or owner 
  - PUT
      - 401 with bad or missing token
      - 200 with bet for admin or owner
  - DELETE
      - 401 with bad or missing token
      - 200 for admin or owner. 
 
  
- /parlay/: Perform CRUD Operations on PARLAY - which are a combination of BETS. MUst be Owner of Parlay OR Admin to perform CRUD Operations
  - POST
  - GET
  - PUT
  - DELETE

- Data Models:
-----------------------------------------------------------------
-   User:
  - _id (Mongoose Object)  
  - First Name (String)
  - Last Name (String)
  - Email (String / Unique)
  - Password (Encrypted String)
  - Account Balance (Integer)

- Bet:
  - _id (Mongoose Object)
  - BetInitiator (Mongoose User Object)
  - BetAcceptor (Mongood User Object) - Optional Parameter
  - Price (Integer)

- Parlay:
  - _id (Mongoose Object)
  - parlayInitiator (Mongoose User Object)
  - parlayBets (List of Mongood Bets)
  - parlayCost (Integer)
  

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
