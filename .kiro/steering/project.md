# Project Guidance: Expense & Budget Visualizer

## Project goal
Build a simple, responsive personal expense tracker and budget visualizer.

## Technical constraints
- Use HTML, CSS, and Vanilla JavaScript only.
- Do not use frontend frameworks or backend services.
- Persist transactions, monthly budget, and theme preference with browser Local Storage.
- Keep exactly one stylesheet in `css/style.css` and one JavaScript file in `js/script.js`.
- Keep the interface responsive and accessible with labels and useful feedback.
- Avoid unsafe HTML injection when rendering user-entered transaction names; use DOM APIs and `textContent`.

## Required features
- Transaction form: item name, amount, category (Food, Transport, Fun).
- Validate all fields and require amount greater than zero.
- Display transactions and allow deletion.
- Automatically update total spending.
- Show a pie/donut chart for category spending distribution.
- Persist data with Local Storage.

## Selected optional features
- Monthly spending summary.
- Monthly budget limit with progress indicator and warning states.
- Light/dark theme toggle.

## Code quality
- Use clear, descriptive names.
- Keep functions focused on one responsibility.
- Do not add dependencies or extra CSS/JS files without checking the assignment constraints.
