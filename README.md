# Logit

Hide a number, share the lock, see who cracks it.

- Sign up and log in with a username and password.
- Create a puzzle: set a range and a secret number, then share the link.
- Players guess and get "too low" or "too high" hints.
- Once someone solves it, they (and the creator) can see who solved it and who is still guessing.

## Built with
Next.js, MongoDB, bcryptjs (password hashing), jose (login cookie).

## Run it
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in `MONGODB_URI` and `JWT_SECRET`.
3. `npm run dev` and open http://localhost:3000
