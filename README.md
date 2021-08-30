Link to project deployed on heroku - [https://read-and-write-app.herokuapp.com/]

Before you run your local server, create your mongoDB database on the mongoDB atlas service and .env file in which you put the environment variables below: <br />
PORT - the port that your application is running, <br />
URI - connection string, you will take from your database on mongoDB atlas service, <br />
(SECRET_ACTIVATE, SECRET_LOGIN, SECRET_RESET) - your secret keys needed for JWT, <br />
(EMAIL, PASSWORD) - Login data to your gmail account from which activation e-mails will be sent, etc., <br />
APP_URL - Root URL to your app.

## Available Scripts

**In the project directory, you can run:**

### `npm install`

Installs dependencies required for the application.

### `npm run dev`

Runs the development server.

### `npm run watch`

Compiles TypeScript into JavaScript

**In the frontend directory, you can run:**

### `npm install`

Installs dependencies required for the application.

### `npm start`

Runs the frontend in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the frontend for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your frontend is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
