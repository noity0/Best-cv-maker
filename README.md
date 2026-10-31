# AI Job-Targeted CV Builder

[![GitHub stars](https://img.shields.io/github/stars/noity0/Best-cv-maker?style=flat-square)](https://github.com/noity0/Best-cv-maker/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/noity0/Best-cv-maker?style=flat-square)](https://github.com/noity0/Best-cv-maker/issues)
[![Last commit](https://img.shields.io/github/last-commit/noity0/Best-cv-maker?style=flat-square)](https://github.com/noity0/Best-cv-maker/commits/main)

> A mobile-first CV and resume builder concept that uses job-focused questions to help people organize relevant experience into a clear, ATS-aware resume draft.

AI Job-Targeted CV Builder is an HMHS project described in the repository metadata as an intelligent CV workflow with a job-tailored interview and server-side Gemini integration.

## Project goals

- Guide users through job-specific questions about their experience.
- Help organize skills, responsibilities, and achievements.
- Generate a structured resume draft aligned with a target role.
- Provide a mobile-first interface for the CV creation workflow.
- Explore AI-assisted editing through a server-side Gemini integration.

An AI-generated CV is only a draft. Verify every employer, qualification, date, skill, and achievement. Never invent credentials or work history, and review the final document before sharing it with an employer.

## Repository contents

The current GitHub snapshot includes:

- `index.html` — application HTML entry point and page metadata.
- `metadata.json` — project name, description, and declared capabilities.
- `src/` — frontend application source.
- `server/` — server-side API implementation.
- `server.ts` — Express server entry point.
- `vite.config.ts` — Vite and API middleware configuration.

## Current setup limitation

**This repository snapshot does not currently contain a root `package.json` or dependency lockfile.** As a result, a reproducible `npm install`, development-server, or production-build command cannot be confirmed from the committed files.

To avoid giving you broken setup instructions, this README does not invent package scripts or dependency versions. The project source can be browsed and downloaded, but a standard local Node.js setup requires the missing package manifest and lockfile to be restored. This documentation-only update intentionally does not modify application code or add configuration files.

## Browse the source

```bash
git clone https://github.com/noity0/Best-cv-maker.git
cd Best-cv-maker
```

Open the project in Visual Studio Code or another editor to review the files. Do not assume the project is runnable from a fresh clone until its dependency manifest and setup process are restored and tested.

## AI and privacy notes

The repository metadata declares a server-side Gemini capability. Do not publish API keys or place secrets in frontend code. CVs can contain personal information such as contact details, education, and employment history; use test data during development and review the AI provider's privacy terms before processing real personal data.

## Contributing

High-value improvements include restoring reproducible dependency metadata, documenting environment variables, adding setup tests, improving keyboard/mobile accessibility, and validating resume exports.

- [Issues](https://github.com/noity0/Best-cv-maker/issues)
- [Source code](https://github.com/noity0/Best-cv-maker)

## License

Check for a repository `LICENSE` file. Without an explicit license, reuse and redistribution are not automatically permitted.

## Search terms

AI resume builder, CV maker, job-targeted resume, ATS-friendly resume, resume writing assistant, job interview workflow, Gemini API, mobile-first CV builder.

<!-- COMMUNITY-CONTRIBUTORS-SECTION -->
## Contributors & community

[![Contributors](https://img.shields.io/github/contributors/noity0/Best-cv-maker?style=flat-square)](https://github.com/noity0/Best-cv-maker/graphs/contributors)
[![Pull requests](https://img.shields.io/github/issues-pr/noity0/Best-cv-maker?style=flat-square)](https://github.com/noity0/Best-cv-maker/pulls)
[![Good first issues](https://img.shields.io/github/issues/noity0/Best-cv-maker/good%20first%20issue?style=flat-square)](https://github.com/noity0/Best-cv-maker/labels/good%20first%20issue)

<a href="https://github.com/noity0/Best-cv-maker/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=noity0/Best-cv-maker" alt="Contributors to Best-cv-maker" />
</a>

The contributor graphic and GitHub contributor page reflect **real GitHub contribution activity**. Names, avatars, and contribution counts are not manually invented or assigned. As this project grows, accepted pull requests and other qualifying contributions will appear automatically.

### How to contribute

1. Browse the [open issues](https://github.com/noity0/Best-cv-maker/issues) and [existing pull requests](https://github.com/noity0/Best-cv-maker/pulls) before starting work.
2. For a major change, open an issue first to discuss the proposed approach.
3. Fork the repository and create a focused feature or fix branch.
4. Keep changes scoped, document user-visible behavior, and add or update tests when applicable.
5. Run the checks documented above and include the results in your pull request.
6. Never include API keys, passwords, personal data, or other secrets in commits or screenshots.

### Open-source ecosystem

This project builds on established open-source tools and developer ecosystems documented in its technology stack. Please visit and support the upstream projects, follow their licenses, and report issues to the correct upstream repository when the problem is not caused by this project.

- [GitHub community and contribution guidelines](https://docs.github.com/en/get-started/quickstart/contributing-to-projects)
- [Open-source licenses explained](https://choosealicense.com/)

**Community note:** No celebrity, company, or upstream maintainer is represented as a project contributor or endorser unless their contribution or endorsement is independently verifiable.
