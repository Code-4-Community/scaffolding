## BHCHP Application and Admin Portal

### Setting up the repo
- Clone this repo
- Run `yarn` at the root (in vscode) to install this project's dependencies.
- You can optionally install nx globally with:
```
npm install -g nx
```
- if you don't, you'll just need to prefix the commands below with `npx` (e.g. `npx nx serve frontend`).

## Setting up your environment
- Make a copy of `example.env` (in `/apps/example.env`)
- Rename the copy to EXACTLY `.env` - If you name it anything else you risk leaking security credentials!

## Running the application
- To run just the frontend (port 4200):
```
nx serve frontend
```
- To run just the backend (port 3000):
```
nx serve backend
```
- Run both in the same terminal:
```
nx run-many -t serve -p frontend backend
```

## Testing with Postman
- Open postman
- Set the parameter to GET
- Enter `http://localhost:3000/api`
- Press SEND
- if the backend setup was successful, you should see a 200 OK response
