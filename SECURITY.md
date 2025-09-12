# Security Policy

## Supported Versions

We currently support the following versions of Sage & Oat:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Sage & Oat, please report it responsibly:

1. **DO NOT** create a public GitHub issue
2. Email us at: security@yourcompany.com
3. Include as much detail as possible about the vulnerability
4. We will respond within 48 hours

## Security Measures

### Authentication & Authorization
- Supabase Auth with Row Level Security (RLS)
- JWT tokens with proper expiration
- Service role keys are server-only

### Input Validation
- All API endpoints use Zod schemas for validation
- Rate limiting on all write operations
- SQL injection protection via parameterized queries

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy restrictions

### Data Protection
- Environment variables properly secured
- No sensitive data in client bundles
- Database connections encrypted
- Regular security updates

## Security Best Practices

### For Developers
- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all user inputs
- Keep dependencies updated
- Follow the principle of least privilege

### For Users
- Use strong, unique passwords
- Enable two-factor authentication when available
- Report suspicious activity immediately
- Keep your browser updated

## Vulnerability Disclosure

We follow responsible disclosure practices:
- Vulnerabilities are kept confidential until patched
- Patches are released as soon as possible
- Credit is given to reporters (unless they prefer anonymity)
- A security advisory is published after patching

## Contact

For security-related questions or concerns:
- Email: security@yourcompany.com
- Response time: Within 48 hours