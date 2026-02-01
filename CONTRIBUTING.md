# Contributing to SubmissionApp

Thank you for your interest in contributing to SubmissionApp! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please be respectful and inclusive to others. We aim to maintain a friendly and welcoming community.

---

## Getting Started

### 1. Fork the Repository
Click the "Fork" button on GitHub to create your own copy of the project.

### 2. Clone Your Fork
```bash
git clone https://github.com/YOUR_USERNAME/SubmissionApp.git
cd SubmissionApp
```

### 3. Add Upstream Remote
```bash
git remote add upstream https://github.com/facto05/SubmissionApp.git
```

### 4. Install Dependencies
```bash
npm install
bundle install  # For iOS
```

---

## Development Workflow

### Creating a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### Committing Changes
- Use clear, descriptive commit messages
- Follow conventional commits format: `type(scope): description`
- Examples:
  - `feat(auth): add refresh token mechanism`
  - `fix(ui): correct dark mode colors`
  - `docs(readme): update installation steps`

### Pushing Changes
```bash
git push origin feature/your-feature-name
```

### Creating a Pull Request
1. Go to GitHub and create a PR from your fork
2. Provide a clear description of changes
3. Reference any related issues
4. Wait for reviews and feedback

---

## Code Style

### TypeScript/JavaScript
- Use TypeScript for all new files
- Follow the existing code style
- Use 2-space indentation
- Use meaningful variable and function names

### ESLint
```bash
npx eslint src/
```

### Prettier (if configured)
```bash
npx prettier --write src/
```

---

## Testing

### Running Tests
```bash
npm test
```

### Type Checking
```bash
npx tsc --noEmit
```

### Building
```bash
npm run android    # Android
npm run ios        # iOS
```

---

## Commit Message Guidelines

Follow the conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Test-related changes
- **chore**: Build, dependency updates, etc.

### Examples
```
feat(auth): implement token refresh mechanism

This adds automatic token refresh when access token expires.
Uses the existing refresh token to get a new access token.

Closes #123
```

---

## Pull Request Guidelines

### Before Creating a PR
- [ ] Code follows the project style
- [ ] Tests pass locally
- [ ] TypeScript has no errors
- [ ] Commit messages are clear
- [ ] Related issues are referenced

### PR Description Template
```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How to Test
Steps to verify the changes:
1. Run the app with `npm run android`
2. Navigate to login screen
3. Test with credentials...

## Related Issues
Closes #123

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No new warnings
```

---

## Architecture Guidelines

### Clean Architecture Layers

1. **Presentation Layer** (`src/presentation/`)
   - UI components and screens
   - Custom hooks
   - Context providers
   
2. **Domain Layer** (`src/domain/`)
   - Business logic
   - Entity definitions
   - Repository interfaces
   
3. **Data Layer** (`src/data/`)
   - API calls
   - Repository implementations
   - Data transformation
   
4. **Core Layer** (`src/core/`)
   - Utility functions
   - Type definitions
   - Helper functions
   
5. **Config Layer** (`src/config/`)
   - Service locator
   - Constants
   - Configuration

### Adding New Features

1. Define entity in `domain/entities/`
2. Create use case in `domain/usecases/`
3. Implement data source in `data/datasources/`
4. Create screen/component in `presentation/screens/`
5. Connect via service locator in `config/service_locator.ts`

---

## Documentation

### Update Documentation
- Keep docs up-to-date with code changes
- Update README.md for user-facing changes
- Add JSDoc comments for complex functions

### Document New Features
Create a new markdown file in the root:
```markdown
# Feature Name

## Overview
Brief description

## Usage
Code examples

## API Reference
Details about APIs used
```

---

## Testing

### Types of Tests
- **Unit Tests**: Individual functions
- **Integration Tests**: Component interactions
- **E2E Tests**: Full user workflows

### Test File Location
- Unit tests: `__tests__/` directory
- Use `.test.ts` or `.test.tsx` suffix

### Test Example
```typescript
describe('LoginScreen', () => {
  it('should show error when credentials are invalid', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

---

## Reporting Bugs

### Before Creating an Issue
- Search existing issues to avoid duplicates
- Check the troubleshooting guide
- Test with the latest code

### Issue Template
```markdown
## Description
What is the bug?

## Steps to Reproduce
1. 
2. 
3. 

## Expected Behavior
What should happen?

## Actual Behavior
What actually happens?

## Environment
- OS: [e.g., macOS 13]
- React Native: [version]
- Node: [version]

## Screenshots
[If applicable]
```

---

## Requesting Features

### Feature Request Template
```markdown
## Description
What is the feature you want?

## Use Case
Why do you need this feature?

## Proposed Solution
How would you implement it?

## Alternatives
Any alternative approaches?
```

---

## Code Review Process

1. Submit your PR with a clear description
2. Wait for reviewer feedback
3. Address comments and make changes
4. Push updates to your branch
5. Request re-review if needed
6. Once approved, maintainer will merge

---

## Development Tips

### Useful Commands
```bash
# Start Metro
npm start

# Run Android
npm run android

# Run iOS
npm run ios

# Type check
npx tsc --noEmit

# Lint code
npx eslint src/

# Format code
npx prettier --write src/

# Run tests
npm test

# Clean build
npm run android -- --clean
```

### Debugging
- Use React Native Debugger
- Use console.log with logger utility
- Check logcat for Android: `adb logcat`
- Check console for iOS: Xcode Debug Navigator

### Hot Reload
- Press 'R' in Metro terminal to reload
- Press 'R R' for hard reload

---

## Branch Naming Convention

- `feature/feature-name` - New features
- `fix/issue-description` - Bug fixes
- `docs/update-description` - Documentation
- `refactor/area` - Code refactoring

---

## Merge Policy

- PRs require at least 1 approval
- All checks must pass
- No conflicts with main branch
- Commits should be squashed before merge

---

## Questions?

- Open an issue for clarification
- Ask in PRs or discussions
- Check existing documentation

---

Thank you for contributing! Your efforts help make SubmissionApp better for everyone.
