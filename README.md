# PetCare Mobile App

## Authors
* Đặng Minh Tuấn
* Đỗ Quỳnh Chi
* Võ Thanh Phương
* Nguyễn Duy Tài

## Table of Contents
* [Introduction](#introduction)
* [Project Objectives](#project-objectives)
* [Relevance](#relevance)
* [Scope](#scope)
* [System Requirements](#system-requirements)
* [System Architecture](#system-architecture)

## Introduction <a id="introduction"></a>
Pets play an essential role in people's lives. Taking care of and nurturing pets require the dedication and attentiveness of pet owners. However, not everyone possesses the necessary knowledge and experience to effectively and properly care for their pets. Additionally, finding local veterinary services for pet healthcare can be challenging for many individuals.

The PetCare mobile application is developed to connect and share the pet-loving community. Its purpose is to enable users to connect with each other, share experiences and knowledge related to pet care, and provide access to veterinary services and online support from pet care experts, allowing users to better care for their pets.

## Project Objectives <a id="project-objectives"></a>
The main objective of this project is to create a mobile application that facilitates the connection and sharing of the pet-loving community. The app aims to provide a platform for users to share experiences, knowledge, and information related to pet care. Additionally, the app will offer veterinary services and online support from pet care experts, allowing users to easily search, schedule appointments, and receive pet care advice.

## Relevance <a id="relevance"></a>
Pets have become an integral part of many people's lives. However, proper pet care requires attention and specific knowledge to ensure the well-being of pets. With the advancement of technology, the use of mobile applications for connecting and sharing knowledge about pet care has become more popular than ever.

The PetCare app aims to simplify the process of connecting and sharing pet care knowledge for users, making it easier and more convenient.

## Scope <a id="scope"></a>
The scope of this project includes:

* Developing a mobile application using React Native to support both iOS and Android platforms.
* Key features of the application include registration, login, community connection, providing information and veterinary services, messaging, and notifications.
* The user interface and experience will be designed to be simple, user-friendly, and easy to navigate.

## System Requirements <a id="system-requirements"></a>
The PetCare and Community Connection mobile application is a mobile application that requires the following system requirements:

1.  Registration and login feature: Allows users to log in to the system using email or social media accounts, create new accounts, and recover passwords.
2.  Community feature: Allows users to create profiles, connect with other users, post articles, like, comment, share, follow, message, search, and view profiles of other users.
3.  Pet Health Guide feature: Provides vaccination schedules, health checkup schedules, personal health event management, and provides information and guidance on pet care.
4.  Veterinary Services feature: Allows users to search and schedule appointments with local veterinarians or healthcare experts, provide counseling services, and online support.
5.  Messaging feature: Allows users to send and receive messages within the Community feature or between Pet Owners and Veterinary Services in the Veterinary Services feature.
6.  Notifications feature: Provides notifications to users for likes, comments, follows, or appointment reminders.

## System Architecture <a id="system-architecture"></a>
To meet the requirements of the application, the system architecture consists of the following main components:

1.  Front-end: The application uses React Native to develop a cross-platform user interface for mobile devices.
2.  Back-end: The system is built on the Firebase platform, including the following features:
    * Firebase Authentication for user authentication and login management.
    * Cloud Firestore for data storage and management.
    * Firebase Cloud Functions to handle client-side requests, perform business logic tasks on the server.
    * Firebase Cloud Messaging to send notifications to users.
3. Account authentication system using JWT (JSON Web Tokens).
4. Message processing system using Firebase Realtime Database for message storage and synchronization between clients.

## Installation
Follow the steps below to install and set up the PetCare mobile app:

1. Clone the repository:

  ```
   git clone https://github.com/minhtun64/PetCare-app.git
  ```
2. Navigate to the project directory:
  ```
  cd PetCare
  ```
3. Install the dependencies using npm or yarn:
  ```
  npm install
  # or
  yarn install
  ```
4. Configure Firebase:
* Create a Firebase project at https://console.firebase.google.com.
* Obtain the Firebase configuration details (API keys, project ID, etc.).
* Update the Firebase configuration in the project by replacing the placeholders in the firebase.js file with your own configuration details.
5. Run the app:
  ```
  npm start
  # or
  yarn start
  ```
6. Open the Expo app on your mobile device and scan the QR code displayed in the terminal or Metro Bundler web page.
7. The PetCare app should now be running on your device.

*Note: This README provides an overview of the PetCare mobile app project and its key features. For detailed information and documentation, please refer to the project documentation.*
