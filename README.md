# TestAPIUI - Multi-Layer Test Automation Framework

## What This Project Does

TestAPIUI is a test automation framework that tests applications across three different layers:

1. **Web UI Tests** - Tests web applications in browsers
2. **Flutter Tests** - Tests mobile applications built with Flutter
3. **API Tests** - Tests REST APIs and backend services

This framework helps ensure your application works correctly from the user interface down to the backend.

## Project Structure

```
TestAPIUI/
├── tests/              # All test files
│   ├── Task1-KIB/      # Web UI tests
│   ├── Task2-Flutter/  # Mobile tests
│   └── Task3-API/      # API tests
├── package.json        # Project dependencies
├── playwright.config.ts # Browser settings
├── cucumber.json       # Test configuration
└── README.md          # This file
```

## Test Structure

The tests are organized in three main folders:

```
tests/
├── Task1-KIB/        # Web browser tests
├── Task2-Flutter/    # Mobile app tests  
└── Task3-API/        # API tests
```

Each folder contains:
- **Feature files** - Written in plain English describing what to test
- **Step definitions** - Code that makes the tests work
- **Page objects** - Code that interacts with the application

### Test Types

**Task1-KIB (Web UI Tests)**
- Tests web applications in browsers using Playwright
- Implements Page Object Model (POM) for maintainable test code
- Tests complete user flows: login, product selection, checkout process
- Validates form validation and error handling
- Uses both BDD (Cucumber) and direct Playwright test approaches

**Task2-Flutter (Mobile Tests)**
- Tests Flutter mobile applications using accessibility semantics
- Uses smart clicking techniques to interact with Flutter canvas elements
- Tests counter functionality: increment
- Handles Flutter-specific challenges like canvas-based UI rendering
- Validates UI interactions through accessibility labels and semantic trees

**Task3-API (API Tests)**
- Tests REST APIs and backend services using HTTP requests
- Validates authentication flows and security measures
- Tests CRUD operations (Create, Read, Update, Delete)
- Checks error handling, status codes, and response validation
- Uses both BDD (Cucumber) and POM approaches for API endpoint testing

### Technologies Used

- **Playwright** - For browser automation
- **Cucumber.js** - For writing tests in plain English  
- **TypeScript** - For writing the test code
- **Allure** - For generating test reports


### Installation

#### Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)

#### Setup Steps

1. **Clone the project**
   ```bash
   git clone https://github.com/Tokamohamed123/PlaywrightUIAPI-FinalProject.git
   cd PlaywrightUIAPI-FinalProject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

### Running Tests

The framework has three types of tests. You can run them separately or all together:

**Run Web UI tests only:**
```bash
npm run test:kib
```

**Run Flutter mobile tests only:**
```bash
npm run test:flutter
```

**Run API tests only:**
```bash
npm run test:api
```

**Run tests with automatic report generation:**
```bash
npm test
```


### Viewing Test Results

**Option 1: Automatic report generation (Recommended)**
When you run `npm test`, the framework automatically:
1. Cleans old reports
2. Runs all tests in parallel
3. Generates the report
4. Opens it in your browser

**Option 2: Manual report generation**
After running individual tests, you can generate and view detailed reports:

1. **Generate the report:**
   ```bash
   npm run generate:report
   ```

2. **Open the report in your browser:**
   ```bash
   npm run open:report
   ```

3. **Alternative: Open report directly with Allure:**
   ```bash
   allure open allure-report
   ```

The report will show:
- Which tests passed or failed
- Screenshots of failed tests
- Test execution history

### Writing New Tests

To add new tests, you write feature files using the Gherkin language:

```gherkin
Feature: Login functionality

  Scenario: Successful login
    Given I am on the login page
    When I enter valid credentials
    Then I should see the dashboard
```

### Configuration

#### Browser Settings
The framework is configured to use Chrome by default. You can find the settings in `playwright.config.ts`.

#### Test Data
Test data is stored in JSON files in the `TestData` folders within each test type.

### Cleaning Up

To clean old test reports before running new tests:

```bash
npm run clean:reports
```

### Troubleshooting

**Tests are slow?**
- Make sure you have a stable internet connection
- Check that the application you're testing is running

**Tests fail unexpectedly?**
- Check the generated report for screenshots
- Verify the test data is correct
- Make sure the application hasn't changed

**Installation problems?**
- Ensure Node.js is installed correctly
- Try running `npm install` again
- Check that you have internet access for downloading dependencies