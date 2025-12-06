# CS4710-DB-proj-CLIENT

This repository contains the frontend client for the CSC 4710 Database Project. The application is developed using [Angular](https://angular.io/) and serves as the user interface for interacting with the backend database system.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

**CS4710-DB-proj-CLIENT** provides a web-based interface for users to interact with the database project as part of the CSC 4710 course. It communicates with the backend API, allowing users to perform actions such as viewing, adding, updating, and deleting records.

## Features

- Modern Angular web application
- Responsive UI for desktop and mobile
- Secure API communication
- User authentication (if applicable)
- Forms for CRUD operations
- Error handling and notifications

## Getting Started

These instructions will help you set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (recommend latest LTS)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bui-DucHUY/CS4710-DB-proj-CLIENT.git
   cd CS4710-DB-proj-CLIENT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   ng serve
   ```
   The app will be available at `http://localhost:4200`.

4. **(Optional) Configure API endpoints**
   - Update environment configuration files (`src/environments`) with your backend API URLs if necessary.

## Project Structure

```
src/
  app/
    components/      # Feature components
    services/        # API communication and logic
    models/          # TypeScript interfaces and models
    ...
  assets/            # Static files and resources
  environments/      # Environment-specific settings
  ...
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or bug fixes.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

Distributed under the MIT License. See `LICENSE` for more information.
