# PubSub with JavaScript on AWS

In this activity, you'll use *JavaScript*, *nodeJS* and the *AWS JavaScript IoT SDK* to subcribe and publish to multiple AWS topics in order to solve a puzzle.

After solving the puzzle, you'll be added to the **PubSub Hall of Fame** and your team will be notified of your great success on Slack :D


## Prerequisites

The following activities are recommended before attempting this one:
- [Create a Thing on AWS dashboard](https://github.com/OfferZen-Make/iot_robots-activity-create_aws_thing)
- [PubSub via AWS dashboard](https://github.com/OfferZen-Make/iot_robots-pub_sub_via_aws_dashboard)


## Getting started

1. Using git, clone this repo onto your local machine, then checkout your own personal branch named after your GitHub username. `git checkout -b makers/myGitHubUsername`
2. Add the certificates you generated from the prerequisite activity [Create a Thing on AWS Dashboard](https://github.com/OfferZen-Make/iot_robots-activity-create_aws_thing) to the `certificates` folder in your activity directory, and link to them in `lib/publish.js` and `lib/subscribe.js`
3. Make sure you have installed *nodeJS* and *npm*
5. To install the AWS IoT JavaScript SDK, run `npm install` in the activity folder.
6. In your favorite text editor, open `lib/subscribe.js` and `lib/publish.js` We've added some code to get you started, and you need to write the publish and subscribe code to help you solve the puzzle.
7. Run your subscribe and publish scripts with `node lib/subscribe.js` and `node lib/publish.js`


## Messages and Topics

Messages are published in *JSON format*. If you'd like to verify that your message is valid JSON, use *the linter tool*.

It's important to note that other makers may be using the same topics at the same time, so keep an eye on the `answererName` property to verify which messages you receive apply to you.

### `makers/challenge/tokens`

Subscribe to this topic to get an `answerToken`. Tokens are automatically published by MakerBot every 20 seconds and are valid for 10 minutes. You'll use this token when publishing your puzzle answer.

**Example message:**

    {
      "answerToken": "abc123",
      "expiresAt": "2018-04-01T09:30:00.000Z"
    }



### `makers/challenge/clues`

Subscribe to this topic to get clues to help you solve the puzzle. Clues are published by MakerBot every 30 seconds. There are 6 clues to the puzzle, but you might not need all of them to figure it out.

**Example message:**

    {
      "clueIndex": 3,
      "clue": "My hobbies include meowing and flying at Mach 1",
      "totalClues": 5
    }


### `makers/challenge/answers`

Publish to this topic to submit an answer to the puzzle. You'll need to include a valid `answerToken` as well as your answer. It's recommended that you don't subscribe to this channel unless you want to see other maker's answer attempts, which may spoil the puzzle.

**Example message:**

    {
      "name": "Alan Turing",
      "answerToken": "abc123",
      "answer": "Cats riding jetpacks"
    }



### `makers/challenge/answers/errors`

Subscribe to this topic to get feedback on why your published answer was rejected.

**Example messages:**

    {
      "answererName": "Alan Turing",
      "error": "Your message is not valid JSON."
    }

    {
      "answererName": "Alan Turing",
      "error": "Your message is formatted correctly, but your answer is incorrect."
    }


### `makers/challenge/answers/accepted`

Subscribe to this topic to be notified when your answer is accepted as correct.

**Example message:**

    {
      "answererName": "Alan Turing",
      "result": "Congratulations, you solved the puzzle!"
    }


## Activity strategy

Since you probably want to see incoming messages all the time, but only publish a message once you've solved the puzzle, the code is split into two files `lib/subscribe.js` and `lib/publish.js`, which means you'll want to run two separate terminal tabs.

In practice, a single script will both publish and subscribe via the same `device` object, so this separation is simply to make the activity easier. Don't forget to restart the node processes after you edit the source files!


## Need a hand?

We're here to help! If you get stuck, please ask for help on Make Slack in your team channel and tag your Make Master @dan. You can also DM us, but it's more useful to keep comms public so that other team members can benefit too.

You can also `git checkout play` to play with fully working code, but you likely want to try write your own version first :)


## Resources and further reading
- AWS PubSub documentation
- AWS JavaScript SDK Documentation
- NodeJS installation instructions
- JSON guide

