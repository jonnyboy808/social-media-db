# Social Media Database

![MIT Badge](https://img.shields.io/badge/license-MIT-green)

## Links

[Walkthrough Video](https://drive.google.com/file/d/1rudbJIfLRR3KWjMQvnq5JUuhqT-NKewG/view)

## Table of Contents

* [Description](#description)
* [Installation](#installation)
* [Code Example](#code-example)
* [Application Examples](#application-examples)
* [Usage](#usage)
* [License](#license)
* [Questions](#questions)



## Description
This is a social media api that lays the basics to running a social media site. Use this to test out user routes by seeding the provided data. Additional information can be added to the seeded data to tailor it to your needs. 

## Installation
No installation necessary, just fork and have it cloned down to your local machine

## Code Example
Below is an example of code for the reaction portion that creates a schema
```JS
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
      default: 'Unnamed reaction',
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a'),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);
```

## Application Examples
Bellow are a couple examples of the api in use using Insomnia as a visual

The first example shows an update to the email with the right box showing the updated email
![List Example](./assets/user-update.png)

---

This second screenshot is an example of a specific user thoughts displaying

![Table Example](./assets/created-thought.png)

## Usage


Make sure you have followed the walkthrough video in the [links](#links) section for additional clarity. To use the code simply fork or clone it to your local machine for usage. Once the code is opened, seed the data using a command line interface, update the data withing the seed to better match you needs. In addition use a software like Insomnia to set your desired routes and connections for testing purposes. This API allows connections to be made with a specific user such as friends, thoughts, and reactions. Additionally this can be used to delete associated friends, thoughts, and reactions from a specific user.




## License
For additional information on this license please use the provided link

![MIT Badge](https://img.shields.io/badge/license-MIT-green)

[MIT License](https://choosealicense.com/licenses/mit/)

## Questions
Please refer any questions to my Github

Github: [jonnyboy808](https://github.com/jonnyboy808)


