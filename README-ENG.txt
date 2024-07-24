Before Starting
Check the permissions for the init-db.sh script:
chmod +x init-db.sh

Start the project using Docker Compose:
docker-compose up --build

This will create and start all the necessary containers, as well as initialize the database.

Description
This project uses Docker Compose to manage several services, including a Nuxt.js application, a Node.js server, and a PostgreSQL database.

The Nuxt.js application will be available at http://localhost:3000.
The Node.js server will be available on port 8080.
The PostgreSQL database will be available on port 5432.
Files and Folders
docker-compose.yml - the main Docker Compose configuration file.
init-db.sh - the script for initializing the database.
backup.dump - the database dump for restoration.
portfolio/ - the directory containing the source code for the Nuxt.js application.
server-portfolio/ - the directory containing the source code for the Node.js server.

Notes
Make sure you have all the necessary dependencies for Docker and Docker Compose installed.
If you encounter issues with starting the containers, check the container logs for additional information.
