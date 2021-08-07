# Twitter-Like Web App 

## Project Description

The project is a social network web application that provides a safe environment via the Safe For Work mode. In this mode, profanity and nudity are detected via machine learning models then they are hidden for users in this mode. Adult users can switch this mode on and off while adolescent users can't switch this mode off.

The app supports the basic functionalities of Twitter, such as:
* Tweeting, retweeting, Quote tweeting, and Replying to tweets (the tweet can contain text, images, videos, and/or hashtags)
* Creating and editing a profile
* Search for, follow, report, and ban other users
  
The app also supports some other functionalities, such as:
* Real-time chat
* Real-time feed updates
* Trends
* Admin dashboard

## Project Components & Dependencies
To run the project:

Clone the repo by the following command:
```bash
git clone https://github.com/Abdallah-Elshamy/Twitter-Like-App
```
### The project has three components.
#### - The first one is the frontend which is a React app & Tailwind is also used as a CSS-supporting library and deployed all frontend by using AWS S3.

- To run frontend server:

1. Navigate to the `./frontend`  directory then run the following command:
    `npm install`
2. Run the second following command:
    `npm start`

#### - The second component is the Safe For Work server which is a Flask server that uses machine learning models to detect profanity and nudity in tweets.

- To run the SFW server, follow the next steps:

1. Install virtualenv using 
    `pip install virtualenv`
2. Change directory to the `SFW_service` directory.
3. Create a virtual environment using
	`virtualenv env` 
4. Now if you are same directory then type the following to activate the environment
	- if you are using windows:
	`env\Scripts\activate`
	- if you are using linux:
	`source env/bin/activate`
6. Install the requirements using the requirments.txt file
	`pip install -r requirements.txt`
7. Run the server using 
	`python app.py`

#### - The third component is the backend which implemented by using Node.js, GraphQL, Apollo Server, and Express to  it , implemented the real-time features using WebSockets and RabbitMQ on AWS MQ and also used PostgreSQL DB on AWS RDS and AWS S3 to store the data.

- To run the backend server:

1. Navigate to the `./backend`  directory then run the following command:
    `npm install`
2. Run the second following command:
    `npm run dev`

#### Also,the project utilize some DevOps tactics and built a CI/CD pipeline (using GitHub Actions) that automatically runs unit tests, builds, and deploys Docker images to a Kubernetes cluster on AWS EKS that contains two instances of the backend server, one instance of the SFW server, and an NGINX proxy server.

## Project Demo
[https://www.drive.com/Twitter-like-Demo](https://drive.google.com/file/d/1u2kaNn6pzBGbtTcia5Bv7wJvJUOx72Gq/view?usp=sharing)
