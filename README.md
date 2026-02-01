## BHCHP Application and Admin Portal - Setup for local development

### Setting up the database
Windows
- Download [PostgreSQL](https://www.postgresql.org/download/windows/)
- Say yes/ or check the box when it asks if you want to install PgAdmin with it
  - Alternatively install [PgAdmin 4](https://www.pgadmin.org/download/) separately
- Make username postgres, password can be anything you will remember

MacOS
- You can use brew to install. You may need to install pgadmin separately, [link](https://www.postgresql.org/download/macosx/)
```
brew install postrgesql
```
- Also you need to start postgres
```
brew services start postgresql
```
- Make username postgres, password can be anything you will remember 

To set up the database, open PgAdmin. Once you have set up your postgres credentials, right click on the Databases dropdown. You may need to create a Server first. You will need the default password for postgres to do this, which is root. Select “Create/-> “Database…”. Name the database exactly bhchp. 


### Setting up the dependencies
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
- Download [Postman](https://www.postman.com/)
- Open postman
- Set the parameter to GET
- Enter `http://localhost:3000/api`
- Press SEND
- if the backend setup was successful, you should see a 200 OK response
