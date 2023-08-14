# Healthy Challenges

## Installation

1. Clone the repository
    ```sh
    git clone
   ```

2. Install NPM packages
   ```sh
    npm install
    ```

3. Create a .env file in the root directory and add the following:
   ```sh
    AZURE_MYSQL_HOST=<your mysql host ip>
    AZURE_MYSQL_USER=<your mysql username>
    AZURE_MYSQL_PASSWORD=<your mysql password>
    AZURE_MYSQL_DATABASE=<your db>
    AZURE_MYSQL_PORT=<your mysql port>
    AZURE_MYSQL_SSL=<your mysql ssl setting (probably false)>
    ```

4. Create the database tables
   ```sh
    node db/models.js sync
    ```

5. Start the server
    ```sh
     npm start
     ```