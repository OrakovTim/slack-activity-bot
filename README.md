# Slack Activity Tracker Bot

## Overview

The Slack Activity Tracker Bot is a bot built with Slack's API and Express.js (using TypeScript). It allows you to track user activity in different Slack channels and send notifications when a user has been inactive for a specified period of time.

The bot provides the following main features:
- Start and stop tracking user activity in a specific Slack channel.
- Send reminders if a user has been inactive for a given time period.
- Support for tracking the same user across multiple channels simultaneously.

## Features

- **/track [username] [time_in_minutes]**: Start tracking a user's activity. The bot will notify the channel if the user remains inactive for the specified time.
- **/stop [username]**: Stop tracking the specified user in the current channel.
- Multi-channel support for the same user.
- Simple session management using in-memory storage for active sessions.
- Error handling for failed API calls, invalid commands, and missing user data.



## Setup Instructions

### Prerequisites

- Node.js (version 14 or above)
- npm (Node package manager)
- A Slack workspace with a bot application set up
- Slack Bot Token and Signing Secret

### Installation

1. Clone the repository:

```bash

git clone https://github.com/your-repository-url.git

cd your-repository

```

2. Install the required dependencies:

```bash

npm install

```

3. Set up environment variables in .env file:

```bash

SLACK_BOT_TOKEN=your-slack-bot-token

SLACK_SIGNING_SECRET=your-slack-signing-secret

SLACK_APP_TOKEN = your-slack-app-token

PORT = your_port


```

4. Start bot in dev

```bash

npm run start:dev

```
