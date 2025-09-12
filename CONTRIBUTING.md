# Contributing to Sage & Oat

Thank you for your interest in contributing to Sage & Oat! This document provides guidelines for contributing to our recipe platform.

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Git

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/sage-and-oat.git
   cd sage-and-oat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   # Follow Supabase setup instructions
   # Run migrations
   npx supabase db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Code Style
- Follow the existing code style and patterns
- Use TypeScript strict mode
- Write meaningful commit messages following Conventional Commits
- Ensure all tests pass before submitting

### Pre-commit Hooks
We use Husky and lint-staged to ensure code quality:
- ESLint runs on staged files
- Prettier formats code
- TypeScript type checking
- Tests run automatically

### Testing
- Write tests for new features
- Maintain test coverage above 80%
- Run tests before committing: `npm run test:ci`

## Pull Request Process

### Before Submitting
1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run typecheck
   npm run test:ci
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### Submitting a PR
1. Push your branch: `git push origin feature/your-feature-name`
2. Create a Pull Request on GitHub
3. Fill out the PR template completely
4. Request review from team members

### PR Requirements
- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
- [ ] Security considerations addressed

## Code Standards

### TypeScript
- Use strict mode
- Define proper types for all functions
- Avoid `any` type
- Use interfaces for object shapes

### React/Next.js
- Use functional components with hooks
- Implement proper error boundaries
- Follow Next.js best practices
- Use proper SEO meta tags

### API Design
- Use RESTful conventions
- Implement proper error handling
- Add input validation with Zod
- Include rate limiting
- Log requests and errors

### Database
- Use parameterized queries
- Implement proper RLS policies
- Add database indexes for performance
- Follow migration best practices

## Project Structure

```
├── app/                 # Next.js app directory
├── src/
│   ├── components/      # React components
│   ├── lib/            # Utility functions
│   └── hooks/          # Custom React hooks
├── supabase/           # Database migrations
├── tests/              # E2E tests
└── docs/               # Documentation
```

## Areas for Contribution

### High Priority
- Performance optimizations
- Accessibility improvements
- Test coverage
- Documentation
- Bug fixes

### Feature Ideas
- Recipe collections
- Meal planning
- Shopping lists
- User preferences
- Recipe sharing

### Technical Improvements
- Database optimization
- Caching strategies
- Error handling
- Monitoring and logging
- Security enhancements

## Getting Help

- **Documentation**: Check the README and inline code comments
- **Issues**: Search existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions
- **Email**: contact@yourcompany.com

## Release Process

1. All PRs must be reviewed and approved
2. CI/CD pipeline must pass
3. Code is merged to main branch
4. Automated deployment to staging
5. Manual testing and approval
6. Production deployment

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the golden rule

## License

By contributing to Sage & Oat, you agree that your contributions will be licensed under the same license as the project.